
import { Link } from "react-router-dom";
import { Home, Users, FileText, Package, Award, MessageSquare, Shield, FileCheck } from "lucide-react";

const Navigation = () => {
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
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                <item.icon className="h-5 w-5 mr-2" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
