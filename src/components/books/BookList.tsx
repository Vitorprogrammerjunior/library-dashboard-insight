import React, { useState } from "react";
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
import { fetchBooks, deleteBook, fetchLibraries } from "@/api.ts";
import { Book, Library } from "@/types";
import BookForm from "./BookForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const BookList: React.FC = () => {
  const { libraryId } = useParams<{ libraryId?: string }>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  

  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ['books', libraryId || 'all'],
    queryFn: async () => {
      const allBooks = await fetchBooks();
      return libraryId
        ? allBooks.filter(book => book.biblioteca_id === Number(libraryId))
        : allBooks;
    },
  });
  
  const filteredBooks = books.filter(book =>
    book.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const { data: libraries = [] } = useQuery<Library[]>({
    queryKey: ['libraries'],
    queryFn: fetchLibraries, // função que realmente busca
  });

 



  const library = libraries.find((lib) => lib.id === Number(libraryId));

  const handleDelete = async (id: number) => {
    try {
      await deleteBook(id);
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success("Livro removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover livro:", error);
      toast.error("Erro ao remover livro");
    }
  };

  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedBook(null);
    queryClient.invalidateQueries({ queryKey: ['books'] });
  };

  if (isLoading) {
    return <div className="text-center py-10">Carregando livros...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Erro ao carregar livros</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          {libraryId && (
            <Link to="/libraries" className="text-purple-600 hover:underline flex items-center mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Voltar para Bibliotecas
            </Link>
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            {libraryId && library ? `Livros de ${library.nome}` : 'Todos os Livros'}
          </h1>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)} 
          className="bg-purple-700 hover:bg-purple-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Livro
        </Button>

        {filteredBooks.length > 0 && (
  <div className="flex justify-end">
    <input
      type="text"
      placeholder="Buscar por título..."
      className="border border-gray-300 rounded px-3 py-2 mb-4 w-full max-w-xs"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
)}
      </div>

      {books.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhum livro cadastrado {libraryId ? 'nesta biblioteca' : 'no sistema'}.</p>
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
            <TableHead>Título</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Ano de Publicação</TableHead>
            <TableHead>Biblioteca</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBooks.map((book) => (
            <TableRow key={book.id}>
              <TableCell className="font-medium">{book.nome}</TableCell>
              <TableCell>{book.autor}</TableCell>
              <TableCell>{book.data_criacao}</TableCell>
              <TableCell>
                {libraries.find(lib => lib.id === book.biblioteca_id)?.nome || "Desconhecida"}
              </TableCell>
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
                          Tem certeza que deseja excluir "{book.nome}"? Esta ação não pode ser desfeita.
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
      key={selectedBook ? `edit-${selectedBook.id}` : "new"}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        book={selectedBook}
        libraryId={libraryId}
      />
    </div>
  );
};

export default BookList;
