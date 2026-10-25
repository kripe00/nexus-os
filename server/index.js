import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import db from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper for hashing passwords
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// 1. Register Operator
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password || username.trim().length < 2 || password.length < 3) {
      return res.status(400).json({
        error: 'Operator handle must be at least 2 characters and passphrase at least 3 characters.',
      });
    }

    const cleanUsername = username.trim();
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(cleanUsername);
    if (existing) {
      return res.status(409).json({ error: 'Operator handle already registered in Nexus database.' });
    }

    const id = `op_${crypto.randomUUID().slice(0, 8)}`;
    const passwordHash = hashPassword(password);

    db.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)').run(
      id,
      cleanUsername,
      passwordHash
    );

    // Default audio settings
    db.prepare('INSERT INTO audio_settings (user_id, music_volume, sfx_volume, muted) VALUES (?, ?, ?, ?)').run(
      id,
      0.70,
      0.80,
      0
    );

    return res.status(201).json({
      user: { id, username: cleanUsername },
      save: null,
      audio: { musicVolume: 0.70, sfxVolume: 0.80, muted: false },
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Failed to create operator account.' });
  }
});

// 2. Login Operator
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Operator handle and passphrase required.' });
    }

    const cleanUsername = username.trim();
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(cleanUsername);
    if (!user) {
      return res.status(404).json({ error: 'Operator handle not found in Nexus database.' });
    }

    const inputHash = hashPassword(password);
    if (user.password_hash !== inputHash) {
      return res.status(401).json({ error: 'Invalid passphrase. Access denied.' });
    }

    // Retrieve save state
    const saveRow = db.prepare('SELECT state_json FROM game_saves WHERE user_id = ?').get(user.id);
    let save = null;
    if (saveRow && saveRow.state_json) {
      try {
        save = JSON.parse(saveRow.state_json);
      } catch {}
    }

    // Retrieve audio settings
    const audioRow = db.prepare('SELECT * FROM audio_settings WHERE user_id = ?').get(user.id);
    const audio = audioRow
      ? {
          musicVolume: audioRow.music_volume,
          sfxVolume: audioRow.sfx_volume,
          muted: Boolean(audioRow.muted),
        }
      : { musicVolume: 0.70, sfxVolume: 0.80, muted: false };

    return res.json({
      user: { id: user.id, username: user.username },
      save,
      audio,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal login error.' });
  }
});

// 3. Guest Operator Quick Login (in-memory or temporary DB session)
app.post('/api/auth/guest', (req, res) => {
  const guestId = `guest_${Math.floor(1000 + Math.random() * 9000)}`;
  return res.json({
    user: { id: guestId, username: `OPERATOR_${guestId.slice(-4)}` },
    save: null,
    audio: { musicVolume: 0.70, sfxVolume: 0.80, muted: false },
  });
});

// 4. Save Game State
app.post('/api/save', (req, res) => {
  try {
    const { userId, state } = req.body;
    if (!userId || !state) {
      return res.status(400).json({ error: 'userId and state required.' });
    }

    // Don't persist guests permanently to database
    if (userId.startsWith('guest_')) {
      return res.json({ success: true, guest: true });
    }

    const stateJson = JSON.stringify(state);
    db.prepare(`
      INSERT INTO game_saves (user_id, state_json, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        state_json = excluded.state_json,
        updated_at = CURRENT_TIMESTAMP
    `).run(userId, stateJson);

    return res.json({ success: true });
  } catch (err) {
    console.error('Save error:', err);
    return res.status(500).json({ error: 'Failed to write save state to database.' });
  }
});

// 5. Get Save State
app.get('/api/save/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const saveRow = db.prepare('SELECT state_json FROM game_saves WHERE user_id = ?').get(userId);
    if (!saveRow || !saveRow.state_json) {
      return res.json({ save: null });
    }
    const save = JSON.parse(saveRow.state_json);
    return res.json({ save });
  } catch (err) {
    console.error('Retrieve save error:', err);
    return res.status(500).json({ error: 'Failed to retrieve save state.' });
  }
});

// 6. Save Audio Settings
app.post('/api/audio', (req, res) => {
  try {
    const { userId, musicVolume, sfxVolume, muted } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId required.' });
    }

    if (userId.startsWith('guest_')) {
      return res.json({ success: true, guest: true });
    }

    db.prepare(`
      INSERT INTO audio_settings (user_id, music_volume, sfx_volume, muted, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        music_volume = excluded.music_volume,
        sfx_volume = excluded.sfx_volume,
        muted = excluded.muted,
        updated_at = CURRENT_TIMESTAMP
    `).run(userId, musicVolume ?? 0.70, sfxVolume ?? 0.80, muted ? 1 : 0);

    return res.json({ success: true });
  } catch (err) {
    console.error('Audio save error:', err);
    return res.status(500).json({ error: 'Failed to save audio settings.' });
  }
});

app.listen(PORT, () => {
  console.log(`[NEXUS BACKEND] Express SQLite database server listening on port ${PORT}`);
});
