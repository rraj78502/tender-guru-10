
import { CheckSquare, Clock } from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";
import type { CommitteeMember, CommitteeTask } from "@/types/committee";
import { cn } from "@/lib/utils";

interface TaskListProps {
  members: CommitteeMember[];
  tasks: CommitteeTask[];
  onTaskUpdate: (taskId: number, status: CommitteeTask['status']) => void;
}

const TaskList = ({ members, tasks, onTaskUpdate }: TaskListProps) => {
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
  );
};

export default TaskList;
