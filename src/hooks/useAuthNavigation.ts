
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/auth";

export const useAuthNavigation = (isAuthenticated: boolean, user: User | null) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [defaultTab, setDefaultTab] = useState("dashboard");

  useEffect(() => {
    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login');
      return;
    }

    // If authenticated, handle navigation
    if (isAuthenticated && user) {
      // Show welcome message only when coming from login
      if (location.pathname === '/login') {
        showWelcomeToast(user.role, toast);
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate, location.pathname, toast]);

  return { defaultTab };
};

const showWelcomeToast = (role: string, toast: any) => {
  toast({
    title: "Welcome",
    description: "Welcome to the unified procurement portal.",
  });
};
