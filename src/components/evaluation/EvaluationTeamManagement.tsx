
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
import { UserPlus, Key } from "lucide-react";
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

  const handleGenerateOTP = (member: EvaluationTeamMember) => {
    const mockOTP = Math.random().toString(36).slice(-6);
    setSelectedMember(member);
    setShowOTPInput(true);
    
    toast({
      title: "OTP Generated",
      description: `An OTP has been sent to ${member.email}`,
    });
  };

  const handleVerifyOTP = (value: string) => {
    toast({
      title: "Access Granted",
      description: "Team member can now access evaluation documents",
    });
    setShowOTPInput(false);
    setSelectedMember(null);
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
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

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
                <Badge variant="outline">{member.role}</Badge>
              </TableCell>
              <TableCell>{member.department}</TableCell>
              <TableCell>
                <Badge variant={member.hasAccess ? "secondary" : "outline"}>
                  {member.hasAccess ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleGenerateOTP(member)}
                >
                  <Key className="mr-2 h-4 w-4" />
                  Generate OTP
                </Button>
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
                    <InputOTPSlot key={i} {...slot} index={i} />
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
