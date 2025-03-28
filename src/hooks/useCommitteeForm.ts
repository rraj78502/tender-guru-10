
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMockDb } from "@/hooks/useMockDb";
import type { Committee, CommitteeMember } from "@/types/committee";
import { mockEmployees } from "@/mock/employeeData";

export const useCommitteeForm = (onClose: () => void, onCreateCommittee?: (committee: Committee) => void) => {
  const { toast } = useToast();
  const { create: createCommittee } = useMockDb<Committee>('committees');
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [formDate, setFormDate] = useState("");
  const [specificationDate, setSpecificationDate] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");

  const handleAddMember = () => {
    // BACKEND API: Get available employees for committee
    // Endpoint: GET /api/employees/available
    // Request: { exclude: string[] } (IDs to exclude from results)
    // Response: Array of Employee objects
    
    const existingEmployeeIds = new Set(members.map(m => m.employeeId));
    const availableEmployee = mockEmployees.find(emp => !existingEmployeeIds.has(emp.employeeId));

    if (!availableEmployee) {
      toast({
        title: "Cannot Add Member",
        description: "All available employees have been added to the committee",
        variant: "destructive"
      });
      return;
    }

    const newMember: CommitteeMember = {
      id: Date.now(),
      employeeId: availableEmployee.employeeId,
      name: availableEmployee.name,
      email: availableEmployee.email,
      phone: availableEmployee.phone,
      role: "member",
      department: availableEmployee.department,
      tasks: [],
    };
    
    setMembers(prevMembers => [...prevMembers, newMember]);
  };

  const handleUpdateMember = (index: number, field: keyof CommitteeMember, value: string) => {
    // BACKEND API: When selecting an employee by ID
    // Endpoint: GET /api/employees/:employeeId
    // Request: { employeeId: string }
    // Response: Employee object with details
    
    setMembers(prevMembers => {
      const updatedMembers = [...prevMembers];
      updatedMembers[index] = {
        ...updatedMembers[index],
        [field]: value,
      };

      if (field === 'employeeId') {
        const employee = mockEmployees.find(emp => emp.employeeId === value);
        if (employee) {
          updatedMembers[index] = {
            ...updatedMembers[index],
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            department: employee.department,
          };
        }
      }

      return updatedMembers;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // BACKEND API: Create committee
    // Endpoint: POST /api/committees
    // Request Body: {
    //   name: string,
    //   purpose: string,
    //   formationDate: string (ISO date),
    //   members: CommitteeMember[],
    //   specifications: { submissionDate: string, status: string },
    //   procurementPlanId?: number (if linked to procurement plan)
    // }
    // Response: { id: number, ...committeeData }

    const committee: Omit<Committee, 'id'> = {
      name,
      purpose,
      formationDate: formDate,
      members: members.map(member => ({
        ...member,
        tasks: []
      })),
      tasks: [],
      specifications: {
        submissionDate: specificationDate,
        documents: [],
        status: 'draft'
      },
      reviews: [],
      approvalStatus: 'draft'
    };

    const createdCommittee = createCommittee(committee);
    
    if (onCreateCommittee) {
      onCreateCommittee(createdCommittee);
    }
    
    toast({
      title: "Committee Created",
      description: "Committee has been formed successfully. Notifications will be sent to members.",
    });
    
    members.forEach(member => {
      // BACKEND API: Send notifications to members
      // Endpoint: POST /api/notifications
      // Request Body: { 
      //   type: "email" | "sms",
      //   recipient: string,
      //   subject: string,
      //   message: string 
      // }
      // Response: { success: boolean, messageId?: string }
      
      console.log(`Mock email sent to ${member.email}`);
      console.log(`Mock SMS sent to ${member.phone}`);
    });
    
    onClose();
  };

  return {
    members,
    formDate,
    specificationDate,
    reviewDate,
    selectedFile,
    name,
    purpose,
    handleAddMember,
    handleUpdateMember,
    handleSubmit,
    setMembers,
    setFormDate,
    setSpecificationDate,
    setReviewDate,
    setSelectedFile,
    setName,
    setPurpose,
  };
};
