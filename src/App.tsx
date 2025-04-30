
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Messaging from "./pages/Messaging";
import Calendar from "./pages/Calendar";
import LoginForm from "./components/LoginForm";
import NotFound from "./pages/NotFound";
import AddJobOffer from "./pages/AddJobOffer";
import EditProfile from "./pages/EditProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/login" element={<div className="min-h-screen flex items-center justify-center bg-career-gray px-4"><LoginForm /></div>} />
          <Route path="/register" element={<div className="min-h-screen flex items-center justify-center bg-career-gray px-4"><LoginForm isRegister={true} /></div>} />
          <Route path="/add-job-offer" element={<AddJobOffer />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
