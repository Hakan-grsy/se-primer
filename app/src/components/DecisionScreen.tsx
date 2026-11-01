import React, { useState, useEffect, useRef } from 'react';
import { DecisionConfig, DecisionMeta, Goal, Level, OptionLetter, Role } from '../types';
import { INCIDENT_INFO, SELIN_UYARILARI, getRolePrefix } from '../data/scenarioData';
import { RiskSonucu, riskHesapla } from '../model/risk';
import { AiTutor } from './AiTutor';
import { Clock, HelpCircle, Lightbulb, Phone, Shield, Timer, UserCheck } from 'lucide-react';

interface DecisionScreenProps {
  decision: DecisionConfig;
  role: Role;
  level: Level;
  goal: Goal;
  onChooseOption: (letter: OptionLetter, isTimeout?: boolean, meta?: DecisionMeta) => void;
}

export const DecisionScreen: React.FC<DecisionScreenProps> = ({
  decision,
  role,
  level,
  goal,
  onChooseOption,
}) => {
  const [showHint, setShowHint] = useState<boolean>(level === 'Yeni başladım');
  const [secondsLeft, setSecondsLeft] = useState<number>(60);

  // Davranış ölçümü (veri toplama modu). Ref kullanılıyor; süre dolunca
  // çağrılan zamanlayıcı da en güncel değerleri okuyabilsin.
  const startRef = useRef<number>(performance.now());
  const hintOpenedRef = useRef<boolean>(level === 'Yeni başladım');
  const hoverRef = useRef<{ last: OptionLetter | null; switches: number }>({ last: null, switches: 0 });
  const tutorCountRef = useRef<number>(0);

  const buildMeta = (): DecisionMeta => ({
    kararSuresiSn: Math.round((performance.now() - startRef.current) / 100) / 10,
    ipucuAcildi: hintOpenedRef.current,
    tereddutSayisi: hoverRef.current.switches,
    tutorMesajSayisi: tutorCountRef.current,
  });

  const handleHover = (letter: OptionLetter) => {
    const h = hoverRef.current;
    if (h.last && h.last !== letter) h.switches += 1;
    h.last = letter;
  };

  // Yanlış karar riski: ekran açılınca bir kez hesaplanır (spec.md §9.1).
  // Model yüklenemezse risk null kalır ve ekran v1'deki gibi görünür.
  const [risk, setRisk] = useState<RiskSonucu | null>(null);
  useEffect(() => {
    let iptal = false;
    setRisk(null);
    riskHesapla(level, decision.stepNumber).then((r) => {
      if (!iptal) setRisk(r);
    });
    return () => {
      iptal = true;
    };
  }, [decision.key, level]);

  const rolePrefix = getRolePrefix(role);
  const isDecision1 = decision.key === 'karar1';

  // Timer logic for 'Deneyimliyim' level
  useEffect(() => {
    if (level !== 'Deneyimliyim') return;

    setSecondsLeft(60);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onChooseOption('B', true, buildMeta());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [decision.key, level, onChooseOption]);

  const minutes = Math.floor(secondsLeft / 60);
  const remainingSeconds = secondsLeft % 60;
  const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;

  return (
    <div className="w-full py-6 space-y-5">
      {/* KRIZ Intro as top card of Karar 1 */}
      {isDecision1 && (
        <div className="rounded-2xl bg-[#16264A] border border-[#F5A23A]/50 p-5 shadow-[0_4px_24px_rgba(245,162,58,0.1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#F5A23A]" />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F5A23A]/10 border border-[#F5A23A]/30 text-[#F5A23A] font-mono text-[11px] font-semibold uppercase">
                <Clock className="w-3 h-3 text-[#F5A23A]" />
                {INCIDENT_INFO.clock} · NÖBET BAŞLANGICI
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#94A3B8]">
              {INCIDENT_INFO.system}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-[#F5A23A] font-medium flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              {rolePrefix} acil çağrı aldın
            </div>
            <p className="text-sm sm:text-base text-[#D8E2FF] leading-relaxed">
              "{INCIDENT_INFO.text}"
            </p>
          </div>
        </div>
      )}

      {/* Modelin ham çıktısı: parite testleri bunu okur */}
      {risk && (
        <span data-cy="p" data-testid="p-yanlis" hidden>
          {risk.pYanlis.toFixed(6)}
        </span>
      )}

      {/* Risk yüksekse kıdemli meslektaş Selin arar */}
      {risk?.mudahale && (
        <div
          data-testid="selin-card"
          className="rounded-2xl bg-[#16264A] border border-[#5CC8B0]/60 p-5 shadow-[0_4px_24px_rgba(92,200,176,0.12)] relative overflow-hidden animate-fadeIn"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#5CC8B0]" />
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-lg bg-[#5CC8B0]/15 text-[#5CC8B0] flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-[#5CC8B0] font-semibold">
              Kıdemli meslektaşın Selin arıyor
            </span>
          </div>
          <p data-testid="selin-text" className="text-sm sm:text-base text-[#D8E2FF] leading-relaxed">
            "{SELIN_UYARILARI[decision.key]}"
          </p>
        </div>
      )}

      {/* Decision Header and Step tracker */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F5A23A]" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#A7B8E7]">
            Karar {decision.stepNumber} / 3 · {decision.category}
          </span>
        </div>

        {/* 60s Countdown timer for 'Deneyimliyim' */}
        {level === 'Deneyimliyim' && (
          <div
            data-testid="timer"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs font-bold border transition-colors ${
              secondsLeft <= 15
                ? 'bg-[#F05454]/15 border-[#F05454] text-[#F05454] animate-pulse'
                : 'bg-[#16264A] border-[#2A3B63] text-[#F5A23A]'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>{formattedTime}</span>
          </div>
        )}
      </div>

      {/* Main Decision Container */}
      <div className="rounded-2xl bg-[#16264A] border border-[#2A3B63] p-5 sm:p-6 space-y-5 shadow-lg">
        <div>
          <div className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#F5A23A]" />
            Kritik Tercih Noktası
          </div>
          <h2
            data-testid="decision-title"
            className="font-heading font-bold text-lg sm:text-xl text-[#D8E2FF] leading-snug"
          >
            {decision.title}
          </h2>
        </div>

        {/* Options A & B (ONLY TITLE, NO SUBTITLES) */}
        <div className="space-y-3 pt-1">
          {/* Option A */}
          <button
            type="button"
            data-testid="option-a"
            onClick={() => onChooseOption('A', false, buildMeta())}
            onMouseEnter={() => handleHover('A')}
            className="w-full text-left p-4 rounded-xl border border-[#2A3B63] bg-[#16264A] hover:bg-[#1C305C] hover:border-[#F5A23A] transition-all flex items-start gap-3.5 min-h-[56px] relative group active:scale-[0.98] cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#2A3B63] group-hover:bg-[#F5A23A] group-hover:text-[#0F1B33] text-[#F5A23A] font-heading font-bold text-sm flex items-center justify-center shrink-0 transition-colors">
              A
            </div>
            <div className="flex-1 font-heading font-semibold text-sm sm:text-base text-[#D8E2FF] leading-relaxed pt-0.5">
              {decision.options.A.title}
            </div>
          </button>

          {/* Option B */}
          <button
            type="button"
            data-testid="option-b"
            onClick={() => onChooseOption('B', false, buildMeta())}
            onMouseEnter={() => handleHover('B')}
            className="w-full text-left p-4 rounded-xl border border-[#2A3B63] bg-[#16264A] hover:bg-[#1C305C] hover:border-[#F5A23A] transition-all flex items-start gap-3.5 min-h-[56px] relative group active:scale-[0.98] cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#2A3B63] group-hover:bg-[#F5A23A] group-hover:text-[#0F1B33] text-[#F5A23A] font-heading font-bold text-sm flex items-center justify-center shrink-0 transition-colors">
              B
            </div>
            <div className="flex-1 font-heading font-semibold text-sm sm:text-base text-[#D8E2FF] leading-relaxed pt-0.5">
              {decision.options.B.title}
            </div>
          </button>
        </div>

        {/* Hint Section based on Level */}
        {level === 'Yeni başladım' && (
          <div
            data-testid="hint-card"
            className="rounded-xl bg-[#0F1B33] border border-[#2A3B63] p-4 text-xs sm:text-sm text-[#D8E2FF] flex items-start gap-3"
          >
            <div className="w-6 h-6 rounded-md bg-[#F5A23A]/10 text-[#F5A23A] flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <div className="font-heading font-semibold text-[#F5A23A] text-xs uppercase font-mono mb-1">
                İpucu
              </div>
              <p className="leading-relaxed text-[#D8E2FF]">{decision.hint}</p>
            </div>
          </div>
        )}

        {level === 'Biraz deneyimim var' && (
          <div className="space-y-2 pt-1">
            {!showHint ? (
              <button
                type="button"
                data-testid="hint-button"
                onClick={() => {
                  hintOpenedRef.current = true;
                  setShowHint(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2A3B63] bg-[#0F1B33] hover:border-[#F5A23A]/60 text-xs font-mono text-[#F5A23A] transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>İpucu iste</span>
              </button>
            ) : (
              <div
                data-testid="hint-card"
                className="rounded-xl bg-[#0F1B33] border border-[#2A3B63] p-4 text-xs sm:text-sm text-[#D8E2FF] flex items-start gap-3 animate-fadeIn"
              >
                <div className="w-6 h-6 rounded-md bg-[#F5A23A]/10 text-[#F5A23A] flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-heading font-semibold text-[#F5A23A] text-xs uppercase font-mono mb-1">
                    İpucu
                  </div>
                  <p className="leading-relaxed text-[#D8E2FF]">{decision.hint}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Tutor on every decision screen */}
      <AiTutor
        decisionTitle={decision.title}
        optionATitle={decision.options.A.title}
        optionBTitle={decision.options.B.title}
        goal={goal}
        onUserMessage={() => {
          tutorCountRef.current += 1;
        }}
      />
    </div>
  );
};
