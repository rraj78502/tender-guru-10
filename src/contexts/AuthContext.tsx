
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, AuthState, ModulePermission } from "@/types/auth";
import { mockUsers } from "@/mock/authData";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: ModulePermission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem("auth");
    return savedAuth ? JSON.parse(savedAuth) : {
      user: null,
      isAuthenticated: false,
    };
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem("auth", JSON.stringify(authState));
    } else {
      localStorage.removeItem("auth");
    }
  }, [authState]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
        token: "mock-jwt-token"
      });
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`
      });
      return true;
    }
    throw new Error("Invalid credentials");
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      token: undefined
    });
    localStorage.removeItem("auth");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
  };

  const hasPermission = (permission: ModulePermission): boolean => {
    return authState.user?.permissions.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

