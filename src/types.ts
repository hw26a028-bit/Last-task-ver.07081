export interface YokaiData {
  stage: number;
  name: string;
  hp: number;
  attack: number;
  description: string;
}

export interface PhraseData {
  kanji: string;
  hiragana: string;
  romaji: string;
}

export interface PlayLog {
  id: string;
  date: string;
  cpm: number;
  accuracy: number;
  totalKeys: number;
  missKeys: number;
  mostMissedKey: string;
  score: number;
}

export interface SaveData {
  stageCleared: boolean[]; // 13 stages, 0-indexed (stage 1 to 13)
  yokaiDefeated: string[]; // names of defeated yokai
  logs: PlayLog[];
}
