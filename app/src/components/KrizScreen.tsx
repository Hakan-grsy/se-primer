import React from 'react';
import { Role } from '../types';
import { INCIDENT_INFO, getRolePrefix } from '../data/scenarioData';
import { BlueprintDiagram } from './BlueprintDiagram';
import { AlertTriangle, Clock, Flame, PhoneCall, ShieldAlert, UserCheck } from 'lucide-react';

interface KrizScreenProps {
  role: Role;
  onProceed: () => void;
}

export const KrizScreen: React.FC<KrizScreenProps> = ({ role, onProceed }) => {
  const rolePrefix = getRolePrefix(role);

  return (
    <div className="w-full py-6 space-y-5">
      {/* Incident Dispatch Header Banner */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F05454] animate-ping" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#F05454] font-semibold">
            KRİTİK OLAY BİLDİRİMİ
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#16264A] border border-[#2A3B63] font-mono text-xs text-[#D8E2FF]">
          <Clock className="w-3.5 h-3.5 text-[#F5A23A]" />
          <span>{INCIDENT_INFO.clock}</span>
        </div>
      </div>

      {/* Main Crisis Narrative Sheet */}
      <div className="rounded-2xl bg-[#16264A] border border-[#F05454]/50 p-5 sm:p-6 shadow-[0_8px_32px_rgba(240,84,84,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#F05454]" />

        {/* Role Badge Callout */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F5A23A]/10 border border-[#F5A23A]/30 text-[#F5A23A] text-xs font-mono font-medium">
            <UserCheck className="w-3.5 h-3.5" />
            {rolePrefix} nöbettesin
          </span>
          <span className="text-xs font-mono text-[#94A3B8]">Öncelik: P0 (Kritik)</span>
        </div>

        {/* Urgent Callout Box */}
        <div className="bg-[#0F1B33]/80 rounded-xl border border-[#2A3B63] p-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F05454]/10 border border-[#F05454]/30 flex items-center justify-center shrink-0 text-[#F05454] mt-0.5">
              <PhoneCall className="w-4 h-4 animate-bounce" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#F5A23A] font-semibold">
                Gelen Çağrı: Dr. Aksoy (Dahiliye Polikliniği 3)
              </div>
              <p className="text-sm sm:text-base text-[#D8E2FF] leading-relaxed font-normal">
                "{rolePrefix} dinle beni: <span className="text-[#F05454] font-medium">Hastamın ekranında başka birinin kan sonuçları var!</span> Sabah 300 hasta sonuç bekliyor. Nöbetçi sensin."
              </p>
            </div>
          </div>
        </div>

        {/* Scenario Narrative Body */}
        <div className="space-y-3 text-sm sm:text-base text-[#D8E2FF] leading-relaxed">
          <p>
            Dün gece <span className="font-semibold text-[#F5A23A]">Laboratuvar Bilgi Sistemi'ne (LBS)</span> yeni sürüm (v2.4.1) yüklendi. Gece yarısı yapılan bu güncellemeden sonra sabah vardiyası başladığında ilk hatalı kan tahlili raporu fark edildi.
          </p>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Hastanenin acil servisi ve poliklinikleri şu an kan sayımı, biyokimya ve hormon testlerinin sonuçlarına göre teşhis koyuyor. Yanlış kan sonucuna göre verilecek hatalı bir ilaç veya geciken bir müdahale hastaların hayatını tehlikeye atabilir.
          </p>
        </div>

        {/* Incident telemetry badges */}
        <div className="mt-5 pt-4 border-t border-[#2A3B63] grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-[#0F1B33] border border-[#2A3B63]">
            <div className="text-[#94A3B8] text-[10px] uppercase">Risk Altındaki Veri</div>
            <div className="text-[#F05454] font-bold mt-0.5 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Özel Nitelikli Sağlık
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0F1B33] border border-[#2A3B63]">
            <div className="text-[#94A3B8] text-[10px] uppercase">Bekleyen Hasta</div>
            <div className="text-[#F5A23A] font-bold mt-0.5 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              ~300 Kişi
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0F1B33] border border-[#2A3B63] col-span-2 sm:col-span-1">
            <div className="text-[#94A3B8] text-[10px] uppercase">Yasal Boyut</div>
            <div className="text-[#D8E2FF] font-bold mt-0.5 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-[#F5A23A]" />
              KVKK İhlal Riski
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Topology View */}
      <BlueprintDiagram status="incident" />

      {/* Action Button */}
      <div className="pt-2">
        <button
          type="button"
          data-testid="kriz-start-button"
          onClick={onProceed}
          className="w-full h-12 rounded-lg bg-[#F5A23A] text-[#0F1B33] font-heading font-bold text-base hover:bg-[#ffb34e] transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-lg shadow-[#F5A23A]/20"
        >
          <span>Müdahaleyi Başlat (1. Karar)</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};
