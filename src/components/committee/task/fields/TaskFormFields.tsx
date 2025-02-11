
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type { CommitteeMember } from "@/types/committee";

interface TaskFormFieldsProps {
  title: string;
  description: string;
  assignedTo: number;
  members: CommitteeMember[];
  onChange: (field: string, value: string | number) => void;
}

const TaskFormFields = ({ title, description, assignedTo, members, onChange }: TaskFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onChange("title", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="assignedTo">Assign To</Label>
        <select
          id="assignedTo"
          className="w-full p-2 border rounded-md bg-white"
          value={assignedTo || ""}
          onChange={(e) => onChange("assignedTo", Number(e.target.value))}
          required
        >
          <option value="">Select Member</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {`${member.name} (${member.department} - ${member.role})`}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default TaskFormFields;
