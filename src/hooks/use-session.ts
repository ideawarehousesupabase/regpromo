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
    window.addEventListener("complystep:session", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("complystep:session", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { user, ready, refresh };
}

