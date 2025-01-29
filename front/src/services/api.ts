import axios from "axios";
import { IUserCreationDTO, IUserFromApi } from '@types';

// Instance d'axios, configurable
const httpRequester = axios.create({
  withCredentials: true, // Pour tous nos appels API, on autorise l'envoie et la reception des cookies ! // Pour autoriser également la reception du cookie x-auth-token en httpOnly, secure true, cross origin
  baseURL: "http://localhost:3000/api" // TODO Mettre en variable dans un .env
});

// ================================================
// ============== API - USER/AUTH =================
// ================================================

async function register(user: IUserCreationDTO) {
  const { status } = await httpRequester.post(`/auth/register`, user);
  return status === 201; // Retourne un true/false suivant la réussite
}

async function login(email: string, password: string) {
  const { data } = await httpRequester.post(`/auth/login`, { email, password }); // data ??? { accessToken ! }
  
  return data;
}

async function logout() {
  await httpRequester.delete(`/auth/logout`);
}

type CurrentUserResponse = 
  { isAuthenticated: false; user: null }
  | { isAuthenticated: true; user: IUserFromApi };

async function getCurrentUser() {
  const { data } = await httpRequester.get<CurrentUserResponse>(`/auth/me`);
  return data;
}

// ================================================
// ========== API -  ============
// ================================================


// ================================================
// ========== API - EXTERNE  ============
// ================================================

export default {
  register,
  login,
  logout,
  getCurrentUser,
}