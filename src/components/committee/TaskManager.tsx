
import type { CommitteeMember, CommitteeTask } from "@/types/committee";
import TaskForm from "./task/TaskForm";
import TaskList from "./task/TaskList";

interface TaskManagerProps {
  members: CommitteeMember[];
  tasks: CommitteeTask[];
  onTaskCreate: (task: Omit<CommitteeTask, 'id'>) => void;
  onTaskUpdate: (taskId: number, status: CommitteeTask['status']) => void;
}

const TaskManager = ({ members, tasks, onTaskCreate, onTaskUpdate }: TaskManagerProps) => {
  console.log('TaskManager members:', members); // Debug log
  
  return (
    <div className="space-y-6">
      <TaskForm members={members} onTaskCreate={onTaskCreate} />
      <TaskList members={members} tasks={tasks} onTaskUpdate={onTaskUpdate} />
    </div>
  );
};

export default TaskManager;
