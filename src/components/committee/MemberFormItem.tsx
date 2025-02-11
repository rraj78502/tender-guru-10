
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { CommitteeMember } from "@/types/committee";
import { useMockDb } from "@/hooks/useMockDb";
import { useToast } from "@/hooks/use-toast";
import type { Employee } from "@/types/employee";

interface MemberFormItemProps {
  member: CommitteeMember;
  index: number;
  onUpdate: (index: number, field: keyof CommitteeMember, value: string) => void;
  onRemove: (index: number) => void;
}

const MemberFormItem = ({ member, index, onUpdate, onRemove }: MemberFormItemProps) => {
  const { data: employees } = useMockDb<Employee>('employees');
  const { toast } = useToast();

  console.log('Available employees:', employees);

  const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const employeeId = e.target.value;
    // First update the input field value
    onUpdate(index, "employeeId", employeeId);
    
    console.log('Searching for employee with ID:', employeeId);
    
    // Only try to find and update other fields if we have a complete employee ID
    if (employeeId.length >= 6) { // EMP001 format
      const employee = employees?.find(emp => emp.employeeId === employeeId);
      console.log('Found employee:', employee);

      if (employee) {
        onUpdate(index, "name", employee.name);
        onUpdate(index, "email", employee.email);
        onUpdate(index, "phone", employee.phone);
        onUpdate(index, "department", employee.department);
        
        toast({
          title: "Employee Data Imported",
          description: "Employee information has been automatically filled",
        });
      }
    }
  };

  console.log('Current member data:', member);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg relative">
      <div>
        <Label htmlFor={`employee-id-${index}`}>Employee ID</Label>
        <Input
          id={`employee-id-${index}`}
          value={member.employeeId}
          onChange={handleEmployeeIdChange}
          placeholder="Enter employee ID (e.g., EMP001)"
          required
        />
      </div>
      <div>
        <Label htmlFor={`name-${index}`}>Name</Label>
        <Input
          id={`name-${index}`}
          value={member.name}
          onChange={(e) => onUpdate(index, "name", e.target.value)}
          placeholder="Enter member name"
          required
        />
      </div>
      <div>
        <Label htmlFor={`role-${index}`}>Role</Label>
        <select
          id={`role-${index}`}
          value={member.role}
          onChange={(e) => onUpdate(index, "role", e.target.value as CommitteeMember["role"])}
          className="w-full h-10 px-3 py-2 text-base rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          required
        >
          <option value="member">Member</option>
          <option value="chairperson">Chairperson</option>
          <option value="secretary">Secretary</option>
        </select>
      </div>
      <div>
        <Label htmlFor={`email-${index}`}>Email</Label>
        <Input
          id={`email-${index}`}
          type="email"
          value={member.email}
          onChange={(e) => onUpdate(index, "email", e.target.value)}
          placeholder="Enter email address"
        />
      </div>
      <div>
        <Label htmlFor={`phone-${index}`}>Phone</Label>
        <Input
          id={`phone-${index}`}
          type="tel"
          value={member.phone}
          onChange={(e) => onUpdate(index, "phone", e.target.value)}
          placeholder="Enter phone number"
        />
      </div>
      <div>
        <Label htmlFor={`department-${index}`}>Department</Label>
        <Input
          id={`department-${index}`}
          value={member.department}
          onChange={(e) => onUpdate(index, "department", e.target.value)}
          placeholder="Enter department"
        />
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
