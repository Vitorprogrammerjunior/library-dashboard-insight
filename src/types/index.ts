
export interface Library {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Book {
  id: string;
  libraryId: string;
  name: string;
  createdAt: Date;
}
