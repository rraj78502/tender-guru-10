
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ListCheck } from "lucide-react";
import type { CommitteeMember, CommitteeTask } from "@/types/committee";

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
      <div className="flex items-center gap-2 mb-4">
        <ListCheck className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Create New Task</h3>
      </div>

      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="assignedTo">Assign To</Label>
        <select
          id="assignedTo"
          className="w-full p-2 border rounded-md"
          value={newTask.assignedTo}
          onChange={(e) => setNewTask({ ...newTask, assignedTo: Number(e.target.value) })}
          required
        >
          <option value="">Select Member</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name} ({member.role})
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="w-full">Create Task</Button>
    </form>
  );
};

export default TaskForm;
