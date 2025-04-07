export interface Library {
  id: number;
  nome: string;
  data_criacao: number;
}

export interface Book {
  id: number;
  nome: string;
  autor: string;
  data_criacao: number;
  biblioteca_id: number;
}