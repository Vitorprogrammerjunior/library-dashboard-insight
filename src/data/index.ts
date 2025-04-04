
import { Library, Book } from "../types";
import { v4 as uuidv4 } from "uuid";

// Mock data for libraries
let libraries: Library[] = [
  {
    id: "1",
    name: "Biblioteca Central",
    createdAt: new Date("2023-01-15")
  },
  {
    id: "2",
    name: "Biblioteca Municipal",
    createdAt: new Date("2023-03-22")
  },
  {
    id: "3",
    name: "Biblioteca Escolar",
    createdAt: new Date("2023-05-10")
  }
];

// Mock data for books
let books: Book[] = [
  {
    id: "1",
    libraryId: "1",
    name: "Dom Casmurro",
    createdAt: new Date("2023-01-20")
  },
  {
    id: "2",
    libraryId: "1",
    name: "O Cortiço",
    createdAt: new Date("2023-02-05")
  },
  {
    id: "3",
    libraryId: "2",
    name: "Memórias Póstumas de Brás Cubas",
    createdAt: new Date("2023-03-25")
  },
  {
    id: "4",
    libraryId: "3",
    name: "Vidas Secas",
    createdAt: new Date("2023-05-15")
  },
  {
    id: "5",
    libraryId: "2",
    name: "Grande Sertão: Veredas",
    createdAt: new Date("2023-04-10")
  },
  {
    id: "6",
    libraryId: "1",
    name: "Macunaíma",
    createdAt: new Date("2023-02-22")
  }
];

// Library CRUD operations
export const getLibraries = (): Library[] => {
  return [...libraries];
};

export const getLibrary = (id: string): Library | undefined => {
  return libraries.find(library => library.id === id);
};

export const createLibrary = (name: string): Library => {
  const newLibrary: Library = {
    id: uuidv4(),
    name,
    createdAt: new Date()
  };
  libraries.push(newLibrary);
  return newLibrary;
};

export const updateLibrary = (updatedLibrary: Library): Library => {
  libraries = libraries.map(library => 
    library.id === updatedLibrary.id ? updatedLibrary : library
  );
  return updatedLibrary;
};

export const deleteLibrary = (id: string): void => {
  libraries = libraries.filter(library => library.id !== id);
  // Also delete all books associated with this library
  books = books.filter(book => book.libraryId !== id);
};

// Book CRUD operations
export const getBooks = (): Book[] => {
  return [...books];
};

export const getBooksForLibrary = (libraryId: string): Book[] => {
  return books.filter(book => book.libraryId === libraryId);
};

export const getBook = (id: string): Book | undefined => {
  return books.find(book => book.id === id);
};

export const createBook = (libraryId: string, name: string): Book => {
  const newBook: Book = {
    id: uuidv4(),
    libraryId,
    name,
    createdAt: new Date()
  };
  books.push(newBook);
  return newBook;
};

export const updateBook = (updatedBook: Book): Book => {
  books = books.map(book => 
    book.id === updatedBook.id ? updatedBook : book
  );
  return updatedBook;
};

export const deleteBook = (id: string): void => {
  books = books.filter(book => book.id !== id);
};

// Utility functions
export const getBookCountByLibrary = (libraryId: string): number => {
  return books.filter(book => book.libraryId === libraryId).length;
};

export const getLibraryStats = () => {
  return libraries.map(library => ({
    name: library.name,
    bookCount: getBookCountByLibrary(library.id)
  }));
};
