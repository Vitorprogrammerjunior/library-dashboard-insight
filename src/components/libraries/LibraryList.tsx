import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, BookOpen, Plus } from "lucide-react";
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
  fetchLibraries,
  deleteLibrary,
  fetchBookCountByLibrary,
} from "@/api";
import { Library } from "@/types";
import LibraryForm from "./LibraryForm";

const LibraryList: React.FC = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadLibraries = async () => {
    try {
      setLoading(true);
      const data = await fetchLibraries();
      setLibraries(data);
    } catch (error) {
      console.error("Erro ao carregar bibliotecas:", error);
      toast.error("Erro ao carregar bibliotecas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibraries();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteLibrary(id);
      loadLibraries();
      toast.success("Biblioteca removida com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir biblioteca:", error);
      toast.error("Erro ao excluir biblioteca");
    }
  };

  const handleEditClick = (library: Library) => {
    setSelectedLibrary(library);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedLibrary(null);
    loadLibraries();
  };

  const handleViewBooks = (libraryId: number) => {
    navigate(`/libraries/${libraryId}/books`);
  };

  if (loading) return <p className="text-center text-xl mt-10">Carregando bibliotecas...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bibliotecas</h1>
        <Button onClick={() => setIsFormOpen(true)} className="bg-purple-700 hover:bg-purple-800">
          <Plus className="mr-2 h-4 w-4" />
          Nova Biblioteca
        </Button>
      </div>

      {libraries.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nenhuma biblioteca cadastrada.</p>
          <Button 
            onClick={() => setIsFormOpen(true)} 
            variant="outline" 
            className="mt-4"
          >
            Adicionar Biblioteca
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Livros</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {libraries.map((library) => (
              <TableRow key={library.id}>
                <TableCell className="font-medium">{library.nome}</TableCell>
                <TableCell>{new Date(library.data_criacao).getFullYear()}</TableCell>
                <TableCell>
                  <BookCount libraryId={library.id} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleViewBooks(library.id)}
                      title="Ver Livros"
                    >
                      <BookOpen className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditClick(library)}
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
                            Tem certeza que deseja excluir "{library.nome}"? 
                            Esta ação não pode ser desfeita e também excluirá todos os livros associados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(library.id)}
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

      <LibraryForm 
        isOpen={isFormOpen}
        onClose={handleFormClose}
        library={selectedLibrary}
      />
    </div>
  );
};

const BookCount: React.FC<{ libraryId: number }> = ({ libraryId }) => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const getCount = async () => {
      try {
        const bookCount = await fetchBookCountByLibrary(libraryId);
        setCount(bookCount);
      } catch (error) {
        console.error(`Erro ao buscar contagem de livros para biblioteca ${libraryId}:`, error);
        setCount(0);
      }
    };

    getCount();
  }, [libraryId]);

  if (count === null) return <span>...</span>;
  return <span>{count}</span>;
};

export default LibraryList;