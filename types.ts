export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  audioUrl: string | null;
}

export interface VoiceConfig {
  voiceName: string;
  gender: Gender;
}
