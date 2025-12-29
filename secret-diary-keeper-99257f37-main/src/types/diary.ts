export interface DiaryEntry {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryData {
  entries: DiaryEntry[];
  passwordHash: string;
  createdAt: string;
  exportedAt?: string;
}