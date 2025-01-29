import api from "@services/api";
import { ReactNode, useState, useEffect } from "react";
import { IUserFromApi } from "@types";
import { AuthContext } from "./auth.context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUserFromApi | null>(null);

  const authenticateUser = async () => {
    try {
      const { isAuthenticated, user } = await api.getCurrentUser();
      if (isAuthenticated) {
        setUser(user);
      }
    } catch (error) {
      console.error("Failed to authenticate user:", error);
      throw new Error("Échec de l'authentification.");
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      await api.login(email, password);
      await authenticateUser();
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Échec de la connexion. Veuillez vérifier vos informations.");
    }
  };

  const logoutUser = async () => {
    try {
      await api.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error("Échec de la déconnexion.");
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, authenticateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
