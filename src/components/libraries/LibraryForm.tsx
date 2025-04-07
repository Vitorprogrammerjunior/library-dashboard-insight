import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { createLibrary, updateLibrary } from "@/api";
import { Library } from "@/types";
import { cn } from "@/lib/utils";

interface LibraryFormProps {
  isOpen: boolean;
  onClose: () => void;
  library: Library | null;
}

const LibraryForm: React.FC<LibraryFormProps> = ({ isOpen, onClose, library }) => {
  const [name, setName] = useState("");
  const [creationDate, setCreationDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (library) {
      setName(library.nome);
  
      const ano = Number(library.data_criacao);
      if (!isNaN(ano) && ano > 0) {
        setCreationDate(new Date(ano));
      } else {
        setCreationDate(undefined);
      }
    } else {
      setName("");
      setCreationDate(new Date());
    }
  }, [library]);

  const formatDate = (value: string): string => {
    const date = new Date(value);
    return date.toISOString().split('T')[0];
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    if (!name.trim()) {
      toast.error("Nome da biblioteca é obrigatório");
      return;
    }

    if (!creationDate) {
      toast.error("Data de criação é obrigatória");
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (library) {
        // Atualizar biblioteca existente
        await updateLibrary({ 
          id: library.id, 
          name,
          data_criacao: creationDate.getFullYear(),
        });
        toast.success("Biblioteca atualizada com sucesso!");
      } else {
        // Criar nova biblioteca
        await createLibrary(name, new Date(creationDate).getFullYear());
        toast.success("Biblioteca criada com sucesso!");
      }
      
      onClose();
    } catch (error) {
      console.error("Erro ao salvar biblioteca:", error);
      toast.error("Erro ao salvar biblioteca");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{library ? "Editar Biblioteca" : "Nova Biblioteca"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <div className="space-y-2">
            <Label htmlFor="creationDate">Data de Criação</Label>
            <Label htmlFor="creationYear">Ano de Criação</Label>
<Select
onValueChange={(value) => {
  const year = parseInt(value, 10);
  if (!isNaN(year)) {
    setCreationDate(new Date(`${year}-01-01T00:00:00`));
  }
}}
  value={creationDate ? String(creationDate.getFullYear()) : ""}
>
  <SelectTrigger id="creationYear" className="w-full">
    <SelectValue placeholder="Selecione o ano" />
  </SelectTrigger>
  <SelectContent>
    {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => 1900 + i)
      .reverse()
      .map((year) => (
        <SelectItem key={year} value={String(year)}>
          {year}
        </SelectItem>
      ))}
  </SelectContent>
</Select>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LibraryForm;