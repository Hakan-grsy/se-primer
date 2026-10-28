import React from 'react';

interface BlueprintDiagramProps {
  status?: 'incident' | 'resolved' | 'warning';
}

export const BlueprintDiagram: React.FC<BlueprintDiagramProps> = ({ status = 'incident' }) => {
  return (
    <div className="w-full rounded-xl bg-[#121E3B] border border-[#2A3B63] p-3 text-xs overflow-hidden">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2A3B63]/60 text-[#94A3B8]">
        <div className="flex items-center gap-1.5 font-mono">
          <span className={`inline-block w-2 h-2 rounded-full ${
            status === 'resolved' ? 'bg-[#3CCB7F] shadow-[0_0_8px_#3CCB7F]' : 'bg-[#F05454] animate-pulse shadow-[0_0_8px_#F05454]'
          }`} />
          <span>TOPOLOJİ: LBS-PIPELINE // PROTOKOL vs SIRA_NO</span>
        </div>
        <span className="font-mono text-[10px] text-[#A08D7C]">v2.4.1-HOTFIX</span>
      </div>

      <div className="relative py-2 flex flex-col md:flex-row items-center justify-between gap-2 font-mono">
        {/* Node 1: LIS / Tahlil DB */}
        <div className="flex-1 w-full bg-[#16264A] border border-[#2A3B63] rounded-lg p-2 text-center">
          <div className="text-[10px] text-[#94A3B8] uppercase">Kaynak</div>
          <div className="font-semibold text-[#D8E2FF] truncate">Biyokimya DB</div>
          <div className="text-[10px] text-[#A7B8E7] mt-0.5">300 Kan Numunesi</div>
        </div>

        {/* Pipeline Connector */}
        <div className="flex flex-col items-center justify-center px-1 text-[#F5A23A]">
          <span className="text-[10px] text-[#94A3B8] hidden md:inline">SQL JOIN</span>
          <div className="w-full md:w-8 h-4 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#F5A23A] rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          {status === 'incident' ? (
            <span className="text-[9px] text-[#F05454] bg-[#F05454]/10 px-1 py-0.5 rounded border border-[#F05454]/30">
              Sıra No (Hatalı)
            </span>
          ) : (
            <span className="text-[9px] text-[#3CCB7F] bg-[#3CCB7F]/10 px-1 py-0.5 rounded border border-[#3CCB7F]/30">
              Protokol No (Doğru)
            </span>
          )}
        </div>

        {/* Node 2: Mapping Service */}
        <div className={`flex-1 w-full bg-[#16264A] rounded-lg p-2 text-center border ${
          status === 'incident' ? 'border-[#F05454]/60' : 'border-[#3CCB7F]/60'
        }`}>
          <div className="text-[10px] text-[#94A3B8] uppercase">Eşleme Servisi</div>
          <div className="font-semibold text-[#D8E2FF] truncate">Hasta Eşleştirici</div>
          <div className={`text-[10px] mt-0.5 ${status === 'incident' ? 'text-[#F05454]' : 'text-[#3CCB7F]'}`}>
            {status === 'incident' ? 'Hatalı Eşleşme!' : 'Eşleşme Sağlandı'}
          </div>
        </div>

        {/* Pipeline Connector */}
        <div className="flex flex-col items-center justify-center px-1 text-[#F5A23A]">
          <div className="w-full md:w-8 h-4 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#F5A23A] rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>

        {/* Node 3: Doctor Screen */}
        <div className="flex-1 w-full bg-[#16264A] border border-[#2A3B63] rounded-lg p-2 text-center">
          <div className="text-[10px] text-[#94A3B8] uppercase">Poliklinik</div>
          <div className="font-semibold text-[#D8E2FF] truncate">Dr. Aksoy Ekranı</div>
          <div className="text-[10px] text-[#F5A23A] mt-0.5">Sonuç Görünümü</div>
        </div>
      </div>
    </div>
  );
};
