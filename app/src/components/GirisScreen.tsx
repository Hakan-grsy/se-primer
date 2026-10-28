import React from 'react';
import { Goal, Level, Role } from '../types';
import { Check, Shield, Stethoscope, Terminal } from 'lucide-react';

interface GirisScreenProps {
  selectedLevel: Level | null;
  selectedRole: Role | null;
  selectedGoal: Goal | null;
  onSelectLevel: (lvl: Level) => void;
  onSelectRole: (role: Role) => void;
  onSelectGoal: (goal: Goal) => void;
  onStart: () => void;
}

export const GirisScreen: React.FC<GirisScreenProps> = ({
  selectedLevel,
  selectedRole,
  selectedGoal,
  onSelectLevel,
  onSelectRole,
  onSelectGoal,
  onStart,
}) => {
  const isStartEnabled = Boolean(selectedLevel && selectedRole && selectedGoal);

  const levels: { label: Level; slug: string; sub: string }[] = [
    {
      label: 'Yeni başladım',
      slug: 'level-yeni-basladim',
      sub: 'Her kararda otomatik yönlendirici ipucu desteği.',
    },
    {
      label: 'Biraz deneyimim var',
      slug: 'level-biraz-deneyimim-var',
      sub: 'İstediğinde açabileceğin ipucu butonu.',
    },
    {
      label: 'Deneyimliyim',
      slug: 'level-deneyimliyim',
      sub: 'İpucu yok. Her karar için 60 saniye zaman baskısı.',
    },
  ];

  const roles: { label: Role; slug: string; sub: string }[] = [
    {
      label: 'Backend geliştirici',
      slug: 'role-backend-gelistirici',
      sub: 'Veri hatları, sorgu mantığı ve servis performansı odağı.',
    },
    {
      label: 'Test (QA) mühendisi',
      slug: 'role-test-qa-muhendisi',
      sub: 'Regresyon riskleri, doğrulama senaryoları ve veri bütünlüğü.',
    },
    {
      label: 'Takım lideri',
      slug: 'role-takim-lideri',
      sub: 'Süreç yönetimi, kriz iletişimi ve yasal sorumluluk.',
    },
  ];

  const goals: { label: Goal; slug: string; sub: string }[] = [
    {
      label: 'Hata ayıklama',
      slug: 'goal-hata-ayiklama',
      sub: 'Kök neden analizi ve semptom-sebep ayrımı.',
    },
    {
      label: 'Test ve kalite',
      slug: 'goal-test-ve-kalite',
      sub: 'Canlı veriyi koruma, regresyon ve test ortamı disiplini.',
    },
    {
      label: 'Veri güvenliği ve KVKK',
      slug: 'goal-veri-guvenligi-ve-kvkk',
      sub: 'Sağlık verisi ihlali, 72 saat kuralı ve yasal bildirim.',
    },
  ];

  return (
    <div className="w-full py-6 space-y-6">
      {/* Simulation Brief Hero */}
      <div className="rounded-2xl bg-[#16264A] border border-[#2A3B63] p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#F5A23A]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F5A23A]/10 border border-[#F5A23A]/30 text-[#F5A23A] font-mono text-xs uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5" />
            Vaka Dosyası · 07:45
          </span>
          <span className="text-xs font-mono text-[#94A3B8]">LBS-INCIDENT-409</span>
        </div>

        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#D8E2FF] tracking-tight leading-snug">
          Laboratuvar Bilgi Sistemi Kriz Simülasyonu
        </h1>

        <p className="mt-3 text-sm sm:text-base text-[#94A3B8] leading-relaxed">
          Kritik bir hastane sisteminde nöbettesin. Sabah tahlil sonuçları bekleyen yüzlerce hasta var ve doktorlardan acil bir çağrı geldi. Simülasyona başlamak için profilini belirle.
        </p>

        <div className="mt-4 pt-4 border-t border-[#2A3B63]/60 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#94A3B8] font-mono">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#F5A23A]" />
            <span>3 Karar Noktası</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#3CCB7F]" />
            <span>KVKK & Güvenlik</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
            <span className="w-2 h-2 rounded-full bg-[#3CCB7F]" />
            <span>Gerçek Zamanlı AI Tutor</span>
          </div>
        </div>
      </div>

      {/* Soru 1: Seviye */}
      <div className="rounded-2xl bg-[#16264A] border border-[#2A3B63] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#2A3B63] text-[#F5A23A] font-mono font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="font-heading font-semibold text-lg text-[#D8E2FF]">
              Seviyen ne?
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#94A3B8]">Zorluk & Destek</span>
        </div>

        <div className="space-y-2.5">
          {levels.map((item) => {
            const isSelected = selectedLevel === item.label;
            return (
              <button
                key={item.label}
                type="button"
                data-testid={item.slug}
                onClick={() => onSelectLevel(item.label)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 min-h-[56px] relative active:scale-[0.99] cursor-pointer ${
                  isSelected
                    ? 'bg-[#1C305C] border-[#F5A23A] shadow-[0_0_12px_rgba(245,162,58,0.15)] ring-1 ring-[#F5A23A]/50'
                    : 'bg-[#16264A] border-[#2A3B63] hover:border-[#2A3B63]/90 hover:bg-[#1E2E54]'
                }`}
              >
                {/* Tactical indicator pip */}
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs mt-0.5 shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#F5A23A] text-[#0F1B33]'
                      : 'border border-[#2A3B63] text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-semibold text-sm text-[#D8E2FF]">
                    {item.label}
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">
                    {item.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Soru 2: Rol */}
      <div className="rounded-2xl bg-[#16264A] border border-[#2A3B63] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#2A3B63] text-[#F5A23A] font-mono font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="font-heading font-semibold text-lg text-[#D8E2FF]">
              Hangi roldesin?
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#94A3B8]">Perspektif</span>
        </div>

        <div className="space-y-2.5">
          {roles.map((item) => {
            const isSelected = selectedRole === item.label;
            return (
              <button
                key={item.label}
                type="button"
                data-testid={item.slug}
                onClick={() => onSelectRole(item.label)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 min-h-[56px] relative active:scale-[0.99] cursor-pointer ${
                  isSelected
                    ? 'bg-[#1C305C] border-[#F5A23A] shadow-[0_0_12px_rgba(245,162,58,0.15)] ring-1 ring-[#F5A23A]/50'
                    : 'bg-[#16264A] border-[#2A3B63] hover:border-[#2A3B63]/90 hover:bg-[#1E2E54]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs mt-0.5 shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#F5A23A] text-[#0F1B33]'
                      : 'border border-[#2A3B63] text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-semibold text-sm text-[#D8E2FF]">
                    {item.label}
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">
                    {item.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Soru 3: Hedef */}
      <div className="rounded-2xl bg-[#16264A] border border-[#2A3B63] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#2A3B63] text-[#F5A23A] font-mono font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="font-heading font-semibold text-lg text-[#D8E2FF]">
              Ne öğrenmek istiyorsun?
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#94A3B8]">Öğrenim Odak Noktası</span>
        </div>

        <div className="space-y-2.5">
          {goals.map((item) => {
            const isSelected = selectedGoal === item.label;
            return (
              <button
                key={item.label}
                type="button"
                data-testid={item.slug}
                onClick={() => onSelectGoal(item.label)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 min-h-[56px] relative active:scale-[0.99] cursor-pointer ${
                  isSelected
                    ? 'bg-[#1C305C] border-[#F5A23A] shadow-[0_0_12px_rgba(245,162,58,0.15)] ring-1 ring-[#F5A23A]/50'
                    : 'bg-[#16264A] border-[#2A3B63] hover:border-[#2A3B63]/90 hover:bg-[#1E2E54]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs mt-0.5 shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#F5A23A] text-[#0F1B33]'
                      : 'border border-[#2A3B63] text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-semibold text-sm text-[#D8E2FF]">
                    {item.label}
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">
                    {item.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-2">
        <button
          type="button"
          data-testid="start-button"
          disabled={!isStartEnabled}
          onClick={onStart}
          className={`w-full h-12 rounded-lg font-heading font-bold text-base transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-lg ${
            isStartEnabled
              ? 'bg-[#F5A23A] text-[#0F1B33] hover:bg-[#ffb34e] shadow-[#F5A23A]/20'
              : 'bg-[#2A3B63]/50 text-[#94A3B8]/50 cursor-not-allowed border border-[#2A3B63]/40'
          }`}
        >
          <span>Başla</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        {!isStartEnabled && (
          <p className="text-center text-xs text-[#94A3B8] mt-2 font-mono">
            Devam etmek için 3 soruyu da yanıtlayın
          </p>
        )}
      </div>
    </div>
  );
};
