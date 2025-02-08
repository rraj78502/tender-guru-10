
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Committee Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="purpose">Purpose</Label>
        <Input
          id="purpose"
          value={purpose}
          onChange={(e) => onPurposeChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default BasicInfoFields;
