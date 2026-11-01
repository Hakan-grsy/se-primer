import React, { useEffect, useRef, useState } from 'react';
import { DecisionKey, DecisionMeta, GameState, Goal, Level, OptionLetter, Role } from './types';
import {
  OYUNCU_KODU,
  OturumSatiri,
  OturumSayilari,
  VERI_MODU,
  oturumSayisiniGetir,
  oturumuKaydet,
  yeniOturumId,
} from './veriToplama';
import { modeliYukle } from './model/risk';
import { DECISIONS } from './data/scenarioData';
import { Header } from './components/Header';
import { GirisScreen } from './components/GirisScreen';
import { KrizScreen } from './components/KrizScreen';
import { DecisionScreen } from './components/DecisionScreen';
import { ResultScreen } from './components/ResultScreen';
import { EndingScreen } from './components/EndingScreen';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('giris');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const [choices, setChoices] = useState<{
    karar1?: OptionLetter;
    karar2?: OptionLetter;
    karar3?: OptionLetter;
  }>({});
  const [isCurrentTimeout, setIsCurrentTimeout] = useState<boolean>(false);

  // Veri toplama modu (?veri=1)
  const oturumIdRef = useRef<string>(yeniOturumId());
  const satirlarRef = useRef<OturumSatiri[]>([]);
  const [kayitliOturum, setKayitliOturum] = useState<OturumSayilari | null>(null);
  const [kayitDurumu, setKayitDurumu] = useState<'bekliyor' | 'kaydedildi' | 'hata'>('bekliyor');

  useEffect(() => {
    if (VERI_MODU) oturumSayisiniGetir().then(setKayitliOturum);
    modeliYukle(); // risk modelini oyun başlarken önceden yükle
  }, []);

  const kararKaydet = (key: DecisionKey, kararNo: number, letter: OptionLetter, isTimeout: boolean, meta?: DecisionMeta) => {
    if (!VERI_MODU || !meta || !selectedLevel || !selectedRole || !selectedGoal) return;
    const onceki = satirlarRef.current;
    if (onceki.some((s) => s.karar_no === kararNo)) return; // aynı karar iki kez kaydedilmesin
    const ortSure = onceki.length
      ? Math.round((onceki.reduce((t, s) => t + s.karar_suresi_sn, 0) / onceki.length) * 10) / 10
      : 0;
    satirlarRef.current = [
      ...onceki,
      {
        oturum_id: oturumIdRef.current,
        kaynak: 'gercek',
        oyuncu_kodu: OYUNCU_KODU,
        seviye: selectedLevel,
        rol: selectedRole,
        hedef: selectedGoal,
        karar_no: kararNo,
        onceki_yanlis_sayisi: onceki.filter((s) => s.dogru_mu === 0).length,
        onceki_ort_sure_sn: ortSure,
        karar_suresi_sn: meta.kararSuresiSn,
        ipucu_acildi: meta.ipucuAcildi ? 1 : 0,
        tereddut_sayisi: meta.tereddutSayisi,
        tutor_mesaj_sayisi: meta.tutorMesajSayisi,
        zaman_asimi: isTimeout ? 1 : 0,
        secim: letter,
        dogru_mu: DECISIONS[key].options[letter].isCorrect ? 1 : 0,
      },
    ];
  };

  // Reset all state to restart the game
  const handleReset = () => {
    oturumIdRef.current = yeniOturumId();
    satirlarRef.current = [];
    setKayitDurumu('bekliyor');
    setGameState('giris');
    setSelectedLevel(null);
    setSelectedRole(null);
    setSelectedGoal(null);
    setChoices({});
    setIsCurrentTimeout(false);
  };

  // Calculate score based on correct choices
  const calculateScore = () => {
    let score = 0;
    if (choices.karar1 && DECISIONS.karar1.options[choices.karar1].isCorrect) score += 1;
    if (choices.karar2 && DECISIONS.karar2.options[choices.karar2].isCorrect) score += 1;
    if (choices.karar3 && DECISIONS.karar3.options[choices.karar3].isCorrect) score += 1;
    return score;
  };

  const currentScore = calculateScore();

  // Handlers for decision options
  const handleChooseKarar1 = (letter: OptionLetter, isTimeout = false, meta?: DecisionMeta) => {
    kararKaydet('karar1', 1, letter, Boolean(isTimeout), meta);
    setIsCurrentTimeout(Boolean(isTimeout));
    setChoices((prev) => ({ ...prev, karar1: letter }));
    setGameState('sonuc1');
  };

  const handleChooseKarar2 = (letter: OptionLetter, isTimeout = false, meta?: DecisionMeta) => {
    kararKaydet('karar2', 2, letter, Boolean(isTimeout), meta);
    setIsCurrentTimeout(Boolean(isTimeout));
    setChoices((prev) => ({ ...prev, karar2: letter }));
    setGameState('sonuc2');
  };

  const handleChooseKarar3 = (letter: OptionLetter, isTimeout = false, meta?: DecisionMeta) => {
    kararKaydet('karar3', 3, letter, Boolean(isTimeout), meta);
    setIsCurrentTimeout(Boolean(isTimeout));
    setChoices((prev) => ({ ...prev, karar3: letter }));
    setGameState('sonuc3');
  };

  const handleFinishSonuc3 = () => {
    const finalScore =
      (choices.karar1 === 'A' ? 1 : 0) +
      (choices.karar2 === 'A' ? 1 : 0) +
      (choices.karar3 === 'A' ? 1 : 0);

    const isGoodEnding = choices.karar3 === 'A' && finalScore >= 2;
    setGameState(isGoodEnding ? 'iyison' : 'kotuson');

    if (VERI_MODU && satirlarRef.current.length === 3) {
      const satirlar = satirlarRef.current;
      satirlarRef.current = [];
      oturumuKaydet(satirlar).then((n) => {
        setKayitDurumu(n === null ? 'hata' : 'kaydedildi');
        if (n !== null) setKayitliOturum(n);
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1B33] text-[#D8E2FF] flex flex-col font-sans selection:bg-[#F5A23A] selection:text-[#0F1B33]">
      {/* Persistent Technical Operations Header */}
      <Header
        gameState={gameState}
        role={selectedRole}
        level={selectedLevel}
        score={currentScore}
      />

      {/* Main Container - Mobile-first width capped at 680px */}
      <main className="flex-1 w-full max-w-[680px] mx-auto px-4 flex flex-col justify-start">
        {gameState === 'giris' && (
          <GirisScreen
            selectedLevel={selectedLevel}
            selectedRole={selectedRole}
            selectedGoal={selectedGoal}
            onSelectLevel={setSelectedLevel}
            onSelectRole={setSelectedRole}
            onSelectGoal={setSelectedGoal}
            onStart={() => setGameState('kriz')}
          />
        )}

        {gameState === 'kriz' && selectedRole && (
          <KrizScreen
            role={selectedRole}
            onProceed={() => setGameState('karar1')}
          />
        )}

        {gameState === 'karar1' && selectedRole && selectedLevel && selectedGoal && (
          <DecisionScreen
            decision={DECISIONS.karar1}
            role={selectedRole}
            level={selectedLevel}
            goal={selectedGoal}
            onChooseOption={handleChooseKarar1}
          />
        )}

        {gameState === 'sonuc1' && choices.karar1 && (
          <ResultScreen
            decision={DECISIONS.karar1}
            chosenOption={choices.karar1}
            isTimeout={isCurrentTimeout}
            onContinue={() => {
              setIsCurrentTimeout(false);
              setGameState('karar2');
            }}
          />
        )}

        {gameState === 'karar2' && selectedRole && selectedLevel && selectedGoal && (
          <DecisionScreen
            decision={DECISIONS.karar2}
            role={selectedRole}
            level={selectedLevel}
            goal={selectedGoal}
            onChooseOption={handleChooseKarar2}
          />
        )}

        {gameState === 'sonuc2' && choices.karar2 && (
          <ResultScreen
            decision={DECISIONS.karar2}
            chosenOption={choices.karar2}
            isTimeout={isCurrentTimeout}
            onContinue={() => {
              setIsCurrentTimeout(false);
              setGameState('karar3');
            }}
          />
        )}

        {gameState === 'karar3' && selectedRole && selectedLevel && selectedGoal && (
          <DecisionScreen
            decision={DECISIONS.karar3}
            role={selectedRole}
            level={selectedLevel}
            goal={selectedGoal}
            onChooseOption={handleChooseKarar3}
          />
        )}

        {gameState === 'sonuc3' && choices.karar3 && (
          <ResultScreen
            decision={DECISIONS.karar3}
            chosenOption={choices.karar3}
            isTimeout={isCurrentTimeout}
            onContinue={() => {
              setIsCurrentTimeout(false);
              handleFinishSonuc3();
            }}
            isLastDecision
          />
        )}

        {(gameState === 'iyison' || gameState === 'kotuson') &&
          choices.karar1 &&
          choices.karar2 &&
          choices.karar3 &&
          selectedGoal &&
          selectedRole && (
            <EndingScreen
              isGoodEnding={gameState === 'iyison'}
              choices={{
                karar1: choices.karar1,
                karar2: choices.karar2,
                karar3: choices.karar3,
              }}
              score={currentScore}
              goal={selectedGoal}
              role={selectedRole}
              onRestart={handleReset}
            />
          )}
      </main>

      {VERI_MODU && (
        <div
          data-testid="veri-modu"
          className="w-full max-w-[680px] mx-auto px-4 pb-3 text-center text-xs font-mono text-[#F5A23A]"
        >
          Veri toplama modu · oyuncu {OYUNCU_KODU}: {kayitliOturum?.oyuncu ?? '?'} oturum · toplam:{' '}
          {kayitliOturum?.toplam ?? '?'}
          {kayitDurumu === 'kaydedildi' && ' · bu oturum kaydedildi ✓'}
          {kayitDurumu === 'hata' && ' · KAYIT BAŞARISIZ (sunucu çalışıyor mu?)'}
        </div>
      )}

      {/* Subtle Footer */}
      <footer className="w-full border-t border-[#2A3B63]/60 py-3 text-center text-[11px] font-mono text-[#94A3B8]/60">
        SE Primer · Crisis Engine · Hastane Laboratuvar Bilgi Sistemi Olayı
      </footer>
    </div>
  );
}
