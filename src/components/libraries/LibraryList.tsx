
import React, { useState } from "react";
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
import { getLibraries, deleteLibrary, getBookCountByLibrary } from "@/data/index";
import { Library } from "@/types";
import LibraryForm from "./LibraryForm";

const LibraryList: React.FC = () => {
  const [libraries, setLibraries] = useState<Library[]>(getLibraries());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    deleteLibrary(id);
    setLibraries(getLibraries());
    toast.success("Biblioteca removida com sucesso!");
  };

  const handleEditClick = (library: Library) => {
    setSelectedLibrary(library);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedLibrary(null);
    setLibraries(getLibraries());
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };
  
  const handleViewBooks = (libraryId: string) => {
    navigate(`/libraries/${libraryId}/books`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Bibliotecas</h1>
        <Button onClick={() => setIsFormOpen(true)} className="bg-purple-700 hover:bg-purple-800">
          <Plus className="mr-2 h-4 w-4" />
          Nova Biblioteca
        </Button>
      </div>

      {libraries.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhuma biblioteca cadastrada.</p>
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
                <TableCell className="font-medium">{library.name}</TableCell>
                <TableCell>{formatDate(library.createdAt)}</TableCell>
                <TableCell>{getBookCountByLibrary(library.id)}</TableCell>
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
                            Tem certeza que deseja excluir "{library.name}"? 
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

export default LibraryList;
