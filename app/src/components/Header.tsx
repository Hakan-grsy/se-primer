import React from 'react';
import { GameState, Level, Role } from '../types';
import { Activity, Clock, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  gameState: GameState;
  role: Role | null;
  level: Level | null;
  score: number;
}

export const Header: React.FC<HeaderProps> = ({ gameState, role, level }) => {
  // Determine current timeline clock
  let timeStr = '07:45';
  if (gameState === 'karar2' || gameState === 'sonuc1') {
    timeStr = '08:15';
  } else if (gameState === 'karar3' || gameState === 'sonuc2') {
    timeStr = '08:50';
  } else if (gameState === 'sonuc3' || gameState === 'iyison' || gameState === 'kotuson') {
    timeStr = '09:40';
  }

  const isCrisisActive = gameState !== 'giris';

  return (
    <header className="w-full border-b border-[#2A3B63] bg-[#0F1B33]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-[680px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#16264A] border border-[#2A3B63] flex items-center justify-center text-[#F5A23A] font-heading font-bold text-base shadow-sm">
            SE
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm tracking-tight text-[#D8E2FF]">
                SE PRIMER
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#16264A] border border-[#2A3B63] text-[#A7B8E7]">
                CRISIS ENGINE
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] hidden sm:block">
              Hastane LBS Olayı · Simülasyon
            </p>
          </div>
        </div>

        {/* Status & Clock */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isCrisisActive && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#16264A] border border-[#2A3B63] font-mono text-xs text-[#D8E2FF]">
              <Clock className="w-3.5 h-3.5 text-[#F5A23A]" />
              <span className="font-semibold tracking-wider">{timeStr}</span>
            </div>
          )}

          {isCrisisActive && (
            <div className={`hidden xs:flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono border ${
              gameState === 'iyison'
                ? 'bg-[#3CCB7F]/10 border-[#3CCB7F]/30 text-[#3CCB7F]'
                : gameState === 'kotuson'
                ? 'bg-[#F05454]/10 border-[#F05454]/30 text-[#F05454]'
                : 'bg-[#F5A23A]/10 border-[#F5A23A]/30 text-[#F5A23A]'
            }`}>
              {gameState === 'iyison' ? (
                <>
                  <Activity className="w-3 h-3 text-[#3CCB7F]" />
                  <span>STABİL</span>
                </>
              ) : gameState === 'kotuson' ? (
                <>
                  <ShieldAlert className="w-3 h-3 text-[#F05454]" />
                  <span>KRİTİK</span>
                </>
              ) : (
                <>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F5A23A] animate-ping" />
                  <span>MÜDAHALE</span>
                </>
              )}
            </div>
          )}

          {role && (
            <div className="hidden md:block text-[11px] font-mono text-[#94A3B8] max-w-[120px] truncate">
              {role}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
