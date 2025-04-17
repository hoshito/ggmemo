export const MAX_MEMO_LENGTH = 300;
export const MAX_MEMOS_PER_SESSION = 50;

export interface Memo {
  id: string;
  title: string;
  result: "WIN" | "LOSE";
  rating: number;
  memo: string;
  createdAt: string;
}

export type MemoFormData = Omit<Memo, "id" | "createdAt">;
