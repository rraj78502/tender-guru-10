
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X, Upload, Calendar, Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CommitteeMember {
  employeeId: string;
  name: string;
  role: "member" | "chairperson";
}

interface CommitteeFormProps {
  onClose: () => void;
}

const CommitteeForm = ({ onClose }: CommitteeFormProps) => {
  const { toast } = useToast();
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [formDate, setFormDate] = useState("");
  const [specificationDate, setSpecificationDate] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const addMember = () => {
    setMembers([
      ...members,
      { employeeId: "", name: "", role: "member" },
    ]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      toast({
        title: "File selected",
        description: `File "${e.target.files[0].name}" ready for upload`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock data submission
    const formData = {
      formDate,
      specificationDate,
      reviewDate,
      members,
      file: selectedFile?.name,
    };
    console.log("Form submitted:", formData);
    
    toast({
      title: "Committee Created",
      description: "Committee has been formed successfully. Notifications will be sent to members.",
    });
    
    // Mock sending notifications
    members.forEach(member => {
      console.log(`Mock notification sent to ${member.name}`);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="formation-date">Formation Date</Label>
              <Input
                id="formation-date"
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="specification-date">Specification Submission Date</Label>
              <Input
                id="specification-date"
                type="date"
                value={specificationDate}
                onChange={(e) => setSpecificationDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Committee Members</h3>
              <Button type="button" onClick={addMember} variant="outline">
                Add Member
              </Button>
            </div>

            {members.map((member, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg relative">
                <div>
                  <Label htmlFor={`employee-id-${index}`}>Employee ID</Label>
                  <Input
                    id={`employee-id-${index}`}
                    value={member.employeeId}
                    onChange={(e) => updateMember(index, "employeeId", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`name-${index}`}>Name</Label>
                  <Input
                    id={`name-${index}`}
                    value={member.name}
                    onChange={(e) => updateMember(index, "name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`role-${index}`}>Role</Label>
                  <select
                    id={`role-${index}`}
                    value={member.role}
                    onChange={(e) => updateMember(index, "role", e.target.value as "member" | "chairperson")}
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
                  onClick={() => removeMember(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <Label htmlFor="committee-letter">Committee Formation Letter</Label>
            <div className="flex items-center gap-4">
              <Input
                id="committee-letter"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="cursor-pointer"
              />
              <Button type="button" variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="review-date">Review Date</Label>
            <div className="flex items-center gap-4">
              <Input
                id="review-date"
                type="date"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
              />
              <Button type="button" variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </Button>
            </div>
          </div>

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
