import { createContext, useContext } from "react";
import { IUserFromApi } from "@types";

interface IAuthContext {
  user: IUserFromApi | null;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  authenticateUser: () => Promise<void>;  
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  loginUser: async () => {},
  logoutUser: async () => {},
  authenticateUser: async () => {}
});

// Hook Custom pour faciliter l'accès à ce contexte
export const useAuth = () => {
  return useContext(AuthContext);
}