
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface CommitteeMember {
  employeeId: string;
  name: string;
  role: "member" | "chairperson";
}

interface MemberFormItemProps {
  member: CommitteeMember;
  index: number;
  onUpdate: (index: number, field: keyof CommitteeMember, value: string) => void;
  onRemove: (index: number) => void;
}

const MemberFormItem = ({ member, index, onUpdate, onRemove }: MemberFormItemProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg relative">
      <div>
        <Label htmlFor={`employee-id-${index}`}>Employee ID</Label>
        <Input
          id={`employee-id-${index}`}
          value={member.employeeId}
          onChange={(e) => onUpdate(index, "employeeId", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor={`name-${index}`}>Name</Label>
        <Input
          id={`name-${index}`}
          value={member.name}
          onChange={(e) => onUpdate(index, "name", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor={`role-${index}`}>Role</Label>
        <select
          id={`role-${index}`}
          value={member.role}
          onChange={(e) => onUpdate(index, "role", e.target.value as "member" | "chairperson")}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="member">Member</option>
          <option value="chairperson">Chairperson</option>
        </select>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute -right-2 -top-2"
        onClick={() => onRemove(index)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MemberFormItem;
