
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Chart } from "@/components/ui/chart";
import { 
  ChartBar, 
  ChartLine, 
  ChartPie,
  Calendar,
  FileText,
  DollarSign,
  ClipboardCheck
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}

const StatsCard = ({ title, value, icon, description }: StatsCardProps) => {
  return (
    <Card className="p-6 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-primary/10 rounded-full">
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Card>
  );
};

const DashboardStats = () => {
  // Mock data - in a real app, this would come from your API
  const mockStats = {
    activeProjects: 12,
    completedProjects: 45,
    totalBudget: "$1.2M",
    pendingContracts: 8
  };

  // Mock chart data
  const chartData = [
    { name: "Jan", value: 20 },
    { name: "Feb", value: 35 },
    { name: "Mar", value: 28 },
    { name: "Apr", value: 45 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Projects"
          value={mockStats.activeProjects}
          icon={<ChartBar className="h-4 w-4 text-primary" />}
          description="Currently in progress"
        />
        <StatsCard
          title="Completed Projects"
          value={mockStats.completedProjects}
          icon={<ClipboardCheck className="h-4 w-4 text-primary" />}
          description="Successfully delivered"
        />
        <StatsCard
          title="Total Budget"
          value={mockStats.totalBudget}
          icon={<DollarSign className="h-4 w-4 text-primary" />}
          description="Across all projects"
        />
        <StatsCard
          title="Pending Contracts"
          value={mockStats.pendingContracts}
          icon={<FileText className="h-4 w-4 text-primary" />}
          description="Awaiting approval"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Project Timeline Overview</h3>
          <Chart
            type="bar"
            data={chartData}
            xField="name"
            yField="value"
            height={300}
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Contract Status Distribution</h3>
          <Chart
            type="pie"
            data={[
              { name: "Active", value: 45 },
              { name: "Pending", value: 25 },
              { name: "Completed", value: 30 },
            ]}
            height={300}
          />
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;
