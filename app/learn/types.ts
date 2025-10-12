export type VocabItem = {
  id: number;
  word: string;
  translation: string;
  meaning: string | null;
  pronunciation?: string | null;
  example?: string | null;
  partOfSpeech?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
};