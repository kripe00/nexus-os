import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Fish,
  Mail,
  Send,
  Shield,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { useGame } from "../context/GameContext";
import { WindowFrame } from "../components/WindowFrame";
import {
  SurveillanceAvatar,
  SurveillanceSubject,
} from "../components/SurveillanceAvatar";
import { sound } from "../utils/sound";

interface PhishTemplate {
  id: string;
  targetEmail: string;
  targetName: string;
  senderSpoof: string;
  subjectOptions: {
    id: string;
    text: string;
    isEffective: boolean;
    reason: string;
  }[];
  lureOptions: {
    id: string;
    text: string;
    payloadType: "FAKE_LOGIN" | "INFECTED_ATTACHMENT" | "URGENT_VERIFICATION";
    isEffective: boolean;
  }[];
  successfulBaitRewardClueId?: string;
  targetClueDependency?: string; // Clue needed to know how to trick them
}

const PHISH_TARGETS: PhishTemplate[] = [
  {
    id: "phish_marcus",
    targetEmail: "m.cole@velox-ai.io",
    targetName: "Marcus Cole (CTO, Velox AI)",
    senderSpoof: "support@pacificpetcare.org",
    subjectOptions: [
      {
        id: "sub_m_1",
        text: "Urgent: Koda Medical Chart & Vaccine Certificate Needed",
        isEffective: true,
        reason:
          "Target is obsessed with his dog Koda and responds immediately to veterinary notices.",
      },
      {
        id: "sub_m_2",
        text: "Series-A Investor Pitch Deck Updates",
        isEffective: false,
        reason: "Target ignores pitch decks handled by Elena Vance.",
      },
      {
        id: "sub_m_3",
        text: "Velox Server Password Reset",
        isEffective: false,
        reason: "As CTO, target recognizes internal IT spoofing easily.",
      },
    ],
    lureOptions: [
      {
        id: "lure_m_1",
        text: "Secure Portal Link: Verify Koda’s microchip registry via PacificPetCare Web Portal",
        payloadType: "FAKE_LOGIN",
        isEffective: true,
      },
      {
        id: "lure_m_2",
        text: "PDF Attachment: generic_invoice_8819.pdf.exe",
        payloadType: "INFECTED_ATTACHMENT",
        isEffective: false,
      },
    ],
    successfulBaitRewardClueId: "clue_dropoff_ip",
  },
  {
    id: "phish_reyes",
    targetEmail: "v.reyes@aethelgard.corp",
    targetName: "Chief Viktor Reyes (CSO, Facility Delta)",
    senderSpoof: "hq-command@aethelgard-defense.mil",
    subjectOptions: [
      {
        id: "sub_r_1",
        text: "Phantom77 Veteran Pension & Special Ops Honor Roll Registry",
        isEffective: true,
        reason:
          "Target takes extreme pride in his former military unit Phantom77.",
      },
      {
        id: "sub_r_2",
        text: "Lunch Catering Menu for Gatehouse Shift 8821",
        isEffective: false,
        reason: "Security Chief does not handle catering logistics.",
      },
      {
        id: "sub_r_3",
        text: "Director Sterling Calendar Invite",
        isEffective: false,
        reason: "Sterling uses internal voice channels rather than emails.",
      },
    ],
    lureOptions: [
      {
        id: "lure_r_1",
        text: "Encrypted Credential Verification Link: Confirm Military Veteran ID for Level-4 Perimeter Clearance",
        payloadType: "FAKE_LOGIN",
        isEffective: true,
      },
      {
        id: "lure_r_2",
        text: "ZIP Archive: quarterly_guard_schedules.zip",
        payloadType: "INFECTED_ATTACHMENT",
        isEffective: false,
      },
    ],
    successfulBaitRewardClueId: "clue_datacenter_core_ip",
  },
  {
    id: "phish_astrid",
    targetEmail: "a.lindholm@nordgrid-power.com",
    targetName: "Dr. Astrid Lindholm (VP SCADA Systems & Grid Stability)",
    senderSpoof: "regatta-committee@nordicyachting.org",
    subjectOptions: [
      {
        id: "sub_a_1",
        text: "Urgent: Registration Confirmation for NordicBreeze in Baltic Cup Regatta",
        isEffective: true,
        reason:
          "Target is passionate about her racing sailboat NordicBreeze and never ignores yachting notices.",
      },
      {
        id: "sub_a_2",
        text: "Quarterly NordGrid Employee Health Insurance Policy",
        isEffective: false,
        reason:
          "Target delegates human resources notifications to her administrative team.",
      },
      {
        id: "sub_a_3",
        text: "Password Reset: scada-core-01.nordgrid-power.com",
        isEffective: false,
        reason:
          "As SCADA Director, target is highly trained against generic internal IT phishing.",
      },
    ],
    lureOptions: [
      {
        id: "lure_a_1",
        text: "Secure Yachting Portal: Verify Skipper Crew List and Mooring Permit for NordicBreeze",
        payloadType: "FAKE_LOGIN",
        isEffective: true,
      },
      {
        id: "lure_a_2",
        text: "Attachment: baltic_cup_regatta_rules.exe",
        payloadType: "INFECTED_ATTACHMENT",
        isEffective: false,
      },
    ],
    successfulBaitRewardClueId: "clue_scada_ip",
  },
  {
    id: "phish_kai",
    targetEmail: "k.thorne@oceaniclink-telecom.net",
    targetName: "Kai Thorne (Lead Subsea Cable Engineer)",
    senderSpoof: "union-rep@deepseadivers-international.org",
    subjectOptions: [
      {
        id: "sub_k_1",
        text: "Hazard Pay Dispute & Emergency Hyperbaric Overtime Compensation (AbyssPoint9)",
        isEffective: true,
        reason:
          "Target is deeply frustrated by lack of overtime compensation during dangerous deep-sea dive shifts.",
      },
      {
        id: "sub_k_2",
        text: "Corporate Optical Equipment Brochure 2026",
        isEffective: false,
        reason: "Engineering field techs ignore marketing brochures.",
      },
    ],
    lureOptions: [
      {
        id: "lure_k_1",
        text: "Portal Verification: Sign Union Class-Action Claim for AbyssPoint9 Hazard Hours",
        payloadType: "FAKE_LOGIN",
        isEffective: true,
      },
      {
        id: "lure_k_2",
        text: "PDF Document: quarterly_subsea_pension.pdf.bat",
        payloadType: "INFECTED_ATTACHMENT",
        isEffective: false,
      },
    ],
    successfulBaitRewardClueId: "clue_subsea_fiber_ip",
  },
  {
    id: "phish_commissioner",
    targetEmail: "commissioner.vance@metro-police.gov",
    targetName: "Commissioner Gordon Vance (Metro Police Chief)",
    senderSpoof: "membership@royalphinegolf.com",
    subjectOptions: [
      {
        id: "sub_c_1",
        text: "Private Invitational: RoyalPine Annual Presidential Tournament & VIP Locker Access",
        isEffective: true,
        reason:
          "Commissioner Vance values his elite country club status and VIP networking above all else.",
      },
      {
        id: "sub_c_2",
        text: "Traffic Violation Report: Precinct 4",
        isEffective: false,
        reason:
          "The Police Commissioner does not review mundane traffic tickets.",
      },
    ],
    lureOptions: [
      {
        id: "lure_c_1",
        text: "Exclusive Member Portal: Confirm VIP Tee-Time & Private Lounge Reservations",
        payloadType: "FAKE_LOGIN",
        isEffective: true,
      },
    ],
    successfulBaitRewardClueId: "clue_commissioner_badge",
  },
];

export const SpearPhishApp: React.FC = () => {
  const {
    discoveredClues,
    discoverClue,
    successfulPhishes,
    markPhishSuccess,
    openApp,
    navigateBrowser,
    markEmailCracked,
  } = useGame();

  const [selectedTargetId, setSelectedTargetId] =
    useState<string>("phish_marcus");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null,
  );
  const [selectedLureId, setSelectedLureId] = useState<string | null>(null);
  const [sending, setSending] = useState<boolean>(false);
  const [phishResult, setPhishResult] = useState<{
    success: boolean;
    headline: string;
    body: string;
  } | null>(null);

  const activeTarget =
    PHISH_TARGETS.find((t) => t.id === selectedTargetId) || PHISH_TARGETS[0];
  const isTargetAlreadyPhished = successfulPhishes.includes(activeTarget.id);

  const handleSendCampaign = () => {
    if (!selectedSubjectId || !selectedLureId || sending) return;

    setSending(true);
    setPhishResult(null);
    sound.playPhishSent();

    const subject = activeTarget.subjectOptions.find(
      (s) => s.id === selectedSubjectId,
    );
    const lure = activeTarget.lureOptions.find((l) => l.id === selectedLureId);

    setTimeout(() => {
      setSending(false);
      const isSuccess = !!subject?.isEffective && !!lure?.isEffective;

      if (isSuccess) {
        sound.playSuccess();
        markPhishSuccess(activeTarget.id);
        markEmailCracked(activeTarget.targetEmail);

        if (activeTarget.successfulBaitRewardClueId) {
          discoverClue(activeTarget.successfulBaitRewardClueId);
        }

        setPhishResult({
          success: true,
          headline: `VICTIM COMPROMISED // BAIT TAKEN!`,
          body: `${activeTarget.targetName} clicked the cloned portal link and entered their corporate credentials! Session access token harvested and logged to Clue Board.`,
        });
      } else {
        sound.playError();
        setPhishResult({
          success: false,
          headline: `CAMPAIGN FAILED // TARGET SUSPICIOUS`,
          body: `Target marked email as spam or deleted it without clicking. Reason: ${
            subject?.reason ||
            "The lure looked generic and didn't match target profile."
          }`,
        });
      }
    }, 1600);
  };

  return (
    <WindowFrame
      id="spearphish"
      icon={<Fish className="w-3.5 h-3.5" />}
      width="w-[660px]"
      height="h-[520px]"
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#060708] text-xs">
        {/* Top Header */}
        <div className="p-3 bg-[#0c0e14] border border-[#1e232c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Fish className="w-4 h-4 text-[#58a6ff]" />
            <div>
              <div className="font-bold text-white text-xs uppercase">
                SPEARPHISH // SOCIAL ENGINEERING ENGINE
              </div>
              <div className="text-[11px] text-[#8b949e]">
                Craft targeted spear-phishing lures using OSINT intelligence to
                harvest credentials.
              </div>
            </div>
          </div>

          <div className="px-2 py-0.5 bg-[#151921] border border-[#303947] text-[#79c0ff] text-[10px] font-bold">
            SMTP SPOOFER READY
          </div>
        </div>

        {/* Target Profile Selection */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-[#6e7681]">
            1. SELECT RECON TARGET:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PHISH_TARGETS.map((t) => {
              const active = selectedTargetId === t.id;
              const completed = successfulPhishes.includes(t.id);
              const subjectKey: SurveillanceSubject =
                t.id === "phish_reyes" ? "reyes" : "marcus";
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTargetId(t.id);
                    setSelectedSubjectId(null);
                    setSelectedLureId(null);
                    setPhishResult(null);
                  }}
                  className={`p-2.5 text-left border cursor-pointer transition-colors flex items-center gap-3 ${
                    active
                      ? "bg-[#151921] border-[#58a6ff] text-white"
                      : "bg-[#090b0e] border-[#1e232c] text-[#8b949e] hover:border-[#303947]"
                  }`}
                >
                  <SurveillanceAvatar subject={subjectKey} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                      <span className="truncate">{t.targetName}</span>
                      {completed ? (
                        <span className="text-[#3fb950] text-[10px] flex items-center gap-1 font-semibold shrink-0">
                          <UserCheck className="w-3 h-3" /> HOOKED
                        </span>
                      ) : (
                        <span className="text-[#6e7681] text-[10px] shrink-0">
                          READY
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#79c0ff] truncate">
                      {t.targetEmail}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sender Spoof Display */}
        <div className="p-2.5 bg-[#090b0e] border border-[#1e232c] flex items-center justify-between text-[11px]">
          <span className="text-[#8b949e]">SPOOFED SENDER HEADER:</span>
          <span className="font-mono text-[#58a6ff] font-semibold">
            {activeTarget.senderSpoof}
          </span>
        </div>

        {/* Step 2: Subject Line Bait */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-[#6e7681]">
            2. CRAFT TAILORED SUBJECT LINE (BASED ON OSINT PROFILE):
          </div>
          <div className="space-y-1.5">
            {activeTarget.subjectOptions.map((sub) => {
              const isSelected = selectedSubjectId === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedSubjectId(sub.id);
                  }}
                  className={`w-full p-2.5 text-left border cursor-pointer text-xs transition-colors flex items-center justify-between ${
                    isSelected
                      ? "bg-[#17202f] border-[#58a6ff] text-white font-semibold"
                      : "bg-[#090b0e] border-[#1e232c] text-[#c9d1d9] hover:border-[#303947]"
                  }`}
                >
                  <span className="truncate">{sub.text}</span>
                  <Mail className="w-3.5 h-3.5 text-[#58a6ff] shrink-0 ml-2" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Malicious Lure / Payload */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-[#6e7681]">
            3. SELECT CALL-TO-ACTION PAYLOAD:
          </div>
          <div className="space-y-1.5">
            {activeTarget.lureOptions.map((lure) => {
              const isSelected = selectedLureId === lure.id;
              return (
                <button
                  key={lure.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedLureId(lure.id);
                  }}
                  className={`w-full p-2.5 text-left border cursor-pointer text-xs transition-colors flex items-center justify-between ${
                    isSelected
                      ? "bg-[#17202f] border-[#58a6ff] text-white font-semibold"
                      : "bg-[#090b0e] border-[#1e232c] text-[#c9d1d9] hover:border-[#303947]"
                  }`}
                >
                  <span className="truncate">{lure.text}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-[#12161f] text-[#79c0ff] border border-[#282f3d] shrink-0 ml-2">
                    {lure.payloadType}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Result Feedback Banner */}
        {phishResult && (
          <div
            className={`p-3.5 border space-y-1 text-xs ${
              phishResult.success
                ? "bg-[#0c1610] border-[#238636] text-[#56d364]"
                : "bg-[#210909] border-[#ff3b3b] text-[#ff5555]"
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              {phishResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-[#3fb950]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#ff3b3b]" />
              )}
              <span>{phishResult.headline}</span>
            </div>
            <div className="text-[11px] text-[#c9d1d9] leading-relaxed">
              {phishResult.body}
            </div>
            {phishResult.success && (
              <button
                onClick={() =>
                  navigateBrowser("webmail", "", activeTarget.targetEmail)
                }
                className="mt-2 px-3 py-1 bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-[11px] cursor-pointer"
              >
                Access Captured WebMail Inbox →
              </button>
            )}
          </div>
        )}

        {/* Send Action Button */}
        <button
          onClick={handleSendCampaign}
          disabled={!selectedSubjectId || !selectedLureId || sending}
          className="w-full py-2.5 bg-[#1f6feb] hover:bg-[#388bfd] disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          {sending
            ? "TRANSMITTING SPOOFED EMAIL..."
            : "TRANSMIT SPEARPHISH CAMPAIGN"}
        </button>
      </div>
    </WindowFrame>
  );
};
