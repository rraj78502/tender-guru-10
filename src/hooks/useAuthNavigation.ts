
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

    // If authenticated and on login page, redirect to dashboard
    if (isAuthenticated && location.pathname === '/login') {
      if (user) {
        setDefaultTab(getDefaultTabForRole(user.role));
        showWelcomeToast(user.role, toast);
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate, location.pathname, toast]);

  return { defaultTab };
};

const getDefaultTabForRole = (role: string): string => {
  switch (role) {
    case 'procurement_officer':
      return 'tenders';
    case 'evaluator':
      return 'evaluation';
    case 'committee_member':
      return 'procurement';
    default:
      return 'dashboard';
  }
};

const showWelcomeToast = (role: string, toast: any) => {
  const messages = {
    procurement_officer: {
      title: "Welcome Procurement Officer",
      description: "You can manage tenders and procurement processes here.",
    },
    evaluator: {
      title: "Welcome Evaluator",
      description: "You can access bid evaluation modules here.",
    },
    committee_member: {
      title: "Welcome Committee Member",
      description: "You can review procurement details and specifications here.",
    },
    admin: {
      title: "Welcome Admin",
      description: "You have access to the admin dashboard.",
    }
  };

  const message = messages[role as keyof typeof messages] || {
    title: `Welcome ${role}`,
    description: "You have access to the dashboard.",
  };

  toast(message);
};
