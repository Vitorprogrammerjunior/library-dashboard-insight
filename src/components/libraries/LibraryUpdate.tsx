import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { updateLibrary, getLibraryById } from "@/api";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const EditLibraryPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [creationDate, setCreationDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const library = await getLibraryById(Number(id));
        setName(library.nome);
        setCreationDate(new Date(library.data_criacao, 0, 1));
      } catch (error) {
        toast.error("Erro ao carregar biblioteca");
        navigate("/bibliotecas");
      }
    };
    fetchLibrary();
  }, [id, navigate]);

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
      await updateLibrary({
        id: Number(id),
        name,
        data_criacao: creationDate.getFullYear(),
      });
      toast.success("Biblioteca atualizada com sucesso!");
      navigate("/bibliotecas");
    } catch (error) {
      console.error("Erro ao atualizar biblioteca:", error);
      toast.error("Erro ao atualizar biblioteca");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Biblioteca</h1>
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="creationDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !creationDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {creationDate ? (
                  format(creationDate, "yyyy", { locale: ptBR })
                ) : (
                  <span>Selecione o ano</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={creationDate}
                onSelect={setCreationDate}
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={1900}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/bibliotecas")}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditLibraryPage;