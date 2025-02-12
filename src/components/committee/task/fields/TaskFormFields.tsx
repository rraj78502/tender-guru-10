
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { CommitteeMember } from "@/types/committee";

interface TaskFormFieldsProps {
  title: string;
  description: string;
  assignedTo: number;
  members: CommitteeMember[];
  onChange: (field: string, value: string | number) => void;
}

const TaskFormFields = ({ title, description, members, onChange }: TaskFormFieldsProps) => {
  const { toast } = useToast();
  
  // Log initial props for debugging
  console.log('TaskFormFields render with props:', { 
    title, 
    description, 
    memberCount: members?.length,
    membersData: members 
  });

  // When component mounts, show toast indicating all members will be assigned
  React.useEffect(() => {
    if (members?.length > 0) {
      toast({
        title: "Task Assignment",
        description: "This task will be assigned to all committee members",
      });
    }
  }, [members, toast]);

  return (
    <>
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onChange("title", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          required
        />
      </div>
    </>
  );
};

export default TaskFormFields;

