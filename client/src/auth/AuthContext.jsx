import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const session = authService.getSession();
    setCurrentUser(session);
    setIsBootstrapping(false);
  }, []);

  async function login(credentials) {
    const user = await authService.login(credentials);
    setCurrentUser(user);
    return user;
  }

  async function signUp(payload) {
    const user = await authService.signUp(payload);
    setCurrentUser(user);
    return user;
  }

  function logout() {
    authService.logout();
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isBootstrapping,
        login,
        signUp,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
