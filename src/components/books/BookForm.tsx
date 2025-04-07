import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBook, updateBook } from "@/api";
import { Book } from "@/types";

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  libraryId: string;
}

const BookForm: React.FC<BookFormProps> = ({ isOpen, onClose, book, libraryId }) => {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [anoPublicacao, setAnoPublicacao] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (book) {
        setTitulo(book.nome || "");
        setAutor(book.autor || "");
        setAnoPublicacao(book.data_criacao?.toString() || "");
      } else {
        setTitulo("");
        setAutor("");
        setAnoPublicacao("");
      }
    }
  }, [isOpen]);

  

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (titulo.trim() === "") {
      toast.error("O título do livro é obrigatório");
      setIsSubmitting(false);
      return;
    }
  
    try {
      if (book) {
        const ano = parseInt(anoPublicacao);
        if (isNaN(ano)) {
          toast.error("Ano de publicação inválido");
          setIsSubmitting(false);
          return;
        }

          await updateBook({
            ...book,
            titulo,
            autor,
            ano_publicacao: ano,
          });
      
          toast.success("Livro atualizado com sucesso!");
      } else {

              const ano = parseInt(anoPublicacao);
      if (isNaN(ano)) {
        toast.error("Ano de publicação inválido");
        setIsSubmitting(false);
        return;
      }

      const bibliotecaId = parseInt(libraryId);
      if (isNaN(bibliotecaId)) {
        toast.error("ID da biblioteca inválido");
        setIsSubmitting(false);
        return;
      }

        await createBook({
          titulo,
          autor,
          ano_publicacao: ano,
          biblioteca_id: parseInt(libraryId),
        });
        toast.success("Livro criado com sucesso!");
      }
  
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar livro");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{book ? "Editar Livro" : "Novo Livro"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Digite o título do livro"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="autor">Autor</Label>
            <Input
              id="autor"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              placeholder="Digite o autor"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ano">Ano de Publicação</Label>
            <Input
              id="ano"
              type="number"
              value={anoPublicacao}
              onChange={(e) => setAnoPublicacao(e.target.value)}
              placeholder="Ex: 2020"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-700 hover:bg-purple-800"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookForm;
