
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
    assignedTo: 0,
    dueDate: "",
  });

  const handleFieldChange = (field: string, value: string | number) => {
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

    onTaskCreate({
      ...newTask,
      dueDate: date.toISOString(),
      status: "pending",
    });

    setNewTask({
      title: "",
      description: "",
      assignedTo: 0,
      dueDate: "",
    });
    setDate(undefined);

    toast({
      title: "Task Created",
      description: "New task has been assigned successfully",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-white">
      <TaskFormHeader />
      <TaskFormFields
        title={newTask.title}
        description={newTask.description}
        assignedTo={newTask.assignedTo}
        members={members}
        onChange={handleFieldChange}
      />
      <TaskDatePicker date={date} onSelect={setDate} />
      <Button type="submit" className="w-full">Create Task</Button>
    </form>
  );
};

export default TaskForm;
