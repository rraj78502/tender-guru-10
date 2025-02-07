
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { CommitteeTask, CommitteeMember } from "@/types/committee";

interface TaskManagerProps {
  members: CommitteeMember[];
  tasks: CommitteeTask[];
  onTaskCreate: (task: Omit<CommitteeTask, 'id'>) => void;
  onTaskUpdate: (taskId: number, status: CommitteeTask['status']) => void;
}

const TaskManager = ({ members, tasks, onTaskCreate, onTaskUpdate }: TaskManagerProps) => {
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Button type="submit">Create Task</Button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Tasks</h3>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-500">{task.description}</p>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <select
                  value={task.status}
                  onChange={(e) => onTaskUpdate(task.id, e.target.value as CommitteeTask['status'])}
                  className="p-1 border rounded-md text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
