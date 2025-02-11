
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/auth";

export const useAuthNavigation = (isAuthenticated: boolean, user: User | null) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [defaultTab, setDefaultTab] = useState("dashboard");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      switch (user.role) {
        case 'procurement_officer':
          setDefaultTab('tenders');
          toast({
            title: "Welcome Procurement Officer",
            description: "You can manage tenders and procurement processes here.",
          });
          break;
        case 'evaluator':
          setDefaultTab('evaluation');
          toast({
            title: "Welcome Evaluator",
            description: "You can access bid evaluation modules here.",
          });
          break;
        case 'committee_member':
          setDefaultTab('procurement');
          toast({
            title: "Welcome Committee Member",
            description: "You can review procurement details and specifications here.",
          });
          break;
        default:
          setDefaultTab('dashboard');
          toast({
            title: `Welcome ${user.role}`,
            description: "You have access to the admin dashboard.",
          });
      }
    }
  }, [isAuthenticated, user, navigate, toast]);

  return { defaultTab };
};
