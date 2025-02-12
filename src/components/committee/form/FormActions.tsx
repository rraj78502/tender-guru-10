
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface FormActionsProps {
  onClose: () => void;
}

const FormActions = ({ onClose }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        Create & Notify
      </Button>
    </div>
  );
};

export default FormActions;
