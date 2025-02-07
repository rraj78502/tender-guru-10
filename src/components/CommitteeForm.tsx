
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface CommitteeMember {
  employeeId: string;
  name: string;
  role: "member" | "chairperson";
}

interface CommitteeFormProps {
  onClose: () => void;
}

const CommitteeForm = ({ onClose }: CommitteeFormProps) => {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [formDate, setFormDate] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      formDate,
      members,
    });
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

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Committee</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CommitteeForm;
