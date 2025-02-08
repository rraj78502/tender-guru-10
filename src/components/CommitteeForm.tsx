
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MemberFormItem from "@/components/committee/MemberFormItem";
import DateInputs from "@/components/committee/DateInputs";
import FileUpload from "@/components/committee/FileUpload";
import TaskManager from "@/components/committee/TaskManager";
import type { Committee, CommitteeMember, CommitteeTask } from "@/types/committee";

interface CommitteeFormProps {
  onClose: () => void;
  onCreateCommittee?: (committee: Committee) => void;
}

const CommitteeForm = ({ onClose, onCreateCommittee }: CommitteeFormProps) => {
  const { toast } = useToast();
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [formDate, setFormDate] = useState("");
  const [specificationDate, setSpecificationDate] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");

  const addMember = () => {
    const newMember: CommitteeMember = {
      id: Date.now(),
      employeeId: "",
      name: "",
      email: "",
      phone: "",
      role: "member",
      department: "",
      tasks: []
    };
    setMembers([...members, newMember]);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof CommitteeMember, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value,
    };
    setMembers(updatedMembers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!members.some(m => m.role === 'chairperson')) {
      toast({
        title: "Validation Error",
        description: "Please assign a chairperson to the committee",
        variant: "destructive"
      });
      return;
    }

    const committee: Committee = {
      id: Date.now(),
      name,
      purpose,
      formationDate: formDate,
      formationLetter: selectedFile || undefined,
      members,
      tasks: [],
      specifications: {
        submissionDate: specificationDate,
        documents: [],
        status: 'draft'
      },
      reviews: [],
      approvalStatus: 'draft'
    };

    onCreateCommittee?.(committee);
    
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card p-6 slide-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Committee</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <DateInputs
            formDate={formDate}
            specificationDate={specificationDate}
            reviewDate={reviewDate}
            onFormDateChange={setFormDate}
            onSpecificationDateChange={setSpecificationDate}
            onReviewDateChange={setReviewDate}
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Committee Members</h3>
              <Button type="button" onClick={addMember} variant="outline">
                Add Member
              </Button>
            </div>

            {members.map((member, index) => (
              <MemberFormItem
                key={member.id}
                member={member}
                index={index}
                onUpdate={updateMember}
                onRemove={removeMember}
              />
            ))}
          </div>

          <FileUpload onFileChange={setSelectedFile} />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Create & Notify
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CommitteeForm;
