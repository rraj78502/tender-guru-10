
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FormHeaderProps {
  onClose: () => void;
}

const FormHeader = ({ onClose }: FormHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Create Committee</h2>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FormHeader;

