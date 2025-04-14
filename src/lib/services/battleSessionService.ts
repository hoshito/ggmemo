import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { deleteAllMemos } from "./memoFirestoreService";
import { createBattleSessionError } from "@/lib/errors/utils";
import { ErrorCode, ErrorSeverity } from "@/lib/errors/types";
import {
  BattleSession,
  CreateBattleSessionData,
  UpdateBattleSessionData,
} from "@/types/battleSession";

const COLLECTION_NAME = "battleSessions";

/**
 * バトルセッションを作成する
 */
export const createBattleSession = async (
  data: CreateBattleSessionData
): Promise<string> => {
  // セッション数の制限チェック
  const { sessions } = await getBattleSessions(data.userId);
  if (sessions.length >= 20) {
    throw createBattleSessionError(
      ErrorCode.SESSION_LIMIT_EXCEEDED,
      "You have reached the maximum limit of 20 battle sessions",
      ErrorSeverity.ERROR
    );
  }

  // タイトルの文字数チェック
  if (data.title.length > 100) {
    throw createBattleSessionError(
      ErrorCode.SESSION_TITLE_TOO_LONG,
      "Session title must be 100 characters or less",
      ErrorSeverity.ERROR
    );
  }

  const docRef = doc(collection(db, COLLECTION_NAME));
  const battleSession: BattleSession = {
    ...data,
    id: docRef.id,
    updatedAt: Timestamp.now(),
  };

  await setDoc(docRef, battleSession);
  return docRef.id;
};

/**
 * ユーザーの全バトルセッションを削除する
 */
export const deleteAllBattleSessions = async (
  userId: string
): Promise<void> => {
  const { sessions } = await getBattleSessions(userId);
  const deletePromises = sessions.map((session) =>
    deleteBattleSession(session.id)
  );
  await Promise.all(deletePromises);
};

/**
 * 指定したユーザーのバトルセッション一覧を取得する
 * 更新日時の降順で取得
 */
export const getBattleSessions = async (
  userId: string
): Promise<{
  sessions: BattleSession[];
}> => {
  const queryRef = query(
    collection(db, COLLECTION_NAME),
    where("userId", "==", userId),
    orderBy("updatedAt", "desc")
  );

  const snapshot = await getDocs(queryRef);
  const sessions = snapshot.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id } as BattleSession)
  );

  return { sessions };
};

/**
 * バトルセッションを更新する
 */
export const updateBattleSession = async (
  sessionId: string,
  data: UpdateBattleSessionData
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, sessionId);
  // タイトルが含まれている場合は文字数チェック
  if (data.title && data.title.length > 100) {
    throw createBattleSessionError(
      ErrorCode.SESSION_TITLE_TOO_LONG,
      "Session title must be 100 characters or less",
      ErrorSeverity.ERROR
    );
  }

  const updateData = {
    ...data,
    updatedAt: Timestamp.now(),
  };

  await updateDoc(docRef, updateData);
};

/**
 * バトルセッションを削除する
 * セッションに紐づくメモも削除する
 */
export const deleteBattleSession = async (sessionId: string): Promise<void> => {
  // まずメモを削除
  await deleteAllMemos(sessionId);

  // その後セッションを削除
  const docRef = doc(db, COLLECTION_NAME, sessionId);
  await deleteDoc(docRef);
};
