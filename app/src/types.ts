export type Level = 'Yeni başladım' | 'Biraz deneyimim var' | 'Deneyimliyim';

export type Role = 'Backend geliştirici' | 'Test (QA) mühendisi' | 'Takım lideri';

export type Goal = 'Hata ayıklama' | 'Test ve kalite' | 'Veri güvenliği ve KVKK';

export type GameState =
  | 'giris'
  | 'kriz'
  | 'karar1'
  | 'sonuc1'
  | 'karar2'
  | 'sonuc2'
  | 'karar3'
  | 'sonuc3'
  | 'iyison'
  | 'kotuson';

export type DecisionKey = 'karar1' | 'karar2' | 'karar3';

export type OptionLetter = 'A' | 'B';

export interface DecisionOption {
  letter: OptionLetter;
  title: string;
  isCorrect: boolean;
  whatHappened: string;
  whyHappened: string;
}

export interface DecisionConfig {
  key: DecisionKey;
  stepNumber: number;
  category: string;
  title: string;
  hint: string;
  options: {
    A: DecisionOption;
    B: DecisionOption;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
