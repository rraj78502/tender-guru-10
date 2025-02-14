
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface FormActionsProps {
  onClose: () => void;
}

const FormActions = ({ onClose }: FormActionsProps) => {
  return (
    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-8 pt-6 border-t">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose}
        className="w-full sm:w-auto"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white flex items-center justify-center gap-2"
      >
        <Bell className="h-4 w-4" />
        Create & Notify
      </Button>
    </div>
  );
};

export default FormActions;
