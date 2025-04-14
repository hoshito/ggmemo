import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useSession } from "next-auth/react";

const AuthContext = createContext<{ user: User | null; isInitializing: boolean }>({
  user: null,
  isInitializing: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (session?.idToken) {
      const credential = GoogleAuthProvider.credential(session.idToken);
      signInWithCredential(auth, credential)
        .then((result) => setUser(result.user))
        .catch(console.error)
        .finally(() => setIsInitializing(false));
    } else {
      setIsInitializing(false);
    }
  }, [session]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!isInitializing) {
        setUser(firebaseUser);
      }
    });

    return () => unsubscribe();
  }, [isInitializing]);

  return (
    <AuthContext.Provider value={{ user, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
