
import { Button } from "@/components/ui/button";
import MemberFormItem from "./MemberFormItem";
import type { CommitteeMember } from "@/types/committee";

interface CommitteeMembersProps {
  members: CommitteeMember[];
  onAddMember: () => void;
  onUpdateMember: (index: number, field: keyof CommitteeMember, value: string) => void;
  onRemoveMember: (index: number) => void;
}

const CommitteeMembers = ({
  members,
  onAddMember,
  onUpdateMember,
  onRemoveMember,
}: CommitteeMembersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Committee Members</h3>
        <Button type="button" onClick={onAddMember} variant="outline">
          Add Member
        </Button>
      </div>

      {members.map((member, index) => (
        <MemberFormItem
          key={member.id}
          member={member}
          index={index}
          onUpdate={onUpdateMember}
          onRemove={onRemoveMember}
        />
      ))}
    </div>
  );
};

export default CommitteeMembers;
