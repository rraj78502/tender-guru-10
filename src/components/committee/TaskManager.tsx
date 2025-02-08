
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isAfter, isBefore } from "date-fns";
import { Calendar as CalendarIcon, ListCheck, Clock, CheckSquare } from "lucide-react";
import type { CommitteeTask, CommitteeMember } from "@/types/committee";
import { cn } from "@/lib/utils";

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

  const getStatusColor = (status: CommitteeTask['status']) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const checkTaskStatus = (task: CommitteeTask) => {
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    
    if (task.status !== "completed" && isBefore(dueDate, now)) {
      onTaskUpdate(task.id, "overdue");
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Current Tasks</h3>
        </div>
        <div className="space-y-2">
          {tasks.map((task) => {
            checkTaskStatus(task);
            const assignedMember = members.find(m => m.id === task.assignedTo);
            return (
              <div key={task.id} className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-500">{task.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      Due: {format(new Date(task.dueDate), "PPP")}
                    </div>
                    {assignedMember && (
                      <p className="text-sm text-gray-500">
                        Assigned to: {assignedMember.name}
                      </p>
                    )}
                  </div>
                  <select
                    value={task.status}
                    onChange={(e) => onTaskUpdate(task.id, e.target.value as CommitteeTask['status'])}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm",
                      getStatusColor(task.status)
                    )}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            );
          })}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border rounded-lg">
              No tasks created yet. Use the form above to create your first task.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;

