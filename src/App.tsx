import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AnalyzerPage from "./pages/AnalyzerPage";
import MethodologyPage from "./pages/MethodologyPage";
import EnginesPage from "./pages/EnginesPage";
import ResearchPage from "./pages/ResearchPage";
import UseCasesPage from "./pages/UseCasesPage";
import DatasetPage from "./pages/DatasetPage";
import AboutPage from "./pages/AboutPage";
import ApiPlaygroundPage from "./pages/ApiPlaygroundPage";
import NotFound from "./pages/NotFound";
import { useBackendWarmup } from "./hooks/useBackendWarmup";

const queryClient = new QueryClient();

function AppInner() {
  // Ping backend on load & every 10 min to prevent Render cold starts
  useBackendWarmup();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyzer" element={<AnalyzerPage />} />
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="/engines" element={<EnginesPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/api-playground" element={<ApiPlaygroundPage />} />
          <Route path="/use-cases" element={<UseCasesPage />} />
          <Route path="/dataset" element={<DatasetPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppInner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
