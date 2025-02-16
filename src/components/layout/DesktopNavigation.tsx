
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationItem } from "@/types/navigation";
import { useState } from "react";

interface DesktopNavigationProps {
  items: NavigationItem[];
}

export const DesktopNavigation = ({ items }: DesktopNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCommitteeSubItems, setShowCommitteeSubItems] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hidden lg:flex items-center gap-6">
      {items.map((item) => {
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
  );
};
