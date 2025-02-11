
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CommitteeMember } from "@/types/committee";

interface TaskFormFieldsProps {
  title: string;
  description: string;
  assignedTo: number;
  members: CommitteeMember[];
  onChange: (field: string, value: string | number) => void;
}

const TaskFormFields = ({ title, description, assignedTo, members, onChange }: TaskFormFieldsProps) => {
  console.log('TaskFormFields render with props:', { title, description, assignedTo, memberCount: members?.length });
  
  // Filter out members without required fields
  const validMembers = members.filter(member => member.name && member.employeeId);
  console.log('Valid members for assignment:', validMembers.map(m => ({ id: m.id, name: m.name, role: m.role })));

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
          value={assignedTo}
          onChange={(e) => {
            const selectedValue = Number(e.target.value);
            console.log('Assign To selection changed:', {
              rawValue: e.target.value,
              parsedValue: selectedValue,
              availableMembers: validMembers.map(m => ({ id: m.id, name: m.name }))
            });
            onChange("assignedTo", selectedValue);
          }}
          required
        >
          <option value="">Select Member</option>
          {validMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {`${member.name} (${member.role})`}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default TaskFormFields;

