
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Key, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { EvaluationTeam, EvaluationTeamMember } from "@/types/evaluation";

interface Props {
  team: EvaluationTeam;
  onTeamUpdate: (team: EvaluationTeam) => void;
}

const EvaluationTeamManagement = ({ team, onTeamUpdate }: Props) => {
  const { toast } = useToast();
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [selectedMember, setSelectedMember] = useState<EvaluationTeamMember | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "member" as const,
    department: "",
  });

  const handleGenerateOTP = async (member: EvaluationTeamMember) => {
    const mockOTP = Math.random().toString(36).slice(-6);
    setSelectedMember({ ...member, otp: mockOTP, otpValidUntil: new Date(Date.now() + 30 * 60000).toISOString() });
    setShowOTPInput(true);
    
    // In a real implementation, this would be an API call to send the OTP
    toast({
      title: "OTP Generated",
      description: `An OTP has been sent to ${member.email}`,
    });
  };

  const handleVerifyOTP = (value: string) => {
    if (selectedMember?.otp === value) {
      const updatedTeam = {
        ...team,
        members: team.members.map(m => 
          m.id === selectedMember.id ? { ...m, hasAccess: true } : m
        )
      };
      onTeamUpdate(updatedTeam);
      
      toast({
        title: "Access Granted",
        description: "Team member can now access evaluation documents",
      });
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please try again",
        variant: "destructive",
      });
    }
    setShowOTPInput(false);
    setSelectedMember(null);
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedTeam = {
      ...team,
      members: [
        ...team.members,
        {
          id: Date.now(),
          ...newMember,
          hasAccess: false,
        },
      ],
    };

    onTeamUpdate(updatedTeam);
    setShowAddMember(false);
    setNewMember({
      name: "",
      email: "",
      role: "member",
      department: "",
    });

    toast({
      title: "Member Added",
      description: "New team member has been added successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{team.name}</h3>
          <p className="text-sm text-gray-500">
            Created on {new Date(team.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Button onClick={() => setShowAddMember(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      {showAddMember && (
        <div className="p-4 border rounded-lg space-y-4">
          <h4 className="font-medium">Add New Team Member</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="w-full p-2 border rounded-md"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value as "chair" | "member" | "secretary" })}
              >
                <option value="member">Member</option>
                <option value="chair">Chair</option>
                <option value="secretary">Secretary</option>
              </select>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={newMember.department}
                onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddMember(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember}>
              Add Member
            </Button>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Access Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {team.members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">{member.role}</Badge>
              </TableCell>
              <TableCell>{member.department}</TableCell>
              <TableCell>
                <Badge variant={member.hasAccess ? "secondary" : "outline"}>
                  {member.hasAccess ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleGenerateOTP(member)}
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Generate OTP
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Access Instructions Sent",
                        description: `Instructions have been sent to ${member.email}`,
                      });
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Instructions
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showOTPInput && (
        <div className="mt-4 p-4 border rounded-lg">
          <h4 className="text-sm font-medium mb-2">Enter OTP sent to {selectedMember?.email}</h4>
          <div className="flex gap-4 items-center">
            <InputOTP
              maxLength={6}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, i) => (
                    <InputOTPSlot key={i} {...slot} />
                  ))}
                </InputOTPGroup>
              )}
              onComplete={handleVerifyOTP}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationTeamManagement;
