export interface ICard {
  id: number;
  content: string;
  color: string;
  position: number;
}

export interface IUserFromApi {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  role: number
}

export interface IUserCreationDTO { // DTO = Data Transfert Object = un objet qui se balade sur le réseau
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}