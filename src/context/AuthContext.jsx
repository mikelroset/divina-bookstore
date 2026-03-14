import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { getDisabledUserIds } from "../services/userManagementService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const disabledIds = await getDisabledUserIds();
        if (disabledIds.has(firebaseUser.uid)) {
          await authService.logout();
          setUser(null);
          setLoading(false);
          return;
        }
      } catch {
        // Si falla la comprovació, deixem passar (evitar bloquejos)
      }
      setUser({
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
      });
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      const firebaseUser = await authService.loginWithGoogle();
      setUser({
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
      });
      return firebaseUser;
    } catch (error) {
      console.error("Error al fer login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Error al fer logout:", error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
