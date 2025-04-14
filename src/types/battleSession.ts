import { Timestamp } from "firebase/firestore";
import { Memo } from "./memo";
export const MAX_BATTLE_SESSIONS = 20;

export interface BattleSession {
  id: string;
  userId: string;
  title: string;
  memos: Memo[];
  updatedAt: Timestamp;
}

export type CreateBattleSessionData = Omit<
  BattleSession,
  "id" | "updatedAt"
> & {
  memos: Memo[];
};

export type UpdateBattleSessionData = Partial<
  Omit<BattleSession, "id" | "userId">
> & {
  memos?: Memo[];
};
