
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface BasicInfoFieldsProps {
  name: string;
  purpose: string;
  onNameChange: (value: string) => void;
  onPurposeChange: (value: string) => void;
}

const BasicInfoFields = ({
  name,
  purpose,
  onNameChange,
  onPurposeChange,
}: BasicInfoFieldsProps) => {
  const { toast } = useToast();

  const handleNameChange = (value: string) => {
    if (value.length < 3) {
      toast({
        title: "Invalid Name",
        description: "Committee name must be at least 3 characters long",
        variant: "destructive",
      });
      return;
    }
    onNameChange(value);
  };

  const handlePurposeChange = (value: string) => {
    if (value.length < 10) {
      toast({
        title: "Invalid Purpose",
        description: "Purpose must be at least 10 characters long",
        variant: "destructive",
      });
      return;
    }
    onPurposeChange(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Committee Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Enter committee name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="purpose">Purpose</Label>
        <Input
          id="purpose"
          value={purpose}
          onChange={(e) => handlePurposeChange(e.target.value)}
          placeholder="Enter committee purpose"
          required
        />
      </div>
    </div>
  );
};

export default BasicInfoFields;
