import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Check,
  ExternalLink,
  Fingerprint,
  Globe,
  KeyRound,
  Mail,
  MessageCircle,
  ScanSearch,
  Search,
  ShieldAlert,
  Unlock,
} from 'lucide-react';
import { EMAIL_ACCOUNTS } from '../data/worldData';
import { IntraWebPage, useGame } from '../context/GameContext';
import { WindowFrame } from '../components/WindowFrame';
import { sound } from '../utils/sound';

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
    id: 'res_velox',
    page: 'velox',
    title: 'Velox AI — Executive Team & Neural Architecture',
    url: 'http://velox-ai.io/org/directory.html',
    snippet:
      'Official corporate directory for Velox Neural Systems Inc. CEO Elena Vance, CTO Marcus Cole (m.cole@velox-ai.io).',
    keywords: ['velox', 'marcus', 'cole', 'elena', 'vance', 'cto', 'company', 'email'],
  },
  {
    id: 'res_chirper_marcus',
    page: 'chirper',
    title: 'Chirper Public Stream — @mcole_dev (Marcus Cole) & Verified Execs',
    url: 'http://chirper.net/stream/public',
    snippet:
      'Public microblogging feed featuring posts from Velox AI CTO @mcole_dev and Aethelgard VP @jsterling_exec.',
    keywords: ['chirper', 'marcus', 'cole', 'mcole', 'social', 'julian', 'sterling', 'dog', 'posts'],
  },
  {
    id: 'res_webmail',
    page: 'webmail',
    title: 'Nexus Corporate WebMail Gateway (IMAP/SMTP)',
    url: 'https://mail.nexus-relay.io/auth',
    snippet:
      'Encrypted webmail login portal for @velox-ai.io and @aethelgard.corp employee accounts.',
    keywords: ['mail', 'webmail', 'email', 'inbox', 'login', 'velox', 'aethelgard'],
  },
  {
    id: 'res_aethelgard',
    page: 'aethelgard',
    title: 'Aethelgard Defense Systems — Division 0451 Press Bulletin',
    url: 'http://aethelgard.corp/div-0451/press.html',
    snippet:
      'Director Julian Sterling appointed to lead Special Projects Division 0451 and Project Mirror neural acquisition.',
    keywords: ['aethelgard', 'julian', 'sterling', '0451', 'mirror', 'defense', 'director'],
  },
];

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
  } = useGame();

  const [searchInput, setSearchInput] = useState(browserSearchQuery);
  const [inspectMode, setInspectMode] = useState<boolean>(false);

  const [emailInput, setEmailInput] = useState(webmailPrefillEmail);
  const [passInput, setPassInput] = useState('');
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
        setPassInput(EMAIL_ACCOUNTS[webmailPrefillEmail]?.password || '');
      }
    }
  }, [webmailPrefillEmail, crackedEmails]);

  // Subtle, Natural Investigation Clue Span!
  // Looks like natural text unless hovered, already collected, or OSINT Inspector is active.
  const ClueSpan: React.FC<{ clueId: string; text: string }> = ({ clueId, text }) => {
    const collected = hasClue(clueId);
    return (
      <span
        onClick={() => discoverClue(clueId)}
        title={
          collected
            ? 'Clue pinned to Clue Board'
            : 'Click to pin this detail to your OSINT Clue Board'
        }
        className={`inline-flex items-center gap-1 px-1 transition-all cursor-pointer ${
          collected
            ? 'bg-[#0b1610] text-[#56d364] border-b border-[#3fb950] font-semibold'
            : inspectMode
            ? 'bg-[#132036] text-[#79c0ff] border border-[#58a6ff] font-semibold'
            : 'text-[#e6edf3] border-b border-dotted border-[#58a6ff]/70 hover:bg-[#132036] hover:text-[#79c0ff]'
        }`}
      >
        {collected && <Check className="w-3 h-3 text-[#3fb950] shrink-0" />}
        {!collected && inspectMode && (
          <Fingerprint className="w-3 h-3 text-[#58a6ff] shrink-0" />
        )}
        <span>{text}</span>
      </span>
    );
  };

  const handleWebMailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const account = EMAIL_ACCOUNTS[cleanEmail];
    if (!account) {
      sound.playError();
      setLoginError('Account not found on Nexus Mail Relay.');
      return;
    }
    if (passInput.trim() !== account.password) {
      sound.playError();
      setLoginError('Invalid password. Synthesize the password in PassWeaver first!');
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
    search: `https://lookup.intra/search?q=${encodeURIComponent(searchInput || '')}`,
    velox: 'http://velox-ai.io/org/directory.html',
    chirper: 'http://chirper.net/stream/public',
    aethelgard: 'http://aethelgard.corp/div-0451/press.html',
    webmail: 'https://mail.nexus-relay.io/auth',
  };

  const filteredResults = SEARCH_INDEX.filter((item) => {
    const q = searchInput.trim().toLowerCase();
    if (!q) {
      // Hide Aethelgard from default empty search until Mission 2/3 unless searched
      if (item.page === 'aethelgard' && currentMissionIndex < 1) return false;
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
      ? ['Marcus Cole', 'Velox AI', 'Chirper', 'WebMail']
      : ['Julian Sterling', 'Aethelgard Corp', 'Chirper', 'WebMail'];

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
            navigateBrowser('search');
          }}
          title="Back to LookUp Search Engine"
          className={`px-2.5 py-1.5 border flex items-center gap-1.5 cursor-pointer transition-colors ${
            browserPage === 'search'
              ? 'bg-[#151921] text-white border-[#303947]'
              : 'bg-[#08090c] text-[#8b949e] border-[#21262d] hover:text-white'
          }`}
        >
          {browserPage === 'search' ? (
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
            navigateBrowser('search', searchInput);
          }}
          className="flex-1 flex items-center gap-2 bg-[#060708] border border-[#21262d] px-3 py-1.5"
        >
          <span className="text-[#6e7681] text-[11px] truncate">{urlMap[browserPage]}</span>
        </form>

        {/* WebMail Quick Button */}
        <button
          onClick={() => {
            sound.playClick();
            navigateBrowser('webmail');
          }}
          className={`px-2.5 py-1.5 border flex items-center gap-1.5 cursor-pointer transition-colors ${
            browserPage === 'webmail'
              ? 'bg-[#122117] text-white border-[#3fb950]'
              : 'bg-[#08090c] text-[#8b949e] border-[#21262d] hover:text-white'
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
            setInspectMode(!inspectMode);
          }}
          title="Highlight extractable clues on the current page"
          className={`px-2.5 py-1.5 border flex items-center gap-1.5 cursor-pointer transition-colors ${
            inspectMode
              ? 'bg-[#1f6feb] text-white border-[#58a6ff] font-semibold'
              : 'bg-[#08090c] text-[#8b949e] border-[#21262d] hover:text-white'
          }`}
        >
          <ScanSearch className="w-3.5 h-3.5" />
          <span>OSINT Highlight: {inspectMode ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 overflow-y-auto p-5 bg-[#060708] text-xs">
        {/* PAGE 0: LOOKUP SEARCH ENGINE */}
        {browserPage === 'search' && (
          <div className="max-w-xl mx-auto space-y-5 pt-2">
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-2 text-lg font-bold text-white tracking-wider">
                <Search className="w-5 h-5 text-[#58a6ff]" />
                <span>LOOKUP // OSINT DIRECTORY INDEX</span>
              </div>
              <p className="text-[11px] text-[#8b949e]">
                Search corporate registries, public social feeds, and mail relays.
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
                  placeholder="Search target name, company, or handle (e.g. Marcus Cole)..."
                  className="flex-1 px-3.5 py-2.5 bg-[#0b0d12] border border-[#282f3d] text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput('')}
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
                  <p className="text-[11px] text-[#8b949e] leading-relaxed">{res.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 1: VELOX AI */}
        {browserPage === 'velox' && (
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
              Tip: Click on underlined details in the text (or toggle <span className="text-white">OSINT Highlight</span> above) to pin clues to your Clue Board.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#080a0e] border border-[#1e232c]">
                <div className="text-xs font-bold text-white uppercase">
                  Elena Vance — CEO
                </div>
                <div className="text-[10px] text-[#58a6ff] mb-2">
                  Co-Founder & Chief Executive
                </div>
                <p className="text-[11px] text-[#8b949e] leading-relaxed mb-2">
                  Former MIT cryptography researcher. Oversees Series-A capital and ethics board.
                </p>
                <div className="text-[10px] text-[#6e7681]">Contact: elena@velox-ai.io</div>
              </div>

              <div className="p-3.5 bg-[#080a0e] border border-[#282f3d]">
                <div className="text-xs font-bold text-white uppercase">
                  Marcus Cole — CTO
                </div>
                <div className="text-[10px] text-[#58a6ff] mb-2">
                  Co-Founder & Chief Technology Officer
                </div>
                <p className="text-[11px] text-[#8b949e] leading-relaxed mb-2">
                  Lead architect of the Velox v4 Neural Engine. Often posts updates on{' '}
                  <button
                    onClick={() => navigateBrowser('chirper')}
                    className="text-[#58a6ff] underline cursor-pointer"
                  >
                    Chirper (@mcole_dev)
                  </button>
                  .
                </p>
                <div className="text-[11px] text-[#d4d7dc]">
                  Work Email: <ClueSpan clueId="clue_marcus_email" text="m.cole@velox-ai.io" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: CHIRPER FEED */}
        {browserPage === 'chirper' && (
          <div className="max-w-xl mx-auto space-y-3">
            <div className="border-b border-[#1e232c] pb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#58a6ff]" />
                CHIRPER // PUBLIC SOCIAL FEED
              </span>
              <span className="text-[10px] text-[#6e7681]">Click details in posts to collect clues</span>
            </div>

            <div className="p-3.5 bg-[#0b0d11] border border-[#1e232c] space-y-2">
              <div className="flex items-center justify-between text-[11px] border-b border-[#161a22] pb-1.5">
                <span className="font-bold text-[#79c0ff]">
                  Marcus Cole (@mcole_dev)
                </span>
                <span className="text-[#6e7681]">2 days ago</span>
              </div>
              <p className="text-xs text-[#d4d7dc] leading-relaxed">
                Nothing beats late-night debugging sessions with my Alaskan Malamute{' '}
                <ClueSpan clueId="clue_marcus_dog" text="Koda" /> sleeping right under my standing desk. Best coding partner in the world.
              </p>
            </div>

            <div className="p-3.5 bg-[#0b0d11] border border-[#1e232c] space-y-2">
              <div className="flex items-center justify-between text-[11px] border-b border-[#161a22] pb-1.5">
                <span className="font-bold text-[#79c0ff]">
                  Marcus Cole (@mcole_dev)
                </span>
                <span className="text-[#6e7681]">5 days ago</span>
              </div>
              <p className="text-xs text-[#d4d7dc] leading-relaxed">
                Cleaning out my garage and found my first Linux workstation from{' '}
                <ClueSpan clueId="clue_marcus_year" text="1997" />. Still my lucky year—I use it on everything!
              </p>
            </div>

            <div className="p-3.5 bg-[#0b0d11] border border-[#3a1d1d] space-y-2">
              <div className="flex items-center justify-between text-[11px] border-b border-[#241414] pb-1.5">
                <span className="font-bold text-[#ff5555]">
                  Julian Sterling (@jsterling_exec // VP Aethelgard Corp)
                </span>
                <span className="text-[#6e7681]">1 week ago</span>
              </div>
              <p className="text-xs text-[#d4d7dc] leading-relaxed">
                Taking my racing yacht <ClueSpan clueId="clue_julian_project" text="Hyperion" /> out into international waters this weekend. When you build global defense architecture, silence is a luxury.
              </p>
            </div>
          </div>
        )}

        {/* PAGE 3: AETHELGARD CORP */}
        {browserPage === 'aethelgard' && (
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

            <div className="p-4 bg-[#070505] border border-[#291212] space-y-2.5">
              <div className="text-xs font-bold text-white uppercase">
                Director Julian Sterling Appointed to Head Division{' '}
                <ClueSpan clueId="clue_julian_badge" text="0451" />
              </div>
              <p className="text-xs text-[#c9d1d9] leading-relaxed">
                Aethelgard Corp confirms the expansion of Special Projects Division{' '}
                <ClueSpan clueId="clue_julian_badge" text="0451" />. All classified neural-grid acquisitions and Project Mirror dispatches are routed through Director Sterling's office at{' '}
                <ClueSpan clueId="clue_julian_email" text="j.sterling@aethelgard.corp" />.
              </p>
            </div>
          </div>
        )}

        {/* PAGE 4: NEXUS WEBMAIL */}
        {browserPage === 'webmail' && (
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
                      onClick={() => openApp('passweaver')}
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
                              ? 'bg-[#141a24] border-l-2 border-[#58a6ff]'
                              : 'hover:bg-[#10131a]'
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
                      const activeMsg = EMAIL_ACCOUNTS[loggedInAccount].inbox.find(
                        (m) => m.id === selectedEmailId
                      );
                      if (!activeMsg) return null;
                      return (
                        <div className="space-y-3">
                          <div className="border-b border-[#1e232c] pb-2">
                            <div className="text-xs font-bold text-white">
                              {activeMsg.subject}
                            </div>
                            <div className="text-[10px] text-[#8b949e] mt-0.5">
                              From: <span className="text-[#79c0ff]">{activeMsg.from}</span>
                            </div>
                          </div>

                          <div className="text-xs text-[#d4d7dc] whitespace-pre-line leading-relaxed">
                            {activeMsg.body}
                          </div>

                          {activeMsg.clues && activeMsg.clues.length > 0 && (
                            <div className="p-3 bg-[#10151f] border border-[#303947] space-y-2 mt-3">
                              <div className="text-[10px] text-[#79c0ff] uppercase font-bold">
                                Click to Pin Extracted Intelligence to Clue Board:
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
      </div>
    </WindowFrame>
  );
};
