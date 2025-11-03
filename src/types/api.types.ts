// src/types/api.types.ts

export interface Character {
  id: number;
  nombre: string;
  descripcion: string; 
  origen: string; 
  popularidad: string; 
  imagen: string; 
  memes: string[];
}
export interface Stats {
  totalPersonajes: number;
  origenes: string[]; 
  nivelesPopularidad: string[]; 
  totalMemes: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
}