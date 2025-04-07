import axios from "axios";
import { Library, Book } from "@/types";

// Configuração base do axios
const API_URL = "http://localhost:3000"; // Endereço do seu backend Express

// Criando uma instância do axios com configuração base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchLibraries(): Promise<Library[]> {
  const response = await fetch("http://localhost:3000/bibliotecas");
  if (!response.ok) {
    throw new Error("Erro ao buscar bibliotecas");
  }
  return response.json();
}

export const createLibrary = async (name: string, creationYear?: number): Promise<Library> => {
  const response = await api.post("/bibliotecas", {
    nome: name,
    data_criacao: creationYear || new Date().getFullYear()
  });
  return response.data;
};

export const getLibraryById = async (id: number): Promise<Library> => {
  const response = await api.get(`/bibliotecas/${id}`);
  return response.data;
};

export const updateLibrary = async (library: { id: number; name: string; data_criacao?: number }): Promise<Library> => {
  const response = await api.put(`/bibliotecas/${library.id}`, {
    nome: library.name,
    data_criacao: library.data_criacao
  });
  return response.data;
};

export const deleteLibrary = async (id: number): Promise<void> => {
  await api.delete(`/bibliotecas/${id}`);
};

// APIs de livros
export const fetchBooks = async (): Promise<Book[]> => {
  const response = await api.get("/livros");
  return response.data;
};

export const fetchBooksByLibrary = async (libraryId: number): Promise<Book[]> => {
  const response = await api.get(`/bibliotecas/${libraryId}/livros`);
  return response.data;
};

export const createBook = async (book: { 
  titulo: string,
  autor: string,
  ano_publicacao: number,
  biblioteca_id: number 
}): Promise<Book> => {
  const response = await api.post("/livros", book);
  return response.data;
};

export const updateBook = async (book: { id: number; titulo: string; autor: string; ano_publicacao: number; biblioteca_id: number }): Promise<Book> => {
  const response = await api.put(`/livros/${book.id}`, {
    titulo: book.titulo,
    autor: book.autor,
    ano_publicacao: book.ano_publicacao,
    biblioteca_id: book.biblioteca_id
  });
  return response.data;
};

export const deleteBook = async (id: number): Promise<void> => {
  await api.delete(`/livros/${id}`);
};

export const fetchBookCountByLibrary = async (libraryId: number): Promise<number> => {
  const response = await api.get(`/bibliotecas/${libraryId}/livros/quantidade`);
  return response.data.total_livros;
};

export const fetchLibrariesWithBookCount = async (): Promise<Library[]> => {
  const response = await api.get("/bibliotecas/com-quantidade");
  return response.data;
};

// Exportar a instância do axios para uso em outros lugares se necessário
export default api;
