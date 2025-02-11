
import React, { createContext, useContext, useState, ReactNode } from "react";
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
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
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
    toast({
      title: "Login Failed",
      description: "Invalid credentials",
      variant: "destructive"
    });
    return false;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      token: undefined
    });
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

