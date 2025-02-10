
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, FileText, Package, Award, MessageSquare, Shield, FileCheck, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Users, label: "Partner Management", path: "/partners", requiredRole: ["admin", "procurement_officer"] },
    { icon: FileText, label: "Tenders", path: "/tenders", requiredRole: ["admin", "procurement_officer", "committee_member"] },
    { icon: Package, label: "Procurement", path: "/procurement", requiredRole: ["admin", "procurement_officer"] },
    { icon: Award, label: "Evaluation", path: "/evaluation", requiredRole: ["admin", "evaluator"] },
    { icon: MessageSquare, label: "Clarifications", path: "/clarifications", requiredRole: ["admin", "procurement_officer"] },
    { icon: Shield, label: "Complaints", path: "/complaints", requiredRole: ["admin"] },
    { icon: FileCheck, label: "Post Contract", path: "/post-contract", requiredRole: ["admin", "procurement_officer"] },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:justify-start space-x-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const canAccess = !item.requiredRole || (user && item.requiredRole.includes(user.role));
              
              if (!canAccess) return null;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-1.5 ${
                    isActive ? "text-blue-600" : "text-gray-400"
                  }`} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {isAuthenticated && user && (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
