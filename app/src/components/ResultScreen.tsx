import React from 'react';
import { DecisionConfig, OptionLetter } from '../types';
import { CheckCircle2, ChevronRight, XCircle } from 'lucide-react';

interface ResultScreenProps {
  decision: DecisionConfig;
  chosenOption: OptionLetter;
  onContinue: () => void;
  isLastDecision?: boolean;
  isTimeout?: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  decision,
  chosenOption,
  onContinue,
  isLastDecision = false,
  isTimeout = false,
}) => {
  const option = decision.options[chosenOption];
  const isCorrect = option.isCorrect;

  return (
    <div className="w-full py-6 space-y-5">
      {/* Step Tracker */}
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-xs uppercase tracking-wider text-[#A7B8E7]">
          Karar {decision.stepNumber} Sonucu · {decision.category}
        </span>
        <span
          className={`font-mono text-xs px-2.5 py-0.5 rounded border ${
            isCorrect
              ? 'bg-[#3CCB7F]/15 border-[#3CCB7F]/40 text-[#3CCB7F]'
              : 'bg-[#F05454]/15 border-[#F05454]/40 text-[#F05454]'
          }`}
        >
          {isCorrect ? '+1 Puan Kazanıldı' : '+0 Puan'}
        </span>
      </div>

      {/* Main Result Card */}
      <div
        data-testid="result-panel"
        className={`rounded-2xl bg-[#16264A] border p-5 sm:p-6 space-y-5 shadow-xl relative overflow-hidden ${
          isCorrect ? 'border-[#3CCB7F]/50' : 'border-[#F05454]/50'
        }`}
      >
        <div
          className={`absolute top-0 left-0 w-1.5 h-full ${
            isCorrect ? 'bg-[#3CCB7F]' : 'bg-[#F05454]'
          }`}
        />

        {/* Option summary */}
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              isCorrect
                ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]'
                : 'bg-[#F05454]/20 text-[#F05454]'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase text-[#94A3B8]">
                Seçimin: Seçenek {chosenOption}
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isCorrect
                    ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]'
                    : 'bg-[#F05454]/20 text-[#F05454]'
                }`}
              >
                {isCorrect ? 'Doğru Yaklaşım' : 'Riskli / Eksik Yaklaşım'}
              </span>
            </div>
            <p className="font-heading font-bold text-base sm:text-lg text-[#D8E2FF]">
              {option.title}
            </p>
          </div>
        </div>

        {/* Timeout banner shown only when choice came from timer expiring */}
        {isTimeout && (
          <div
            data-testid="timeout-message"
            className="rounded-xl bg-[#F05454]/15 border border-[#F05454]/50 p-3.5 text-xs sm:text-sm text-[#F05454] font-mono flex items-center gap-2"
          >
            <span>⏱ Süre doldu — karar verilmediği için B seçilmiş sayıldı.</span>
          </div>
        )}

        {/* Ne oldu? Section */}
        <div className="bg-[#0F1B33]/80 rounded-xl border border-[#2A3B63] p-4 space-y-1.5">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F5A23A] flex items-center gap-1.5">
            <span>Ne oldu?</span>
          </div>
          <p
            data-testid="result-what"
            className="text-sm sm:text-base text-[#D8E2FF] leading-relaxed"
          >
            {option.whatHappened}
          </p>
        </div>

        {/* Neden oldu? Section */}
        <div className="bg-[#0F1B33]/80 rounded-xl border border-[#2A3B63] p-4 space-y-1.5">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
            <span>Neden oldu?</span>
          </div>
          <p
            data-testid="result-why"
            className="text-sm sm:text-base text-[#D8E2FF] leading-relaxed"
          >
            {option.whyHappened}
          </p>
        </div>
      </div>

      {/* Devam Button */}
      <div className="pt-2">
        <button
          type="button"
          data-testid="continue-button"
          onClick={onContinue}
          className="w-full h-12 rounded-lg bg-[#F5A23A] text-[#0F1B33] font-heading font-bold text-base hover:bg-[#ffb34e] transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-lg shadow-[#F5A23A]/20"
        >
          <span>{isLastDecision ? 'Simülasyon Sonucunu Gör' : 'Devam'}</span>
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
