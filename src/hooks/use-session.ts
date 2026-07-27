import { useCallback, useEffect, useState } from "react";
import { getSession, type SessionUser } from "@/lib/auth";

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => setUser(getSession()), []);

  useEffect(() => {
    const sync = () => setUser(getSession());
    sync();
    setReady(true);
    window.addEventListener("regpromo:session", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("regpromo:session", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { user, ready, refresh };
}

