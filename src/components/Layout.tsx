
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <main className="container mx-auto">
          {children}
        </main>
        
    
      </div>
    </div>
  );
};

export default Layout;
