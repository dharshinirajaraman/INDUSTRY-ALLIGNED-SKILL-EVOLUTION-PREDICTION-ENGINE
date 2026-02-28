import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { initializeStorage } from "./utils/storage";
import { AIChatbot } from "./components/AIChatbot";

// Initialize default data synchronously before app renders
initializeStorage();

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
      <AIChatbot />
    </LanguageProvider>
  );
}
