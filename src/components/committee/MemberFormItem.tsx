
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { CommitteeMember } from "@/types/committee";
import { useToast } from "@/hooks/use-toast";
import type { Employee } from "@/types/employee";
import { useEffect, useState, useRef } from "react";
import { mockEmployees } from "@/mock/employeeData";

interface MemberFormItemProps {
  member: CommitteeMember;
  index: number;
  onUpdate: (index: number, field: keyof CommitteeMember, value: string) => void;
  onRemove: (index: number) => void;
}

const MemberFormItem = ({ member, index, onUpdate, onRemove }: MemberFormItemProps) => {
  const { toast } = useToast();
  const [employees] = useState<Employee[]>(mockEmployees);
  const [localFields, setLocalFields] = useState({
    employeeId: member.employeeId,
    name: member.name,
    email: member.email,
    phone: member.phone,
    department: member.department
  });
  const hasPopulatedRef = useRef(false);

  const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmployeeId = e.target.value;
    setLocalFields(prev => ({ ...prev, employeeId: newEmployeeId }));
    
    // Reset fields if employee ID is changed
    if (newEmployeeId.length < 6) {
      hasPopulatedRef.current = false;
      const emptyFields = {
        employeeId: newEmployeeId,
        name: "",
        email: "",
        phone: "",
        department: ""
      };
      setLocalFields(emptyFields);
      // Update parent state
      Object.keys(emptyFields).forEach(field => {
        onUpdate(index, field as keyof CommitteeMember, emptyFields[field as keyof typeof emptyFields]);
      });
    }
  };

  // Use useEffect to watch for changes in employeeId and populate data
  useEffect(() => {
    if (localFields.employeeId.length === 6 && !hasPopulatedRef.current) {
      const employee = employees.find(emp => emp.employeeId === localFields.employeeId);
      
      if (employee) {
        const updatedFields = {
          employeeId: employee.employeeId,
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          department: employee.department
        };
        
        // Update local state
        setLocalFields(updatedFields);
        
        // Update parent state
        Object.keys(updatedFields).forEach(field => {
          onUpdate(index, field as keyof CommitteeMember, updatedFields[field as keyof typeof updatedFields]);
        });
        
        hasPopulatedRef.current = true;
        
        toast({
          title: "Employee Data Imported",
          description: `Employee information for ${employee.name} has been automatically filled`,
        });
      }
    }
  }, [localFields.employeeId, employees, index, onUpdate, toast]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg relative">
      <div>
        <Label htmlFor={`employee-id-${index}`}>Employee ID</Label>
        <Input
          id={`employee-id-${index}`}
          value={localFields.employeeId}
          onChange={handleEmployeeIdChange}
          placeholder="Enter employee ID (e.g., EMP001)"
          required
          maxLength={6}
        />
      </div>
      <div>
        <Label htmlFor={`name-${index}`}>Name</Label>
        <Input
          id={`name-${index}`}
          value={localFields.name}
          onChange={(e) => {
            setLocalFields(prev => ({ ...prev, name: e.target.value }));
            onUpdate(index, "name", e.target.value);
          }}
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
          value={localFields.email}
          onChange={(e) => {
            setLocalFields(prev => ({ ...prev, email: e.target.value }));
            onUpdate(index, "email", e.target.value);
          }}
          placeholder="Enter email address"
        />
      </div>
      <div>
        <Label htmlFor={`phone-${index}`}>Phone</Label>
        <Input
          id={`phone-${index}`}
          type="tel"
          value={localFields.phone}
          onChange={(e) => {
            setLocalFields(prev => ({ ...prev, phone: e.target.value }));
            onUpdate(index, "phone", e.target.value);
          }}
          placeholder="Enter phone number"
        />
      </div>
      <div>
        <Label htmlFor={`department-${index}`}>Department</Label>
        <Input
          id={`department-${index}`}
          value={localFields.department}
          onChange={(e) => {
            setLocalFields(prev => ({ ...prev, department: e.target.value }));
            onUpdate(index, "department", e.target.value);
          }}
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

