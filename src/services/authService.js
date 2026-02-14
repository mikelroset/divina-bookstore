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
      console.log("Logout successful");
    } catch (error) {
      console.error("Error al fer logout:", error);
      throw error;
    }
  },

  // Obtenir l'usuari actual
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Escoltar canvis d'autenticació
  onAuthStateChanged: (callback) => {
    return auth.onAuthStateChanged(callback);
  },
};
