
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, User, X, Home, FileText, Users, Settings, Bell, UserPlus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCommitteeSubItems, setShowCommitteeSubItems] = useState(false);
  const isMobile = useIsMobile();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setShowCommitteeSubItems(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Tenders", path: "/tenders", icon: FileText },
    {
      name: "Committee",
      path: "/committee",
      icon: Users,
      subItems: [
        { name: "Create Committee", path: "/committee/create", icon: UserPlus },
        { name: "View Committees", path: "/committee", icon: FolderOpen },
      ],
    },
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "Notifications", path: "/notifications", icon: Bell },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
            <h1 
              onClick={() => navigate("/")}
              className="text-xl font-semibold text-gray-900 cursor-pointer"
            >
              Procurement Portal
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              
              if (item.subItems) {
                return (
                  <div key={item.path} className="relative">
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-2 ${
                        location.pathname.startsWith(item.path)
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => setShowCommitteeSubItems(!showCommitteeSubItems)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                    {showCommitteeSubItems && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        {item.subItems.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <Button
                              key={subItem.path}
                              variant="ghost"
                              className={`w-full justify-start text-left ${
                                isActive(subItem.path)
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                              }`}
                              onClick={() => {
                                navigate(subItem.path);
                                setShowCommitteeSubItems(false);
                              }}
                            >
                              <SubIcon className="mr-2 h-4 w-4" />
                              {subItem.name}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={`flex items-center gap-2 ${
                    isActive(item.path)
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-8 w-8 rounded-full hover:bg-gray-100"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "Guest User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "guest@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="space-y-1 pt-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;

                if (item.subItems) {
                  return (
                    <div key={item.path} className="space-y-1">
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-left font-semibold ${
                          location.pathname.startsWith(item.path)
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600"
                        }`}
                        onClick={() => setShowCommitteeSubItems(!showCommitteeSubItems)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Button>
                      {showCommitteeSubItems && (
                        <div className="pl-4 space-y-1">
                          {item.subItems.map((subItem) => {
                            const SubIcon = subItem.icon;
                            return (
                              <Button
                                key={subItem.path}
                                variant="ghost"
                                className={`w-full justify-start text-left ${
                                  isActive(subItem.path)
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                                onClick={() => {
                                  navigate(subItem.path);
                                  setIsMenuOpen(false);
                                  setShowCommitteeSubItems(false);
                                }}
                              >
                                <SubIcon className="mr-2 h-4 w-4" />
                                {subItem.name}
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={`w-full justify-start text-left ${
                      isActive(item.path)
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                );
              })}
              <DropdownMenuSeparator className="my-2" />
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
