
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Edit, Trash2, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  getBooksForLibrary, 
  deleteBook,
  getLibrary
} from "@/data/index";
import { Book } from "@/types";
import BookForm from "./BookForm";

const BookList: React.FC = () => {
  const { libraryId } = useParams<{ libraryId: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const library = libraryId ? getLibrary(libraryId) : null;

  useEffect(() => {
    if (libraryId) {
      setBooks(getBooksForLibrary(libraryId));
    }
  }, [libraryId]);

  const handleDelete = (id: string) => {
    deleteBook(id);
    if (libraryId) {
      setBooks(getBooksForLibrary(libraryId));
    }
    toast.success("Livro removido com sucesso!");
  };

  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedBook(null);
    if (libraryId) {
      setBooks(getBooksForLibrary(libraryId));
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  if (!library || !libraryId) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Biblioteca não encontrada.</p>
        <Link to="/libraries">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Bibliotecas
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link to="/libraries" className="text-purple-600 hover:underline flex items-center mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar para Bibliotecas
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Livros de {library.name}</h1>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)} 
          className="bg-purple-700 hover:bg-purple-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Livro
        </Button>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhum livro cadastrado nesta biblioteca.</p>
          <Button 
            onClick={() => setIsFormOpen(true)} 
            variant="outline" 
            className="mt-4"
          >
            Adicionar Livro
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.name}</TableCell>
                <TableCell>{formatDate(book.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditClick(book)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir "{book.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(book.id)}
                            className="bg-red-500 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <BookForm 
        isOpen={isFormOpen}
        onClose={handleFormClose}
        book={selectedBook}
        libraryId={libraryId}
      />
    </div>
  );
};

export default BookList;
