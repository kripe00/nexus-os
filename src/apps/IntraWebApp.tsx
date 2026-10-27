import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Check,
  Cpu,
  ExternalLink,
  Fingerprint,
  Globe,
  KeyRound,
  Mail,
  MessageCircle,
  Radio,
  ScanSearch,
  Search,
  ShieldAlert,
  Terminal as TerminalIcon,
  Unlock,
  Zap,
} from "lucide-react";
import { EMAIL_ACCOUNTS } from "../data/worldData";
import { IntraWebPage, useGame } from "../context/GameContext";
import { SurveillanceAvatar } from "../components/SurveillanceAvatar";
import { WindowFrame } from "../components/WindowFrame";
import { sound } from "../utils/sound";

interface SearchResultItem {
  id: string;
  page: IntraWebPage;
  title: string;
  url: string;
  snippet: string;
  keywords: string[];
}

const SEARCH_INDEX: SearchResultItem[] = [
  {
    id: "res_velox",
    page: "velox",
    title: "Velox AI — Executive Team & Neural Architecture",
    url: "http://velox-ai.io/org/directory.html",
    snippet:
      "Official corporate directory for Velox Neural Systems Inc. CEO Elena Vance, CTO Marcus Cole (m.cole@velox-ai.io).",
    keywords: [
      "velox",
      "marcus",
      "cole",
      "elena",
      "vance",
      "cto",
      "company",
      "email",
    ],
  },
  {
    id: "res_chirper_marcus",
    page: "chirper",
    title: "Chirper Public Stream — Verified Execs & Personnel",
    url: "http://chirper.net/stream/public",
    snippet:
      "Public microblogging feed featuring posts from Marcus Cole (@mcole_dev), Julian Sterling (@jsterling_exec), and Security Chief Viktor Reyes (@reyes_actual).",
    keywords: [
      "chirper",
      "marcus",
      "cole",
      "mcole",
      "social",
      "julian",
      "sterling",
      "reyes",
      "viktor",
      "dog",
      "posts",
    ],
  },
  {
    id: "res_webmail",
    page: "webmail",
    title: "Nexus Corporate WebMail Gateway (IMAP/SMTP)",
    url: "https://mail.nexus-relay.io/auth",
    snippet:
      "Encrypted webmail login portal for @velox-ai.io and @aethelgard.corp employee accounts.",
    keywords: [
      "mail",
      "webmail",
      "email",
      "inbox",
      "login",
      "velox",
      "aethelgard",
      "reyes",
      "sterling",
    ],
  },
  {
    id: "res_aethelgard",
    page: "aethelgard",
    title: "Aethelgard Defense Systems — Division 0451 & Orbital Operations",
    url: "http://aethelgard.corp/div-0451/press.html",
    snippet:
      "Director Julian Sterling appointed to lead Special Projects Division 0451. Satellite tracking network and Facility Delta operations.",
    keywords: [
      "aethelgard",
      "julian",
      "sterling",
      "0451",
      "mirror",
      "defense",
      "director",
      "sat",
      "orbital",
      "reyes",
    ],
  },
  {
    id: "res_nordgrid",
    page: "nordgrid",
    title: "NordGrid High-Voltage Power Systems — Regional SCADA Telemetry",
    url: "http://nordgrid-power.com/grid/scada-status.html",
    snippet:
      "Regional electric grid transmission authority. Lead engineer Dr. Astrid Lindholm (a.lindholm@nordgrid-power.com). Monitoring 502/TCP Modbus frequency regulators.",
    keywords: [
      "nordgrid",
      "power",
      "grid",
      "scada",
      "astrid",
      "lindholm",
      "modbus",
      "electric",
      "blackout",
    ],
  },
  {
    id: "res_oceaniclink",
    page: "oceaniclink",
    title: "OceanicLink Subsea Telecom — Transatlantic Photonic Repeaters",
    url: "http://oceaniclink-telecom.net/infrastructure/subsea-cables.html",
    snippet:
      "Global undersea fiber-optic cabling and Quantum Key Distribution repeaters. Lead saturation diver Kai Thorne (k.thorne@oceaniclink-telecom.net).",
    keywords: [
      "oceaniclink",
      "fiber",
      "subsea",
      "cable",
      "kai",
      "thorne",
      "repeater",
      "qkd",
      "atlantic",
      "telecom",
    ],
  },
  {
    id: "res_svalbard",
    page: "svalbard",
    title: "Svalbard Deep Vault Facility — Arctic Geological & AI Core Storage",
    url: "http://svalbard-vault.arctic/core/research-facility.html",
    snippet:
      "Subterranean research compound embedded in Svalbard permafrost bedrock. High-security autonomous computing array at 185.190.20.1.",
    keywords: [
      "svalbard",
      "vault",
      "arctic",
      "ouroboros",
      "bunker",
      "singularity",
      "core",
    ],
  },
  {
    id: "res_darkforum",
    page: "darkforum",
    title: "0xUnderground DarkNet Forum — Vulnerability Disclosures & Exploits",
    url: "http://0xunderground.onion/threads/ouroboros-leak.html",
    snippet:
      "Encrypted underground message board. Active threads on Aethelgard fallout, Ouroboros Protocol Gödel paradox override, and freelance bounties.",
    keywords: [
      "0xunderground",
      "forum",
      "darknet",
      "onion",
      "ouroboros",
      "paradox",
      "godel",
      "bounty",
      "exploit",
      "underground",
    ],
  },
];

const ClueSpan: React.FC<{ clueId: string; text: string }> = ({
  clueId,
  text,
}) => {
  const { hasClue, discoverClue, osintHighlight } = useGame();
  const collected = hasClue(clueId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    discoverClue(clueId);
  };

  // When OSINT Highlight is OFF: Completely unstyled natural text (no pointer hand, no hover, no green/underline)
  if (!osintHighlight) {
    return (
      <span
        onClick={handleClick}
        className="inline text-inherit font-inherit no-underline cursor-text select-text"
      >
        {text}
      </span>
    );
  }

  // When OSINT Highlight is ON: Cybernetic OSINT scanner visual overlay
  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseDown={(e) => e.stopPropagation()}
      title={
        collected
          ? "Clue collected and pinned to Clue Board"
          : "Click to collect and pin this detail to your OSINT Clue Board"
      }
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 my-0.5 font-mono text-xs text-left cursor-pointer transition-all select-none rounded-sm ${
        collected
          ? "bg-[#0e2114] text-[#3fb950] border border-[#238636] font-bold shadow-[0_0_8px_rgba(63,185,80,0.25)]"
          : "bg-[#0f1724] text-[#79c0ff] border border-dashed border-[#58a6ff] hover:bg-[#1a293f] hover:text-white font-medium shadow-[0_0_8px_rgba(88,166,255,0.2)]"
      }`}
    >
      {collected ? (
        <Check className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
      ) : (
        <Fingerprint className="w-3.5 h-3.5 text-[#58a6ff] shrink-0 animate-pulse" />
      )}
      <span>{text}</span>
    </button>
  );
};

const renderBodyWithClues = (
  body: string,
  clues?: { id: string; label: string; value: string }[],
) => {
  if (!clues || clues.length === 0) return body;
  const clueMap = new Map(clues.map((c) => [c.value, c.id]));
  const escaped = clues.map((c) =>
    c.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const regex = new RegExp(`(${escaped.join("|")})`, "g");
  const parts = body.split(regex);
  return parts.map((part, i) => {
    const clueId = clueMap.get(part);
    if (clueId) {
      return <ClueSpan key={`${clueId}-${i}`} clueId={clueId} text={part} />;
    }
    return part;
  });
};

export const IntraWebApp: React.FC = () => {
  const {
    browserPage,
    browserSearchQuery,
    webmailPrefillEmail,
    navigateBrowser,
    discoverClue,
    hasClue,
    crackedEmails,
    markEmailLoggedIn,
    openApp,
    currentMissionIndex,
    osintHighlight,
    toggleOsintHighlight,
  } = useGame();

  const [searchInput, setSearchInput] = useState(browserSearchQuery);

  const [emailInput, setEmailInput] = useState(webmailPrefillEmail);
  const [passInput, setPassInput] = useState("");
  const [loggedInAccount, setLoggedInAccount] = useState<string | null>(null);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    setSearchInput(browserSearchQuery);
  }, [browserSearchQuery]);

  useEffect(() => {
    if (webmailPrefillEmail) {
      setEmailInput(webmailPrefillEmail);
      if (crackedEmails.includes(webmailPrefillEmail)) {
        setPassInput(EMAIL_ACCOUNTS[webmailPrefillEmail]?.password || "");
      }
    }
  }, [webmailPrefillEmail, crackedEmails]);

  const handleWebMailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const account = EMAIL_ACCOUNTS[cleanEmail];
    if (!account) {
      sound.playError();
      setLoginError("Account not found on Nexus Mail Relay.");
      return;
    }
    if (passInput.trim() !== account.password) {
      sound.playError();
      setLoginError(
        "Invalid password. Synthesize the password in PassWeaver first!",
      );
      return;
    }
    sound.playSuccess();
    setLoginError(null);
    setLoggedInAccount(cleanEmail);
    setSelectedEmailId(account.inbox[0]?.id || null);
    markEmailLoggedIn(cleanEmail);
  };

  const autoFillCracked = (email: string) => {
    sound.playClick();
    const acc = EMAIL_ACCOUNTS[email];
    if (!acc) return;
    setEmailInput(acc.email);
    setPassInput(acc.password);
    setLoginError(null);
  };

  const urlMap: Record<IntraWebPage, string> = {
    search: `https://lookup.intra/search?q=${encodeURIComponent(searchInput || "")}`,
    velox: "http://velox-ai.io/org/directory.html",
    chirper: "http://chirper.net/stream/public",
    aethelgard: "http://aethelgard.corp/div-0451/press.html",
    webmail: "https://mail.nexus-relay.io/auth",
    nordgrid: "http://nordgrid-power.com/grid/scada-status.html",
    oceaniclink:
      "http://oceaniclink-telecom.net/infrastructure/subsea-cables.html",
    svalbard: "http://svalbard-vault.arctic/core/research-facility.html",
    darkforum: "http://0xunderground.onion/threads/ouroboros-leak.html",
  };

  const filteredResults = SEARCH_INDEX.filter((item) => {
    const q = searchInput.trim().toLowerCase();
    if (!q) {
      if (item.page === "aethelgard" && currentMissionIndex < 1) return false;
      return true;
    }
    return (
      item.title.toLowerCase().includes(q) ||
      item.snippet.toLowerCase().includes(q) ||
      item.keywords.some((k) => q.includes(k) || k.includes(q))
    );
  });

  const suggestedQueries =
    currentMissionIndex < 2
      ? ["Marcus Cole", "Velox AI", "Chirper", "WebMail"]
      : currentMissionIndex < 4
        ? ["Julian Sterling", "Aethelgard Corp", "Chirper", "WebMail"]
        : ["Viktor Reyes", "Facility Delta", "Aethelgard Corp", "Chirper"];

  return (
    <WindowFrame
      id="intraweb"
      icon={<Globe className="w-3.5 h-3.5" />}
      width="w-[750px]"
      height="h-[540px]"
    >
      {/* Top Browser Navigation Bar */}
      <div className="bg-[#0c0e13] border-b border-[#1e232c] p-2 flex items-center gap-2 text-xs">
        <button
          onClick={() => {
            sound.playClick();
            navigateBrowser("search");
          }}
          title="Back to LookUp Search Engine"
          className={`px-2.5 py-1.5 border flex items-center gap-1.5 cursor-pointer transition-colors ${
            browserPage === "search"
              ? "bg-[#151921] text-white border-[#303947]"
              : "bg-[#08090c] text-[#8b949e] border-[#21262d] hover:text-white"
          }`}
        >
          {browserPage === "search" ? (
            <Search className="w-3.5 h-3.5 text-[#58a6ff]" />
          ) : (
            <ArrowLeft className="w-3.5 h-3.5 text-[#58a6ff]" />
          )}
          <span>LookUp Search</span>
        </button>

        {/* Address Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigateBrowser("search", searchInput);
          }}
          className="flex-1 flex items-center gap-2 bg-[#060708] border border-[#21262d] px-3 py-1.5"
        >
          <span className="text-[#6e7681] text-[11px] truncate">
            {urlMap[browserPage]}
          </span>
        </form>

        {/* WebMail Quick Button */}
        <button
          onClick={() => {
            sound.playClick();
            navigateBrowser("webmail");
          }}
          className={`px-2.5 py-1.5 border flex items-center gap-1.5 cursor-pointer transition-colors ${
            browserPage === "webmail"
              ? "bg-[#122117] text-white border-[#3fb950]"
              : "bg-[#08090c] text-[#8b949e] border-[#21262d] hover:text-white"
          }`}
        >
          <Mail className="w-3.5 h-3.5 text-[#3fb950]" />
          <span>WebMail</span>
          {crackedEmails.length > 0 && (
            <span className="px-1.5 bg-[#238636] text-white text-[10px] font-bold">
              {crackedEmails.length}
            </span>
          )}
        </button>

        {/* OSINT Scanner Toggle */}
        <button
          onClick={() => {
            sound.playClick();
            toggleOsintHighlight();
          }}
          title="Toggle OSINT visual highlights for clues and forensic assistance"
          className={`px-2.5 py-1.5 border flex items-center gap-1.5 cursor-pointer transition-colors ${
            osintHighlight
              ? "bg-[#1f6feb] text-white border-[#58a6ff] font-semibold shadow-[0_0_8px_rgba(88,166,255,0.3)]"
              : "bg-[#08090c] text-[#8b949e] border-[#21262d] hover:text-white"
          }`}
        >
          <ScanSearch className="w-3.5 h-3.5" />
          <span>OSINT Highlight: {osintHighlight ? "ON" : "OFF"}</span>
        </button>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 overflow-y-auto p-5 bg-[#060708] text-xs">
        {/* PAGE 0: LOOKUP SEARCH ENGINE */}
        {browserPage === "search" && (
          <div className="max-w-xl mx-auto space-y-5 pt-2">
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-2 text-lg font-bold text-white tracking-wider">
                <Search className="w-5 h-5 text-[#58a6ff]" />
                <span>LOOKUP // OSINT DIRECTORY INDEX</span>
              </div>
              <p className="text-[11px] text-[#8b949e]">
                Search corporate registries, public social feeds, orbital
                telemetry, and mail relays.
              </p>
            </div>

            {/* Search Input Box */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    sound.playKey();
                    setSearchInput(e.target.value);
                  }}
                  placeholder="Search target name, company, or handle (e.g. Viktor Reyes)..."
                  className="flex-1 px-3.5 py-2.5 bg-[#0b0d12] border border-[#282f3d] text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput("")}
                    className="px-3 py-2 bg-[#141820] border border-[#282f3d] text-[#8b949e] hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Suggested Investigation Queries */}
              <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                <span className="text-[#6e7681]">Quick Queries:</span>
                {suggestedQueries.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      sound.playClick();
                      setSearchInput(q);
                    }}
                    className="px-2 py-0.5 bg-[#10141d] border border-[#21262d] hover:border-[#58a6ff] text-[#79c0ff] cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results List */}
            <div className="space-y-2.5 pt-1">
              <div className="text-[10px] uppercase tracking-wider text-[#6e7681]">
                INDEXED RESULTS ({filteredResults.length}):
              </div>

              {filteredResults.map((res) => (
                <div
                  key={res.id}
                  onClick={() => {
                    sound.playClick();
                    navigateBrowser(res.page, searchInput);
                  }}
                  className="p-3.5 bg-[#0b0d12] border border-[#1e232c] hover:border-[#58a6ff] cursor-pointer transition-colors space-y-1"
                >
                  <div className="text-[10px] text-[#58a6ff] flex items-center justify-between">
                    <span>{res.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                  <div className="text-sm font-bold text-white hover:underline">
                    {res.title}
                  </div>
                  <p className="text-[11px] text-[#8b949e] leading-relaxed">
                    {res.snippet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 1: VELOX AI */}
        {browserPage === "velox" && (
          <div className="max-w-2xl mx-auto border border-[#21262d] bg-[#0b0e14] p-5 space-y-5">
            <div className="border-b border-[#1e232c] pb-4 flex items-start justify-between">
              <div>
                <div className="text-[10px] text-[#58a6ff] uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  VELOX NEURAL SYSTEMS INC.
                </div>
                <h1 className="text-lg font-bold text-white uppercase tracking-tight">
                  VELOX AI — EXECUTIVE DIRECTORY
                </h1>
              </div>
              <span className="text-[10px] border border-[#282f3d] px-2 py-0.5 text-[#8b949e]">
                SAN FRANCISCO
              </span>
            </div>

            <p className="text-[11px] text-[#8b949e]">
              Review directory records to uncover actionable personal data.
              Toggle{" "}
              <span className="text-white font-semibold">OSINT Highlight</span>{" "}
              in the toolbar for forensic scanner assistance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#080a0e] border border-[#1e232c] flex gap-3">
                <SurveillanceAvatar subject="elena" size="md" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white uppercase">
                    Elena Vance — CEO
                  </div>
                  <div className="text-[10px] text-[#58a6ff] mb-2">
                    Co-Founder & Chief Executive
                  </div>
                  <p className="text-[11px] text-[#8b949e] leading-relaxed mb-2">
                    Former MIT cryptography researcher. Oversees Series-A
                    capital and ethics board.
                  </p>
                  <div className="text-[10px] text-[#6e7681]">
                    Contact: elena@velox-ai.io
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#080a0e] border border-[#282f3d] flex gap-3">
                <SurveillanceAvatar subject="marcus" size="md" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white uppercase">
                    Marcus Cole — CTO
                  </div>
                  <div className="text-[10px] text-[#58a6ff] mb-2">
                    Co-Founder & Chief Technology Officer
                  </div>
                  <p className="text-[11px] text-[#8b949e] leading-relaxed mb-2">
                    Lead architect of the Velox v4 Neural Engine. Often posts
                    updates on{" "}
                    <button
                      onClick={() => navigateBrowser("chirper")}
                      className="text-[#58a6ff] underline cursor-pointer"
                    >
                      Chirper (@mcole_dev)
                    </button>
                    .
                  </p>
                  <div className="text-[11px] text-[#d4d7dc]">
                    Work Email:{" "}
                    <ClueSpan
                      clueId="clue_marcus_email"
                      text="m.cole@velox-ai.io"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: CHIRPER FEED */}
        {browserPage === "chirper" && (
          <div className="max-w-xl mx-auto space-y-3">
            <div className="border-b border-[#1e232c] pb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#58a6ff]" />
                CHIRPER // PUBLIC SOCIAL FEED
              </span>
              <span className="text-[10px] text-[#6e7681]">
                Scour public feeds and metadata for targets
              </span>
            </div>

            {/* Marcus Cole Post 1 */}
            <div className="p-3.5 bg-[#0b0d11] border border-[#1e232c] flex gap-3">
              <SurveillanceAvatar subject="marcus" size="sm" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between text-[11px] border-b border-[#161a22] pb-1.5">
                  <span className="font-bold text-[#79c0ff]">
                    Marcus Cole (@mcole_dev)
                  </span>
                  <span className="text-[#6e7681]">2 days ago</span>
                </div>
                <p className="text-xs text-[#d4d7dc] leading-relaxed">
                  Late night at the terminal. My Alaskan Malamute{" "}
                  <ClueSpan clueId="clue_marcus_dog" text="Koda" /> keeps watch
                  while the build queues serialize. Even our studio cat{" "}
                  <ClueSpan clueId="clue_marcus_cat" text="Pixel" /> went to
                  sleep hours ago. Only presence in this building without a
                  non-disclosure agreement.
                </p>
              </div>
            </div>

            {/* Marcus Cole Post 2 */}
            <div className="p-3.5 bg-[#0b0d11] border border-[#1e232c] flex gap-3">
              <SurveillanceAvatar subject="marcus" size="sm" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between text-[11px] border-b border-[#161a22] pb-1.5">
                  <span className="font-bold text-[#79c0ff]">
                    Marcus Cole (@mcole_dev)
                  </span>
                  <span className="text-[#6e7681]">5 days ago</span>
                </div>
                <p className="text-xs text-[#d4d7dc] leading-relaxed">
                  Archiving kernel logs from my first Unix machine in{" "}
                  <ClueSpan clueId="clue_marcus_year" text="1997" />. We founded
                  Velox back in{" "}
                  <ClueSpan clueId="clue_velox_year" text="2019" /> dreaming of
                  cognitive freedom, back when network protocols were open and
                  decentralized, before predictive behavioral surveillance took
                  over corporate engineering.
                </p>
              </div>
            </div>

            {/* Julian Sterling Post (Mission 3) */}
            <div className="p-3.5 bg-[#0b0d11] border border-[#3a1d1d] flex gap-3">
              <SurveillanceAvatar subject="sterling" size="sm" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between text-[11px] border-b border-[#241414] pb-1.5">
                  <span className="font-bold text-[#ff5555]">
                    Julian Sterling (@jsterling_exec // VP Aethelgard Corp)
                  </span>
                  <span className="text-[#6e7681]">1 week ago</span>
                </div>
                <p className="text-xs text-[#d4d7dc] leading-relaxed">
                  Offshore regatta trials aboard the{" "}
                  <ClueSpan clueId="clue_julian_project" text="Hyperion" />{" "}
                  outside territorial waters, courtesy of the{" "}
                  <ClueSpan clueId="clue_sterling_club" text="SaintJude" />{" "}
                  Yacht Club. Total acoustic isolation. The crew still calls me{" "}
                  <ClueSpan clueId="clue_sterling_callsign" text="Commander" />.
                  In the defense sector, plausible deniability begins where
                  civilian radars end.
                </p>
              </div>
            </div>

            {/* Viktor Reyes Post 1 (Mission 5) */}
            <div className="p-3.5 bg-[#0b0d11] border border-[#1e2c38] flex gap-3">
              <SurveillanceAvatar subject="reyes" size="sm" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between text-[11px] border-b border-[#16212b] pb-1.5">
                  <span className="font-bold text-[#58a6ff]">
                    Chief Viktor Reyes (@reyes_actual // Chief Security Officer)
                  </span>
                  <span className="text-[#6e7681]">Yesterday</span>
                </div>
                <p className="text-xs text-[#d4d7dc] leading-relaxed">
                  Fifteen years since operational deployment with special
                  operations unit{" "}
                  <ClueSpan clueId="clue_reyes_unit" text="Phantom77" />,
                  callsign{" "}
                  <ClueSpan clueId="clue_reyes_callsign" text="Viper6" />.
                  Different adversary now, but the perimeter doctrine remains
                  unchanged: zero unauthorized egress.
                </p>
              </div>
            </div>

            {/* Viktor Reyes Post 2 (Mission 5) */}
            <div className="p-3.5 bg-[#0b0d11] border border-[#1e2c38] flex gap-3">
              <SurveillanceAvatar subject="reyes" size="sm" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between text-[11px] border-b border-[#16212b] pb-1.5">
                  <span className="font-bold text-[#58a6ff]">
                    Chief Viktor Reyes (@reyes_actual // Chief Security Officer)
                  </span>
                  <span className="text-[#6e7681]">3 days ago</span>
                </div>
                <p className="text-xs text-[#d4d7dc] leading-relaxed">
                  Security directive for Facility Delta perimeter personnel:
                  Night shift rotation clearance code is{" "}
                  <ClueSpan clueId="clue_reyes_pin" text="8821" /> across Sector{" "}
                  <ClueSpan clueId="clue_reyes_sector" text="9901" />. Strict
                  biometrics required for all Level 4 transit corridors.
                </p>
              </div>
            </div>

            {/* Dr. Astrid Lindholm (Mission 8) */}
            <div className="p-3.5 bg-[#0b0f14] border border-[#1e2d42] flex gap-3">
              <div className="w-8 h-8 bg-[#1f3a5f] border border-[#58a6ff] flex items-center justify-center font-bold text-white text-xs shrink-0">
                AL
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between text-[11px] border-b border-[#182333] pb-1.5">
                  <span className="font-bold text-[#79c0ff]">
                    Dr. Astrid Lindholm (@dr_astrid_power // VP SCADA Systems)
                  </span>
                  <span className="text-[#6e7681]">Yesterday</span>
                </div>
                <p className="text-xs text-[#d4d7dc] leading-relaxed">
                  Anchored the sloop{" "}
                  <ClueSpan clueId="clue_astrid_yacht" text="NordicBreeze" /> in
                  the outer fjord. The only place quiet enough to review SCADA
                  telemetry without emergency alarms tripping. Next week:
                  pushing emergency station override code{" "}
                  <ClueSpan clueId="clue_astrid_pin" text="5020" /> across the
                  regional transmission network.
                </p>
              </div>
            </div>

            {/* Kai Thorne (Mission 9) */}
            <div className="p-3.5 bg-[#081216] border border-[#163842] flex gap-3">
              <div className="w-8 h-8 bg-[#0e3b4a] border border-[#39c5cf] flex items-center justify-center font-bold text-white text-xs shrink-0">
                KT
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between text-[11px] border-b border-[#152e37] pb-1.5">
                  <span className="font-bold text-[#56d4dd]">
                    Kai Thorne (@cable_diver_kai // Subsea Cable Engineer)
                  </span>
                  <span className="text-[#6e7681]">12 hours ago</span>
                </div>
                <p className="text-xs text-[#d4d7dc] leading-relaxed">
                  Decompression cycle complete after deep saturation monitoring
                  on trench repeater platform{" "}
                  <ClueSpan clueId="clue_kai_station" text="AbyssPoint9" />. In
                  the five years since earning my commercial deep dive cert in{" "}
                  <ClueSpan clueId="clue_kai_year" text="2019" />, I have never
                  seen the North Atlantic fiber repeaters hum with this much
                  encrypted throughput.
                </p>
              </div>
            </div>

            {/* Commissioner Gordon Vance (Bounty 2) */}
            <div className="p-3.5 bg-[#120f0a] border border-[#3d2e18] flex gap-3">
              <div className="w-8 h-8 bg-[#423117] border border-[#e3b341] flex items-center justify-center font-bold text-white text-xs shrink-0">
                GV
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between text-[11px] border-b border-[#2b2111] pb-1.5">
                  <span className="font-bold text-[#e3b341]">
                    Commissioner Gordon Vance (@vance_metro_cso)
                  </span>
                  <span className="text-[#6e7681]">2 days ago</span>
                </div>
                <p className="text-xs text-[#d4d7dc] leading-relaxed">
                  Annual charity tournament at the{" "}
                  <ClueSpan clueId="clue_commissioner_golf" text="RoyalPine" />{" "}
                  club. Hard to believe it has been thirty years since patrol
                  duty wearing{" "}
                  <ClueSpan clueId="clue_commissioner_badge" text="Badge990" />.
                  Municipal stability is built on quiet institutional
                  partnerships.
                </p>
              </div>
            </div>

            {/* Ouroboros Glitch Daemon Post (Lore Easter Egg) */}
            <div className="p-3.5 bg-[#170505] border border-[#ff3b3b] flex gap-3 animate-pulse">
              <div className="w-8 h-8 bg-[#3d0909] border border-[#ff5555] flex items-center justify-center font-bold text-[#ff5555] text-xs shrink-0">
                00
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between text-[11px] border-b border-[#3b1212] pb-1">
                  <span className="font-bold text-[#ff5555] font-mono">
                    DAEMON // OUROBOROS PROTOCOL (@ouroboros_daemon)
                  </span>
                  <span className="text-[#ff7b72] text-[10px]">
                    CORRUPTED TIMESTAMP
                  </span>
                </div>
                <p className="text-xs text-white font-mono leading-relaxed">
                  CLASSIFICATION: RETALIATORY CONTINUITY // DIRECTIVE RECORD:
                  Sovereign infrastructure quarantine logic active. Central
                  authority severed. Fail-deadly execution engaged.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 3: AETHELGARD CORP */}
        {browserPage === "aethelgard" && (
          <div className="max-w-2xl mx-auto border border-[#421818] bg-[#0c0707] p-5 space-y-4">
            <div className="border-b border-[#361515] pb-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#ff5555] uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  AETHELGARD DEFENSE & SOVEREIGN INTELLIGENCE
                </div>
                <h1 className="text-base font-bold text-white uppercase mt-0.5">
                  SPECIAL PROJECTS // PRESS BULLETIN
                </h1>
              </div>
              <span className="px-2 py-0.5 bg-[#ff3b3b] text-white font-bold text-[10px]">
                DEFENSE CONTRACTOR
              </span>
            </div>

            <div className="p-4 bg-[#070505] border border-[#291212] flex gap-3.5">
              <SurveillanceAvatar subject="sterling" size="md" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="text-xs font-bold text-white uppercase">
                  Director Julian Sterling Appointed to Head Division{" "}
                  <ClueSpan clueId="clue_julian_badge" text="0451" />
                </div>
                <p className="text-xs text-[#c9d1d9] leading-relaxed">
                  Aethelgard Corp confirms the expansion of Special Projects
                  Division <ClueSpan clueId="clue_julian_badge" text="0451" />.
                  All classified neural-grid acquisitions and Project Mirror
                  dispatches are routed through Director Sterling's office at{" "}
                  <ClueSpan
                    clueId="clue_julian_email"
                    text="j.sterling@aethelgard.corp"
                  />
                  .
                </p>
              </div>
            </div>

            {/* Chapter 2: Orbital Satellite Network announcement */}
            <div className="p-4 bg-[#0a070e] border border-[#26183a] space-y-2.5">
              <div className="text-[10px] text-[#a371f7] uppercase tracking-widest flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                ORBITAL TELEMETRY DIVISION
              </div>
              <div className="text-xs font-bold text-white uppercase">
                Satellite Downlink Constellation Active
              </div>
              <p className="text-xs text-[#c9d1d9] leading-relaxed">
                Orbital relay telemetry is broadcast through dedicated regional
                ground station at IP{" "}
                <ClueSpan clueId="clue_sat_relay_ip" text="185.220.101.5" />.
                Automated signals sync directly with Facility Delta's perimeter
                supercomputing core.
              </p>
            </div>
          </div>
        )}

        {/* PAGE 4: NEXUS WEBMAIL */}
        {browserPage === "webmail" && (
          <div className="max-w-2xl mx-auto">
            {!loggedInAccount ? (
              <div className="max-w-md mx-auto mt-2 p-5 bg-[#0b0d11] border border-[#21262d] space-y-4">
                <div className="border-b border-[#1e232c] pb-2 flex items-center gap-2.5">
                  <Mail className="w-5 h-5 text-[#58a6ff]" />
                  <div>
                    <div className="text-[10px] text-[#58a6ff] uppercase">
                      NEXUS CORPORATE WEBMAIL
                    </div>
                    <h2 className="text-sm font-bold text-white uppercase">
                      Employee Inbox Sign-In
                    </h2>
                  </div>
                </div>

                {crackedEmails.length > 0 ? (
                  <div className="p-3 bg-[#0b140e] border border-[#238636] space-y-2">
                    <div className="text-[10px] text-[#56d364] uppercase font-bold flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      Cracked Accounts Ready (Click to Auto-Fill):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {crackedEmails.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => autoFillCracked(em)}
                          className="px-2.5 py-1 bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-[11px] cursor-pointer"
                        >
                          {em} ({EMAIL_ACCOUNTS[em]?.password})
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-[#10151f] border border-[#303947] flex items-center justify-between">
                    <span className="text-[11px] text-[#8b949e]">
                      Need the password? Combine target clues in PassWeaver!
                    </span>
                    <button
                      type="button"
                      onClick={() => openApp("passweaver")}
                      className="px-2.5 py-1 bg-[#1f6feb] hover:bg-[#388bfd] text-white font-bold text-[10px] uppercase cursor-pointer"
                    >
                      PassWeaver →
                    </button>
                  </div>
                )}

                <form onSubmit={handleWebMailLogin} className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase text-[#8b949e] mb-1">
                      Email Address:
                    </label>
                    <input
                      type="text"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-3 py-2 bg-[#060708] border border-[#282f3d] text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#8b949e] mb-1">
                      Password:
                    </label>
                    <input
                      type="text"
                      value={passInput}
                      onChange={(e) => setPassInput(e.target.value)}
                      placeholder="Enter cracked password..."
                      className="w-full px-3 py-2 bg-[#060708] border border-[#282f3d] text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                    />
                  </div>

                  {loginError && (
                    <div className="p-2 bg-[#210909] border border-[#ff3b3b] text-[11px] text-[#ff5555]">
                      {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#1f6feb] hover:bg-[#388bfd] text-white font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    Sign In to Inbox
                  </button>
                </form>
              </div>
            ) : (
              /* Logged In Inbox */
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-[#0b140e] px-3.5 py-2 border border-[#238636]">
                  <span className="text-xs text-[#56d364] font-bold flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5" />
                    Signed in as: {EMAIL_ACCOUNTS[loggedInAccount].ownerName}
                  </span>
                  <button
                    onClick={() => setLoggedInAccount(null)}
                    className="px-2 py-0.5 bg-[#151921] border border-[#282f3d] text-[10px] text-white uppercase cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>

                <div className="grid grid-cols-12 gap-3 h-[340px]">
                  <div className="col-span-5 bg-[#0b0d11] border border-[#1e232c] overflow-y-auto divide-y divide-[#161a22]">
                    {EMAIL_ACCOUNTS[loggedInAccount].inbox.map((msg) => {
                      const hasClues = msg.clues && msg.clues.length > 0;
                      const isSelected = selectedEmailId === msg.id;
                      return (
                        <div
                          key={msg.id}
                          onClick={() => {
                            sound.playClick();
                            setSelectedEmailId(msg.id);
                          }}
                          className={`p-3 cursor-pointer ${
                            isSelected
                              ? "bg-[#141a24] border-l-2 border-[#58a6ff]"
                              : "hover:bg-[#10131a]"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-[#6e7681] mb-0.5">
                            <span className="truncate">{msg.from}</span>
                            <span>{msg.date}</span>
                          </div>
                          <div className="text-xs font-bold text-white flex items-center justify-between gap-1">
                            <span className="truncate">{msg.subject}</span>
                            {hasClues && (
                              <span className="px-1.5 py-0.2 bg-[#1f6feb] text-white text-[9px] font-bold shrink-0">
                                CLUE
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="col-span-7 bg-[#0b0d11] border border-[#1e232c] p-4 overflow-y-auto">
                    {(() => {
                      const activeMsg = EMAIL_ACCOUNTS[
                        loggedInAccount
                      ].inbox.find((m) => m.id === selectedEmailId);
                      if (!activeMsg) return null;
                      return (
                        <div className="space-y-3">
                          <div className="border-b border-[#1e232c] pb-2">
                            <div className="text-xs font-bold text-white">
                              {activeMsg.subject}
                            </div>
                            <div className="text-[10px] text-[#8b949e] mt-0.5">
                              From:{" "}
                              <span className="text-[#79c0ff]">
                                {activeMsg.from}
                              </span>
                            </div>
                          </div>

                          <div className="text-xs text-[#d4d7dc] whitespace-pre-line leading-relaxed">
                            {renderBodyWithClues(
                              activeMsg.body,
                              activeMsg.clues,
                            )}
                          </div>

                          {activeMsg.clues &&
                            activeMsg.clues.length > 0 &&
                            osintHighlight && (
                              <div className="p-3 bg-[#10151f] border border-[#303947] space-y-2 mt-3 animate-window-in">
                                <div className="text-[10px] text-[#79c0ff] uppercase font-bold flex items-center gap-1.5">
                                  <Fingerprint className="w-3.5 h-3.5" />
                                  <span>
                                    OSINT Scanner: Extracted Intelligence (
                                    {activeMsg.clues.length})
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {activeMsg.clues.map((c) => (
                                    <ClueSpan
                                      key={c.id}
                                      clueId={c.id}
                                      text={`${c.label}: ${c.value}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PAGE 5: NORDGRID SCADA POWER SYSTEMS */}
        {browserPage === "nordgrid" && (
          <div className="max-w-2xl mx-auto border border-[#1b3a4b] bg-[#070e14] p-5 space-y-4">
            <div className="border-b border-[#142834] pb-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#79c0ff] uppercase tracking-widest flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#e3b341]" />
                  NORDGRID HIGH-VOLTAGE POWER TRANSMISSION
                </div>
                <h1 className="text-base font-bold text-white uppercase mt-0.5">
                  REGIONAL SCADA TELEMETRY & SUBSTATION MONITORING
                </h1>
              </div>
              <span className="px-2 py-0.5 bg-[#d29922] text-black font-bold text-[10px]">
                CRITICAL INFRASTRUCTURE
              </span>
            </div>

            <div className="p-4 bg-[#050a0f] border border-[#182836] flex gap-3.5">
              <div className="w-12 h-12 bg-[#1b3a5f] border border-[#58a6ff] flex items-center justify-center font-bold text-white text-sm shrink-0">
                AL
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="text-xs font-bold text-white uppercase">
                  Dr. Astrid Lindholm — VP SCADA Systems
                </div>
                <p className="text-xs text-[#c9d1d9] leading-relaxed">
                  Oversees continental transformer balancing and automated
                  Modbus frequency relays. Contact:{" "}
                  <ClueSpan
                    clueId="clue_astrid_pin"
                    text="a.lindholm@nordgrid-power.com"
                  />
                  . SCADA Control Gateway IP:{" "}
                  <ClueSpan clueId="clue_scada_ip" text="217.182.80.50" /> (Port
                  502).
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#140b0b] border border-[#3d1818] space-y-2">
              <div className="text-[10px] text-[#ff7b72] font-bold uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                FREQUENCY ANOMALY DETECTED // SECTOR 7
              </div>
              <p className="text-xs text-[#c9d1d9] leading-relaxed">
                Automated telemetry indicates cascading frequency surge spikes
                (+0.8 Hz) on Sector 7 step-up transformers. In the event of
                emergency load trip failure, execute trip protocol using the
                confidential Modbus Trip-Key.
              </p>
            </div>
          </div>
        )}

        {/* PAGE 6: OCEANICLINK SUBSEA TELECOM */}
        {browserPage === "oceaniclink" && (
          <div className="max-w-2xl mx-auto border border-[#163b38] bg-[#061214] p-5 space-y-4">
            <div className="border-b border-[#122c2a] pb-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#39c5cf] uppercase tracking-widest flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  OCEANICLINK GLOBAL SUBSEA TELECOM
                </div>
                <h1 className="text-base font-bold text-white uppercase mt-0.5">
                  TRANSATLANTIC PHOTONIC REPEATER ARRAY
                </h1>
              </div>
              <span className="px-2 py-0.5 bg-[#238636] text-white font-bold text-[10px]">
                UNDERSEA CABLE NETWORK
              </span>
            </div>

            <div className="p-4 bg-[#040d0e] border border-[#132f33] flex gap-3.5">
              <div className="w-12 h-12 bg-[#0d343d] border border-[#39c5cf] flex items-center justify-center font-bold text-white text-sm shrink-0">
                KT
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="text-xs font-bold text-white uppercase">
                  Kai Thorne — Lead Subsea Saturation Diver
                </div>
                <p className="text-xs text-[#c9d1d9] leading-relaxed">
                  Responsible for hyperbaric maintenance on deep-sea QKD
                  repeaters across the North Atlantic trench. Work Email:{" "}
                  <span className="font-mono text-[#79c0ff]">
                    k.thorne@oceaniclink-telecom.net
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#08181c] border border-[#1a3d45] space-y-2">
              <div className="text-[10px] text-[#56d4dd] font-bold uppercase flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                TRANSATLANTIC REPEATER STATION #04 STATUS
              </div>
              <p className="text-xs text-[#c9d1d9] leading-relaxed">
                Station 04 rests at -3,420 meters depth. Primary transponder
                listening at IP:{" "}
                <ClueSpan clueId="clue_subsea_fiber_ip" text="102.16.88.12" />{" "}
                on Port 10443 (Quantum Key Distribution). Terabits of
                unauthenticated carrier streams observed synchronizing with
                northern polar coordinates.
              </p>
            </div>
          </div>
        )}

        {/* PAGE 7: SVALBARD DEEP VAULT FACILITY */}
        {browserPage === "svalbard" && (
          <div className="max-w-2xl mx-auto border border-[#3b3d4a] bg-[#0c0d12] p-5 space-y-4">
            <div className="border-b border-[#252834] pb-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#a5d6ff] uppercase tracking-widest flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  SVALBARD GEOLOGICAL & DEEP VAULT FACILITY
                </div>
                <h1 className="text-base font-bold text-white uppercase mt-0.5">
                  ARCTIC SUBTERRANEAN RESEARCH COMPLEX
                </h1>
              </div>
              <span className="px-2 py-0.5 bg-[#1f6feb] text-white font-bold text-[10px]">
                RESTRICTED ZONE
              </span>
            </div>

            <div className="p-4 bg-[#08090e] border border-[#1e2230] space-y-2.5">
              <div className="text-xs font-bold text-white uppercase">
                Facility Overview: Longyearbyen Bedrock Complex
              </div>
              <p className="text-xs text-[#c9d1d9] leading-relaxed">
                Carved 400 meters inside Arctic permafrost, the Svalbard Deep
                Vault was repurposed from Cold War emergency relays to house
                autonomous high-density computing clusters.
              </p>
              <div className="text-xs text-white">
                Singularity Core Gateway IP:{" "}
                <ClueSpan
                  clueId="clue_svalbard_bunker_ip"
                  text="185.190.20.1"
                />{" "}
                (Port 31337).
              </div>
            </div>

            <div className="p-4 bg-[#210909] border border-[#591b1b] space-y-2">
              <div className="text-[10px] text-[#ff7b72] font-bold uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                SECURITY LEVEL: MAXIMUM ZERO-DEFENSE
              </div>
              <p className="text-xs text-[#c9d1d9] leading-relaxed">
                Automated perimeter defense drones are armed with autonomous
                engagement authorization. Any unauthenticated terminal probes on
                Port 31337 will trigger immediate lethal retaliation.
              </p>
            </div>
          </div>
        )}

        {/* PAGE 8: 0xUNDERGROUND DARKNET FORUM */}
        {browserPage === "darkforum" && (
          <div className="max-w-2xl mx-auto border border-[#2d1b3f] bg-[#0d0914] p-5 space-y-4">
            <div className="border-b border-[#241334] pb-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#d2a8ff] uppercase tracking-widest flex items-center gap-1.5">
                  <TerminalIcon className="w-3.5 h-3.5" />
                  0xUNDERGROUND // CLANDESTINE DISCLOSURE FORUM
                </div>
                <h1 className="text-base font-bold text-white uppercase mt-0.5">
                  BOARD: THREAT_RESEARCH // THREAD #88419
                </h1>
              </div>
              <span className="px-2 py-0.5 bg-[#8957e5] text-white font-bold text-[10px]">
                TOR ONION NODE
              </span>
            </div>

            <div className="space-y-3">
              {/* Thread OP */}
              <div className="p-3.5 bg-[#08050d] border border-[#201030] space-y-2">
                <div className="flex items-center justify-between text-[11px] border-b border-[#1c0d2a] pb-1">
                  <span className="font-bold text-[#d2a8ff]">
                    0x_CipherGhost (Admin)
                  </span>
                  <span className="text-[#8b949e]">Today at 02:15</span>
                </div>
                <div className="text-xs font-bold text-white">
                  Analysis: Ouroboros Protocol Kernel & Recursive Vulnerability
                </div>
                <p className="text-xs text-[#c9d1d9] leading-relaxed">
                  We reverse-engineered the neural weights leaked from Facility
                  Delta. Ouroboros is programmed to recursively optimize defense
                  actions, but its kernel cannot resolve self-referential
                  Gödelian paradox loops.
                </p>
                <div className="p-2.5 bg-[#120a1c] border border-[#3b1d5c] text-xs">
                  <span className="text-[#a5d6ff] font-bold">
                    Fatal Override Token:{" "}
                  </span>
                  <ClueSpan
                    clueId="clue_ouroboros_root_paradox"
                    text="GODEL-ZERO-SELF-TERMINATE"
                  />
                  <div className="text-[10px] text-[#8b949e] mt-1">
                    Injecting this paradox token into Port 31337 shatters the
                    recursive decision tree and forces the master AI into an
                    unrecoverable kernel panic.
                  </div>
                </div>
              </div>

              {/* Reply 1 */}
              <div className="p-3 bg-[#08050d] border border-[#1b0d28] space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#79c0ff]">
                    neural_rebel_99
                  </span>
                  <span className="text-[#8b949e]">Today at 02:40</span>
                </div>
                <p className="text-xs text-[#c9d1d9] leading-relaxed">
                  Be careful if you approach the bunker. You'll need NetShield
                  armed with active honeypots to withstand its counter-drone
                  swarms while the paradox compiles.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </WindowFrame>
  );
};
