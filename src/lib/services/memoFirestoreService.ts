import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  runTransaction,
  writeBatch,
  DocumentReference,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase/config";
import {
  Memo,
  MemoFormData,
  MAX_MEMO_LENGTH,
  MAX_MEMOS_PER_SESSION,
} from "@/types/memo";
import { ErrorCode, ErrorSeverity } from "../errors/types";
import { MemoError } from "../errors/CustomError";

const COLLECTION_NAME = "battleSessions";

const validateMemoLength = (memo: string) => {
  if (memo.length > MAX_MEMO_LENGTH) {
    throw new Error(`Memo cannot exceed ${MAX_MEMO_LENGTH} characters`);
  }
};

/**
 * セッションのメモサブコレクションの参照を取得
 */
const getMemosCollectionRef = (sessionId: string) =>
  collection(db, COLLECTION_NAME, sessionId, "memos");

/**
 * セッションのメモを全て取得
 */
export const getMemos = async (sessionId: string): Promise<Memo[]> => {
  const queryRef = query(
    getMemosCollectionRef(sessionId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(queryRef);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Memo[];
};

/**
 * セッションのメモ数をチェック
 */
const validateMemoCount = async (sessionId: string) => {
  const memos = await getMemos(sessionId);
  if (memos.length >= MAX_MEMOS_PER_SESSION) {
    throw new MemoError(
      ErrorCode.SESSION_LIMIT_EXCEEDED,
      `Cannot add more memos. Maximum limit of ${MAX_MEMOS_PER_SESSION} memos per session reached.`,
      ErrorSeverity.WARNING,
      { sessionId, currentCount: memos.length }
    );
  }
};

/**
 * メモを作成
 */
export const addMemo = async (
  sessionId: string,
  data: MemoFormData
): Promise<Memo> => {
  validateMemoLength(data.memo);
  await validateMemoCount(sessionId);

  console.log("Adding memo to Firestore:", {
    sessionId,
    collectionPath: `${COLLECTION_NAME}/${sessionId}/memos`,
  });

  const docRef = doc(getMemosCollectionRef(sessionId));
  const memo: Memo = {
    ...data,
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };

  try {
    console.log("Setting document with data:", memo);
    await setDoc(docRef, memo);
    console.log("Document successfully written with ID:", docRef.id);
    return memo;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

/**
 * メモを更新
 */
export const updateMemo = async (
  sessionId: string,
  memoId: string,
  data: MemoFormData
): Promise<void> => {
  validateMemoLength(data.memo);

  const docRef = doc(getMemosCollectionRef(sessionId), memoId);

  try {
    console.log("Updating memo:", {
      sessionId,
      memoId,
      data,
    });
    await updateDoc(docRef, data);
    console.log("Memo updated successfully");
  } catch (error) {
    console.error("Error updating memo:", error);
    throw error;
  }
};

/**
 * メモを削除
 */
export const deleteMemo = async (
  sessionId: string,
  memoId: string
): Promise<void> => {
  const docRef = doc(getMemosCollectionRef(sessionId), memoId);

  try {
    console.log("Deleting memo:", {
      sessionId,
      memoId,
    });
    await deleteDoc(docRef);
    console.log("Memo deleted successfully");
  } catch (error) {
    console.error("Error deleting memo:", error);
    throw error;
  }
};

/**
 * セッションの全メモを削除（バッチ処理使用）
 */
export const deleteAllMemos = async (sessionId: string): Promise<void> => {
  const batch = writeBatch(db);

  // メモの取得
  const memosRef = getMemosCollectionRef(sessionId);
  const snapshot = await getDocs(memosRef);

  // バッチに削除操作を追加
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // バッチ実行
  await batch.commit();
};

/**
 * セッションとそのメモを一括で削除（トランザクション使用）
 */
export const deleteSessionWithMemos = async (
  sessionId: string
): Promise<void> => {
  try {
    await runTransaction(db, async (transaction) => {
      // セッションドキュメントの存在確認
      const sessionRef = doc(
        db,
        COLLECTION_NAME,
        sessionId
      ) as DocumentReference<DocumentData>;
      const sessionDoc = await transaction.get(sessionRef);

      if (!sessionDoc.exists()) {
        throw new Error("Session not found");
      }

      // メモの取得と削除
      const memosRef = getMemosCollectionRef(sessionId);
      const memosSnapshot = (await getDocs(
        memosRef
      )) as QuerySnapshot<DocumentData>;

      // メモの削除をトランザクションに追加
      memosSnapshot.docs.forEach((doc) => {
        transaction.delete(doc.ref);
      });

      // セッションの削除
      transaction.delete(sessionRef);
    });
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
};
