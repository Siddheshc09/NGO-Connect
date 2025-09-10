import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Campaigns from "./pages/Campaigns";
import NGOs from "./pages/NGOs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NgoSignup from "./pages/NgoSignup";
import NotFound from "./pages/NotFound";

// NGO Dashboard Imports
import NgoLayout from "./pages/ngo/NgoLayout";
import NgoProfile from "./pages/ngo/NgoProfile";
import ManageEvents from "./pages/ngo/ManageEvents";

const queryClient = new QueryClient();

const App = () => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user")),
    userType: localStorage.getItem("user") ? (JSON.parse(localStorage.getItem("user")).fullName ? 'volunteer' : 'ngo') : null,
  });

  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userType = user ? (user.fullName ? 'volunteer' : 'ngo') : null;
      
      setAuth({ token, user, userType });
    };

    window.addEventListener('authChange', handleAuthChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);


  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {auth.userType === 'ngo' ? (
              // --- NGO Dashboard Routes ---
              <Route path="/" element={<NgoLayout />}>
                <Route index element={<Navigate to="/profile" replace />} />
                <Route path="profile" element={<NgoProfile />} />
                <Route path="manage-events" element={<ManageEvents />} />
                <Route path="*" element={<Navigate to="/profile" replace />} />
              </Route>
            ) : (
              // --- Public and Volunteer Routes ---
              <>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/ngos" element={<NGOs />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/ngo-signup" element={<NgoSignup />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

