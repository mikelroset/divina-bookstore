import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export const authService = {
  // Login amb Google
  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error al fer login:", error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al fer logout:", error);
      throw error;
    }
  },

  // Obtenir l'usuari actual
  getCurrentUser: () => {
    return auth.currentUser;
  },

  /** Retorna el ID token de l'usuari actual (per APIs que requereixen Authorization Bearer). */
  getIdToken: async () => {
    const user = auth.currentUser;
    if (!user || typeof user.getIdToken !== "function") return null;
    return user.getIdToken();
  },

  // Escoltar canvis d'autenticació
  onAuthStateChanged: (callback) => {
    return auth.onAuthStateChanged(callback);
  },
};
