
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
import { createBook, updateBook } from "@/data/index";
import { Book } from "@/types";

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  libraryId: string;
}

const BookForm: React.FC<BookFormProps> = ({ isOpen, onClose, book, libraryId }) => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (book) {
      setName(book.name);
    } else {
      setName("");
    }
  }, [book, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (name.trim() === "") {
        toast.error("O nome do livro é obrigatório");
        return;
      }

      if (book) {
        // Update existing book
        updateBook({
          ...book,
          name,
        });
        toast.success("Livro atualizado com sucesso!");
      } else {
        // Create new book
        createBook(libraryId, name);
        toast.success("Livro criado com sucesso!");
      }
      onClose();
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar o livro");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {book ? "Editar Livro" : "Novo Livro"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Livro</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do livro"
              autoFocus
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
