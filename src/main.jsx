import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./helper/AuthContext.jsx";
import { SearchProvider } from "./helper/SearchContext.jsx";
import { Toaster } from "react-hot-toast";
import router from "./routes";

createRoot(document.getElementById("root")).render(
  // StrictMode disabled to prevent double toast notifications in development
  // <StrictMode>
  <AuthProvider>
    <SearchProvider>
      <Toaster />
      <RouterProvider router={router} />
    </SearchProvider>
  </AuthProvider>
  // </StrictMode>
);
