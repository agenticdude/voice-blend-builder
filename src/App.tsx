import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BlogConfig from "./pages/BlogConfig";
import AdvancedConfig from "./pages/AdvancedConfig";
import OutlineCreation from "./pages/OutlineCreation";
import CreateContent from "./pages/CreateContent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BlogConfig />} />
          <Route path="/advanced-config" element={<AdvancedConfig />} />
          <Route path="/outline-creation" element={<OutlineCreation />} />
          <Route path="/create-content" element={<CreateContent />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
