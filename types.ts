
export enum BuddhaType {
  LOVE = 'LOVE',
  STUDY = 'STUDY',
  CAREER = 'CAREER',
  HEALTH = 'HEALTH'
}

export interface BuddhaConfig {
  id: BuddhaType;
  name: string;
  desc: string;
  color: string;
  glowClass: string;
  symbol: string; // 核心汉字意象
  image: string;
}

export enum GameScene {
  SELECTION = 'SELECTION',
  RHYTHM = 'RHYTHM',
  INCENSE = 'INCENSE',
  BIRTHDAY = 'BIRTHDAY',
  RESULT = 'RESULT'
}

export interface AppSettings {
  targetHits: number;
  customImages: Record<string, string>;
}

export interface BaZiResult {
  dayPillar: string;
  dayMaster: string;
  type: string;
  oracle: string;
  advice: string;
}
