import Header from "../Fragments/Header";
import Sidebar from "../Fragments/Sidebar";
import skyBackground from "../../assets/Sky Background.png";
import { useState } from "react";

export default function Dashboard({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col lg:ml-60 h-screen">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <main
          className="pt-5 px-6 pb-4 sm:pt-6 sm:px-8 sm:pb-6 lg:px-8 bg-cover bg-center bg-fixed bg-no-repeat flex-1 overflow-y-auto"
          style={{ backgroundImage: `url(${skyBackground})` }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
