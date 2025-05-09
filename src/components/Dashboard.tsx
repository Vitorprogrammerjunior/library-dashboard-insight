import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Book, LibraryIcon } from "lucide-react";
import { fetchLibraries, fetchBooks, fetchBookCountByLibrary } from "@/api";
import { Library, Book as BookType } from "@/types";import { toast } from "@/hooks/use-toast";

const Dashboard: React.FC = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [books, setBooks] = useState<BookType[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const libs = await fetchLibraries();
        const bks = await fetchBooks();

        const chart = await Promise.all(
          libs.map(async (lib: Library) => {
            const count = await fetchBookCountByLibrary(lib.id);
            return {
              name: lib.nome,
              Livros: count,
            };
          })
        );

        setLibraries(libs);
        setBooks(bks);
        setChartData(chart);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados. Verifique se o servidor está rodando.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p className="text-center text-xl mt-10">Carregando...</p>;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bibliotecas</CardTitle>
            <LibraryIcon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{libraries.length}</div>
            <p className="text-xs text-muted-foreground">Total de Bibliotecas Cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livros</CardTitle>
            <Book className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{books.length}</div>
            <p className="text-xs text-muted-foreground">Total de Livros Cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média</CardTitle>
            <div className="h-4 w-4 text-purple-600">Ø</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {libraries.length ? (books.length / libraries.length).toFixed(1) : "0"}
            </div>
            <p className="text-xs text-muted-foreground">Média de Livros por Biblioteca</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Distribuição de Livros por Biblioteca</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Livros" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;