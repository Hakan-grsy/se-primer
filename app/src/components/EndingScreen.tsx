import React from 'react';
import { Goal, OptionLetter, Role } from '../types';
import { DECISIONS, GOAL_LEARNINGS } from '../data/scenarioData';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

interface EndingScreenProps {
  isGoodEnding: boolean;
  choices: {
    karar1: OptionLetter;
    karar2: OptionLetter;
    karar3: OptionLetter;
  };
  score: number;
  goal: Goal;
  role: Role;
  onRestart: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  isGoodEnding,
  choices,
  score,
  goal,
  onRestart,
}) => {
  const isK3B = choices.karar3 === 'B';

  const endingTitle = isGoodEnding
    ? 'Sistem ayakta, veri güvende'
    : isK3B
    ? 'Sistem ayakta ama KVKK ihlali var'
    : 'Sorun kökten çözülmedi';

  const endingText = isGoodEnding
    ? 'Hata kaynağı bulundu, 12 kayıt düzeltildi, ihlal zamanında bildirildi. Dr. Aksoy teşekkür ediyor.'
    : isK3B
    ? 'İki hafta sonra bir hasta şikâyetçi oldu, Kurul inceleme başlattı.'
    : 'İhlal bildirildi ama sorun kökten çözülmedi, ertesi sabah tekrarladı.';

  const bullets = GOAL_LEARNINGS[goal] || GOAL_LEARNINGS['Hata ayıklama'];

  const decisionRows = [
    {
      num: 1,
      title: 'Hata ayıklama',
      chosen: choices.karar1,
      option: DECISIONS.karar1.options[choices.karar1],
    },
    {
      num: 2,
      title: 'Veri bütünlüğü',
      chosen: choices.karar2,
      option: DECISIONS.karar2.options[choices.karar2],
    },
    {
      num: 3,
      title: 'KVKK & Gizlilik',
      chosen: choices.karar3,
      option: DECISIONS.karar3.options[choices.karar3],
    },
  ];

  return (
    <div
      data-testid={isGoodEnding ? 'ending-good' : 'ending-bad'}
      className="w-full py-6 space-y-6"
    >
      {/* Ending Outcome Header Card */}
      <div
        className={`rounded-2xl bg-[#16264A] border p-5 sm:p-6 space-y-4 shadow-xl relative overflow-hidden ${
          isGoodEnding ? 'border-[#3CCB7F]/60' : 'border-[#F05454]/60'
        }`}
      >
        <div
          className={`absolute top-0 left-0 w-1.5 h-full ${
            isGoodEnding ? 'bg-[#3CCB7F]' : 'bg-[#F05454]'
          }`}
        />

        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider border ${
              isGoodEnding
                ? 'bg-[#3CCB7F]/15 border-[#3CCB7F]/40 text-[#3CCB7F]'
                : 'bg-[#F05454]/15 border-[#F05454]/40 text-[#F05454]'
            }`}
          >
            {isGoodEnding ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <ShieldAlert className="w-4 h-4" />
            )}
            <span>{isGoodEnding ? 'Son A · İyi Son' : 'Son B · Kötü Son'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0F1B33] border border-[#2A3B63] font-mono text-xs text-[#D8E2FF]">
            <Clock className="w-3.5 h-3.5 text-[#F5A23A]" />
            <span>09:40</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="font-heading font-bold text-xl sm:text-2xl text-[#D8E2FF] leading-snug">
            {endingTitle}
          </h1>
          <p className="text-sm sm:text-base text-[#D8E2FF]/90 leading-relaxed">
            {endingText}
          </p>
        </div>

        {/* Score Readout */}
        <div className="pt-3 border-t border-[#2A3B63] flex items-center justify-between text-xs font-mono">
          <span className="text-[#94A3B8]">Toplam Başarı Skoru:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded ${
              score >= 2
                ? 'bg-[#3CCB7F]/15 text-[#3CCB7F]'
                : 'bg-[#F05454]/15 text-[#F05454]'
            }`}
          >
            {score} / 3 Karar Doğru
          </span>
        </div>
      </div>

      {/* Kararların List (3 rows) */}
      <div className="rounded-2xl bg-[#16264A] border border-[#2A3B63] p-5 space-y-3.5">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
          <Award className="w-4 h-4 text-[#F5A23A]" />
          <span>Kararların</span>
        </div>

        <div className="space-y-2.5">
          {decisionRows.map((row) => {
            const isCorrect = row.option.isCorrect;
            return (
              <div
                key={row.num}
                className="p-3.5 rounded-xl bg-[#0F1B33] border border-[#2A3B63] flex items-start gap-3"
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                    isCorrect
                      ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]'
                      : 'bg-[#F05454]/20 text-[#F05454]'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] mb-1">
                    <span>
                      Karar {row.num} · {row.title}
                    </span>
                    <span
                      className={`font-bold ${
                        isCorrect ? 'text-[#3CCB7F]' : 'text-[#F05454]'
                      }`}
                    >
                      Seçenek {row.chosen}
                    </span>
                  </div>
                  <p className="font-heading font-medium text-xs sm:text-sm text-[#D8E2FF] leading-relaxed">
                    {row.option.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Öğrendiklerin Card */}
      <div className="rounded-2xl bg-[#16264A] border border-[#2A3B63] p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#F5A23A]">
            <BookOpen className="w-4 h-4" />
            <span>Öğrendiklerin ({goal})</span>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8]">Mühendislik İlkeleri</span>
        </div>

        <ul className="space-y-2.5">
          {bullets.map((bullet, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-xs sm:text-sm text-[#D8E2FF] leading-relaxed bg-[#0F1B33]/60 p-3 rounded-xl border border-[#2A3B63]/60"
            >
              <span className="w-2 h-2 rounded-full bg-[#F5A23A] shrink-0 mt-1.5" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Restart and Branch Exploration Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          type="button"
          data-testid="restart-button"
          onClick={onRestart}
          className="w-full h-12 rounded-lg bg-[#F5A23A] text-[#0F1B33] font-heading font-bold text-base hover:bg-[#ffb34e] transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-lg shadow-[#F5A23A]/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Tekrar oyna</span>
        </button>

        <button
          type="button"
          data-testid="restart-button"
          onClick={onRestart}
          className="w-full h-11 rounded-lg bg-transparent border border-[#2A3B63] hover:border-[#F5A23A] text-[#F5A23A] font-heading font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer hover:bg-[#16264A]"
        >
          <Compass className="w-4 h-4" />
          <span>Diğer sonu keşfet</span>
        </button>
      </div>
    </div>
  );
};
