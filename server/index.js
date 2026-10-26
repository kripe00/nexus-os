import express from "express";
import cors from "cors";
import crypto from "crypto";
import db from "./database.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Helper for hashing passwords
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Session helpers for active operator
function setActiveSession(userId) {
  try {
    db.prepare(
      `
      INSERT INTO active_session (id, user_id, updated_at)
      VALUES (1, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        user_id = excluded.user_id,
        updated_at = CURRENT_TIMESTAMP
    `,
    ).run(userId);
  } catch (err) {
    console.error("Failed to set active session:", err);
  }
}

function clearActiveSession() {
  try {
    db.prepare("DELETE FROM active_session WHERE id = 1").run();
  } catch (err) {}
}

// 0. Get Active Session (auto-resume on reload)
app.get("/api/auth/session", (req, res) => {
  try {
    const sessionRow = db
      .prepare("SELECT user_id FROM active_session WHERE id = 1")
      .get();
    if (!sessionRow || !sessionRow.user_id) {
      return res.json({ user: null });
    }
    const user = db
      .prepare("SELECT id, username FROM users WHERE id = ?")
      .get(sessionRow.user_id);
    if (!user) {
      return res.json({ user: null });
    }
    const saveRow = db
      .prepare("SELECT state_json FROM game_saves WHERE user_id = ?")
      .get(user.id);
    let save = null;
    if (saveRow && saveRow.state_json) {
      try {
        save = JSON.parse(saveRow.state_json);
      } catch {}
    }
    const audioRow = db
      .prepare("SELECT * FROM audio_settings WHERE user_id = ?")
      .get(user.id);
    const audio = audioRow
      ? {
          musicVolume: audioRow.music_volume,
          sfxVolume: audioRow.sfx_volume,
          muted: Boolean(audioRow.muted),
        }
      : { musicVolume: 0.7, sfxVolume: 0.8, muted: false };

    return res.json({ user, save, audio });
  } catch (err) {
    console.error("Session retrieval error:", err);
    return res.json({ user: null });
  }
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  clearActiveSession();
  return res.json({ success: true });
});

// 1. Register Operator
app.post("/api/auth/register", (req, res) => {
  try {
    const { username, password } = req.body;
    if (
      !username ||
      !password ||
      username.trim().length < 2 ||
      password.length < 3
    ) {
      return res.status(400).json({
        error:
          "Operator handle must be at least 2 characters and passphrase at least 3 characters.",
      });
    }

    const cleanUsername = username.trim();
    const existing = db
      .prepare("SELECT id FROM users WHERE username = ?")
      .get(cleanUsername);
    if (existing) {
      return res.status(409).json({
        error: "Operator handle already registered in Nexus database.",
      });
    }

    const id = `op_${crypto.randomUUID().slice(0, 8)}`;
    const passwordHash = hashPassword(password);

    db.prepare(
      "INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)",
    ).run(id, cleanUsername, passwordHash);

    // Default audio settings
    db.prepare(
      "INSERT INTO audio_settings (user_id, music_volume, sfx_volume, muted) VALUES (?, ?, ?, ?)",
    ).run(id, 0.7, 0.8, 0);

    setActiveSession(id);

    return res.status(201).json({
      user: { id, username: cleanUsername },
      save: null,
      audio: { musicVolume: 0.7, sfxVolume: 0.8, muted: false },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res
      .status(500)
      .json({ error: "Failed to create operator account." });
  }
});

// 2. Login Operator
app.post("/api/auth/login", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Operator handle and passphrase required." });
    }

    const cleanUsername = username.trim();
    const user = db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(cleanUsername);
    if (!user) {
      return res
        .status(404)
        .json({ error: "Operator handle not found in Nexus database." });
    }

    const inputHash = hashPassword(password);
    if (user.password_hash !== inputHash) {
      return res
        .status(401)
        .json({ error: "Invalid passphrase. Access denied." });
    }

    // Retrieve save state
    const saveRow = db
      .prepare("SELECT state_json FROM game_saves WHERE user_id = ?")
      .get(user.id);
    let save = null;
    if (saveRow && saveRow.state_json) {
      try {
        save = JSON.parse(saveRow.state_json);
      } catch {}
    }

    // Retrieve audio settings
    const audioRow = db
      .prepare("SELECT * FROM audio_settings WHERE user_id = ?")
      .get(user.id);
    const audio = audioRow
      ? {
          musicVolume: audioRow.music_volume,
          sfxVolume: audioRow.sfx_volume,
          muted: Boolean(audioRow.muted),
        }
      : { musicVolume: 0.7, sfxVolume: 0.8, muted: false };

    setActiveSession(user.id);

    return res.json({
      user: { id: user.id, username: user.username },
      save,
      audio,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal login error." });
  }
});

// 3. Guest Operator Quick Login (persisted in SQLite for seamless play)
app.post("/api/auth/guest", (req, res) => {
  const guestId = `guest_${crypto.randomUUID().slice(0, 8)}`;
  const cleanUsername = `GUEST_${guestId.slice(-4).toUpperCase()}`;

  try {
    db.prepare(
      `
      INSERT INTO users (id, username, password_hash)
      VALUES (?, ?, ?)
      ON CONFLICT(id) DO NOTHING
    `,
    ).run(guestId, cleanUsername, "guest_auth");

    db.prepare(
      `
      INSERT INTO audio_settings (user_id, music_volume, sfx_volume, muted)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id) DO NOTHING
    `,
    ).run(guestId, 0.7, 0.8, 0);

    db.prepare("DELETE FROM game_saves WHERE user_id = ?").run(guestId);

    setActiveSession(guestId);

    return res.json({
      user: { id: guestId, username: cleanUsername },
      save: null,
      audio: { musicVolume: 0.7, sfxVolume: 0.8, muted: false },
    });
  } catch (err) {
    console.error("Guest creation error:", err);
    return res.json({
      user: { id: guestId, username: cleanUsername },
      save: null,
      audio: { musicVolume: 0.7, sfxVolume: 0.8, muted: false },
    });
  }
});

// 4. Save Game State (or Wipe if state is null)
app.post("/api/save", (req, res) => {
  try {
    const { userId, state } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId required." });
    }

    if (state === null || state === undefined) {
      db.prepare("DELETE FROM game_saves WHERE user_id = ?").run(userId);
      return res.json({
        success: true,
        message: "Dossier wiped successfully.",
      });
    }

    const stateJson = JSON.stringify(state);
    db.prepare(
      `
      INSERT INTO game_saves (user_id, state_json, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        state_json = excluded.state_json,
        updated_at = CURRENT_TIMESTAMP
    `,
    ).run(userId, stateJson);

    return res.json({ success: true });
  } catch (err) {
    console.error("Save error:", err);
    return res
      .status(500)
      .json({ error: "Failed to write save state to database." });
  }
});

// Delete / Wipe Game Save
app.delete("/api/save/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    db.prepare("DELETE FROM game_saves WHERE user_id = ?").run(userId);
    return res.json({ success: true, message: "Dossier wiped successfully." });
  } catch (err) {
    console.error("Delete save error:", err);
    return res.status(500).json({ error: "Failed to delete save." });
  }
});

// 5. Get Save State
app.get("/api/save/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const saveRow = db
      .prepare("SELECT state_json FROM game_saves WHERE user_id = ?")
      .get(userId);
    if (!saveRow || !saveRow.state_json) {
      return res.json({ save: null });
    }
    const save = JSON.parse(saveRow.state_json);
    return res.json({ save });
  } catch (err) {
    console.error("Retrieve save error:", err);
    return res.status(500).json({ error: "Failed to retrieve save state." });
  }
});

// 6. Save Audio Settings
app.post("/api/audio", (req, res) => {
  try {
    const { userId, musicVolume, sfxVolume, muted } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId required." });
    }

    if (userId.startsWith("guest_")) {
      return res.json({ success: true, guest: true });
    }

    db.prepare(
      `
      INSERT INTO audio_settings (user_id, music_volume, sfx_volume, muted, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        music_volume = excluded.music_volume,
        sfx_volume = excluded.sfx_volume,
        muted = excluded.muted,
        updated_at = CURRENT_TIMESTAMP
    `,
    ).run(userId, musicVolume ?? 0.7, sfxVolume ?? 0.8, muted ? 1 : 0);

    return res.json({ success: true });
  } catch (err) {
    console.error("Audio save error:", err);
    return res.status(500).json({ error: "Failed to save audio settings." });
  }
});

app.listen(PORT, () => {
  console.log(
    `[NEXUS BACKEND] Express SQLite database server listening on port ${PORT}`,
  );
});
