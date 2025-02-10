
import { Link, useLocation } from "react-router-dom";
import { Home, Users, FileText, Package, Award, MessageSquare, Shield, FileCheck } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Users, label: "Partner Management", path: "/partners" },
    { icon: FileText, label: "Tenders", path: "/tenders" },
    { icon: Package, label: "Procurement", path: "/procurement" },
    { icon: Award, label: "Evaluation", path: "/evaluation" },
    { icon: MessageSquare, label: "Clarifications", path: "/clarifications" },
    { icon: Shield, label: "Complaints", path: "/complaints" },
    { icon: FileCheck, label: "Post Contract", path: "/post-contract" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:justify-start space-x-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
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
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

