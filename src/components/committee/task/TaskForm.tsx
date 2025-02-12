
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { CommitteeMember, CommitteeTask } from "@/types/committee";
import TaskFormFields from "./fields/TaskFormFields";
import TaskDatePicker from "./fields/TaskDatePicker";
import TaskFormHeader from "./fields/TaskFormHeader";

interface TaskFormProps {
  members: CommitteeMember[];
  onTaskCreate: (task: Omit<CommitteeTask, 'id'>) => void;
}

const TaskForm = ({ members, onTaskCreate }: TaskFormProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  console.log('TaskForm render with:', {
    memberCount: members?.length,
    membersData: members?.map(m => ({ id: m.id, name: m.name, role: m.role }))
  });

  const handleFieldChange = (field: string, value: string | number) => {
    console.log('TaskForm field change:', { field, value });
    setNewTask({ ...newTask, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a due date",
        variant: "destructive",
      });
      return;
    }

    if (members && members.length > 0) {
      // Create a task for each member
      members.forEach(member => {
        onTaskCreate({
          ...newTask,
          assignedTo: member.id,
          dueDate: date.toISOString(),
          status: "pending",
        });
      });

      setNewTask({
        title: "",
        description: "",
        dueDate: "",
      });
      setDate(undefined);

      toast({
        title: "Tasks Created",
        description: `Task has been assigned to all ${members.length} committee members`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-white">
      <TaskFormHeader />
      <TaskFormFields
        title={newTask.title}
        description={newTask.description}
        assignedTo={0}
        members={members}
        onChange={handleFieldChange}
      />
      <TaskDatePicker date={date} onSelect={setDate} />
      <Button type="submit" className="w-full">Create Task</Button>
    </form>
  );
};

export default TaskForm;
