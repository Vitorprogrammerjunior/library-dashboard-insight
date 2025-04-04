
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Book, Library } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/libraries", label: "Bibliotecas", icon: Library },
    { path: "/books", label: "Livros", icon: Book },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex flex-col h-full">
        <div className="py-6 px-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-purple-800">Biblioteca</h1>
          <p className="text-gray-500 text-sm">Sistema de Gerenciamento</p>
        </div>
        
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                    location.pathname === item.path
                      ? "bg-purple-100 text-purple-900"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Biblioteca
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
