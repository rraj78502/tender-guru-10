
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

    // BACKEND API: Create new committee
    // Endpoint: POST /api/committees
    // Request: Committee object without id
    // Response: Created Committee object with id and timestamps
    
    /* API Flow:
    // 1. User fills in committee form and submits
    // 2. handleSubmit prevents default form submission
    // 3. Client validates all required fields
    // 4. Client prepares committee object from form state
    // 5. API call made to POST /api/committees 
    // 6. Server validates committee data
    // 7. Server creates committee record in database
    // 8. Server generates notifications for committee members
    // 9. Response with created committee returned to client
    // 10. Client shows success message and closes form or redirects
    
    // Integration Code:
    const submitCommittee = async (committeeData: Omit<Committee, 'id'>) => {
      try {
        const response = await fetch('/api/committees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(committeeData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create committee');
        }
        
        const createdCommittee = await response.json();
        
        toast({
          title: "Committee Created",
          description: "Committee has been formed successfully. Notifications will be sent to members.",
        });
        
        // If selected file exists, upload it
        if (selectedFile) {
          const formData = new FormData();
          formData.append('file', selectedFile);
          formData.append('committeeId', createdCommittee.id.toString());
          
          const uploadResponse = await fetch('/api/committees/documents', {
            method: 'POST',
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            console.error('Document upload failed, but committee was created');
          }
        }
        
        // Send notifications to members
        await Promise.all(createdCommittee.members.map(async (member) => {
          try {
            await fetch('/api/notifications', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                recipientId: member.employeeId,
                type: 'committee_assignment',
                message: `You have been assigned to the committee: ${createdCommittee.name}`,
                data: {
                  committeeId: createdCommittee.id,
                  committeeName: createdCommittee.name,
                  role: member.role
                }
              }),
            });
          } catch (error) {
            console.error(`Failed to send notification to member ${member.name}:`, error);
          }
        }));
        
        if (onCreateCommittee) {
          onCreateCommittee(createdCommittee);
        }
        
        onClose();
        return createdCommittee;
      } catch (error) {
        console.error('Error creating committee:', error);
        
        toast({
          title: "Creation Failed",
          description: error.message || "An error occurred while creating the committee.",
          variant: "destructive",
        });
        
        throw error;
      }
    }; */

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
