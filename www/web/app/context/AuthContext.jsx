import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { storage } from "../lib/storage";

const TOKEN_KEY = "nearby.token";
const USER_KEY = "nearby.user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => storage.get(TOKEN_KEY));
  const [user, setUserState] = useState(() => storage.get(USER_KEY));

  const setUser = useCallback((next) => {
    setUserState(next);
    storage.set(USER_KEY, next);
  }, []);

  const signIn = useCallback(
    (nextToken, nextUser) => {
      storage.set(TOKEN_KEY, nextToken);
      setToken(nextToken);
      setUser(nextUser);
    },
    [setUser],
  );

  const signOut = useCallback(() => {
    storage.remove(TOKEN_KEY);
    storage.remove(USER_KEY);
    setToken(null);
    setUserState(null);
  }, []);

  // Authenticated request that signs the user out when the session has expired
  const authedApi = useCallback(
    async (path, options = {}) => {
      try {
        return await api(path, { ...options, token });
      } catch (err) {
        if (err.status === 401) signOut();
        throw err;
      }
    },
    [token, signOut],
  );

  // Refresh the cached profile once per session so stale data never lingers
  useEffect(() => {
    if (!token) return;
    authedApi("/services/me")
      .then(setUser)
      .catch(() => {});
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(
    () => ({ token, user, setUser, signIn, signOut, authedApi }),
    [token, user, setUser, signIn, signOut, authedApi],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
