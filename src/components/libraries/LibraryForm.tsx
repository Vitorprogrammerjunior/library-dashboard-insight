
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
import { createLibrary, updateLibrary } from "@/data/index";
import { Library } from "@/types";

interface LibraryFormProps {
  isOpen: boolean;
  onClose: () => void;
  library: Library | null;
}

const LibraryForm: React.FC<LibraryFormProps> = ({ isOpen, onClose, library }) => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (library) {
      setName(library.name);
    } else {
      setName("");
    }
  }, [library, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (name.trim() === "") {
        toast.error("O nome da biblioteca é obrigatório");
        return;
      }

      if (library) {
        // Update existing library
        updateLibrary({
          ...library,
          name,
        });
        toast.success("Biblioteca atualizada com sucesso!");
      } else {
        // Create new library
        createLibrary(name);
        toast.success("Biblioteca criada com sucesso!");
      }
      onClose();
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar a biblioteca");
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
            {library ? "Editar Biblioteca" : "Nova Biblioteca"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Biblioteca</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome da biblioteca"
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

export default LibraryForm;
