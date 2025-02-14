
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import DateInputs from "./DateInputs";
import FileUpload from "./FileUpload";
import TaskManager from "./TaskManager";
import BasicInfoFields from "./BasicInfoFields";
import CommitteeMembers from "./CommitteeMembers";
import FormHeader from "./form/FormHeader";
import FormActions from "./form/FormActions";
import type { Committee, CommitteeMember, CommitteeTask } from "@/types/committee";
import { useMockDb } from "@/hooks/useMockDb";
import { mockEmployees } from "@/mock/employeeData";

interface CommitteeFormProps {
  onClose: () => void;
  onCreateCommittee?: (committee: Committee) => void;
}

const CommitteeForm = ({ onClose, onCreateCommittee }: CommitteeFormProps) => {
  const { toast } = useToast();
  const { create: createCommittee, data: committees } = useMockDb<Committee>('committees');
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [formDate, setFormDate] = useState("");
  const [specificationDate, setSpecificationDate] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tasks, setTasks] = useState<CommitteeTask[]>([]);
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");

  const handleCreateTask = (task: Omit<CommitteeTask, 'id'>) => {
    const newTask: CommitteeTask = {
      id: Date.now(),
      ...task,
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskId: number, status: CommitteeTask['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting committee creation process...');
    console.log('Current form state:', {
      name,
      purpose,
      formDate,
      specificationDate,
      membersCount: members.length,
      members,
      tasksCount: tasks.length,
      tasks
    });

    // Create a clean committee object without circular references
    const committee: Omit<Committee, 'id'> = {
      name,
      purpose,
      formationDate: formDate,
      members: members.map(member => ({
        ...member,
        tasks: [] // Initialize with empty tasks array to prevent circular refs
      })),
      tasks: tasks.map(task => ({
        ...task,
        attachments: [],
        comments: []
      })),
      specifications: {
        submissionDate: specificationDate,
        documents: [],
        status: 'draft'
      },
      reviews: [],
      approvalStatus: 'draft'
    };

    console.log('Attempting to create committee:', committee);
    const createdCommittee = createCommittee(committee);
    console.log('Committee creation result:', createdCommittee);
    console.log('Current committees in DB:', committees);
    
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
    
    console.log('Adding new member:', newMember);
    setMembers(prevMembers => [...prevMembers, newMember]);
  };

  const handleUpdateMember = (index: number, field: keyof CommitteeMember, value: string) => {
    setMembers(prevMembers => {
      const updatedMembers = [...prevMembers];
      updatedMembers[index] = {
        ...updatedMembers[index],
        [field]: value,
      };

      // If employeeId is being updated, populate other fields from mockEmployees
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

      console.log('Updated member:', updatedMembers[index]);
      return updatedMembers;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <FormHeader onClose={onClose} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInfoFields
            name={name}
            purpose={purpose}
            onNameChange={setName}
            onPurposeChange={setPurpose}
          />

          <DateInputs
            formDate={formDate}
            specificationDate={specificationDate}
            reviewDate={reviewDate}
            onFormDateChange={setFormDate}
            onSpecificationDateChange={setSpecificationDate}
            onReviewDateChange={setReviewDate}
          />

          <CommitteeMembers
            members={members}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onRemoveMember={(index) => {
              setMembers(members.filter((_, i) => i !== index));
            }}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Task Management</h3>
            <TaskManager
              members={members}
              tasks={tasks}
              onTaskCreate={handleCreateTask}
              onTaskUpdate={handleUpdateTask}
            />
          </div>

          <FileUpload onFileChange={setSelectedFile} />

          <FormActions onClose={onClose} />
        </form>
      </Card>
    </div>
  );
};

export default CommitteeForm;

