
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { CommitteeMember } from "@/types/committee";

interface TaskFormFieldsProps {
  title: string;
  description: string;
  assignedTo: number;
  members: CommitteeMember[];
  onChange: (field: string, value: string | number) => void;
}

const TaskFormFields = ({ title, description, assignedTo, members, onChange }: TaskFormFieldsProps) => {
  const { toast } = useToast();
  
  // Log initial props for debugging
  console.log('TaskFormFields render with props:', { 
    title, 
    description, 
    assignedTo, 
    memberCount: members?.length,
    membersData: members 
  });
  
  // Filter out invalid members
  const validMembers = members?.filter(member => member && member.id && member.name) || [];
  
  // Log valid members for debugging
  console.log('Valid members for assignment:', validMembers.map(m => ({ 
    id: m.id, 
    name: m.name, 
    role: m.role,
    employeeId: m.employeeId 
  })));

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
          onChange={(e) => {
            const selectedValue = Number(e.target.value);
            const selectedMember = validMembers.find(m => m.id === selectedValue);
            
            console.log('Assign To selection changed:', {
              rawValue: e.target.value,
              parsedValue: selectedValue,
              selectedMember,
              availableMembers: validMembers.map(m => ({ id: m.id, name: m.name }))
            });

            if (selectedMember) {
              toast({
                title: "Member Selected",
                description: `Task will be assigned to ${selectedMember.name}${selectedMember.role ? ` (${selectedMember.role})` : ''}`,
              });
            }
            
            onChange("assignedTo", selectedValue);
          }}
          required
        >
          <option value="">Select Member</option>
          {validMembers && validMembers.length > 0 ? (
            validMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}{member.role ? ` (${member.role})` : ''}
                {member.employeeId ? ` - ${member.employeeId}` : ''}
              </option>
            ))
          ) : (
            <option disabled>No members available</option>
          )}
        </select>
      </div>
    </>
  );
};

export default TaskFormFields;

