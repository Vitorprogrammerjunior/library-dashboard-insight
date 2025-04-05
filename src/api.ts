// src/api.ts
import axios from "axios";

const API_URL = "http://localhost:3000"; // ou o endereço da sua API

import { Library } from "src/types/index.ts";

export const fetchLibraries = async () => {
  const response = await axios.get(`${API_URL}/bibliotecas`);
  return response.data;
};

export const fetchBooks = async () => {
  const response = await axios.get(`${API_URL}/livros`);
  return response.data;
};

export const fetchBookCountByLibrary = async (libraryId: number) => {
  const response = await axios.get(`${API_URL}/bibliotecas/${libraryId}/livros`);
  return response.data.length;
};


export const createLibrary = async (name: string) => {
  const response = await axios.post(`${API_URL}/bibliotecas`, {
    nome: name,
    data_criacao: new Date().getFullYear()
  });
  return response.data;
};

export const updateLibrary = async (library: { id: number; name: string }) => {
  const response = await axios.put(`${API_URL}/bibliotecas/${library.id}`, {
    nome: library.name
  });
  return response.data;
};

export const getLibraries = async (): Promise<Library[]> => {
  const res = await axios.get("/api/libraries");
  return res.data;
};

export const deleteLibrary = async (id: number): Promise<void> => {
  await axios.delete(`/api/libraries/${id}`);
};

export const getBookCountByLibrary = async (id: number): Promise<number> => {
  const res = await axios.get(`/api/libraries/${id}/books/count`);
  return res.data.count;
};