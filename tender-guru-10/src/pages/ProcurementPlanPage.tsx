import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download, Plus, Eye, Edit, Calendar } from "lucide-react";
import type { ProcurementPlan } from "@/types/procurement-plan";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import ProcurementPlanForm from '@/components/procurement/ProcurementPlanForm';
import ProcurementPlanView from '@/components/procurement/ProcurementPlanView';
import { useAuth } from '@/contexts/AuthContext';

const ProcurementPlanPage = () => {
  const {user}=useAuth();  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedProgress, setSelectedProgress] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [plans, setPlans] = useState<ProcurementPlan[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculatePlanStatus = (plan: ProcurementPlan) => {
    const targets = plan.quarterly_targets;
    const completedCount = targets.filter(t => t.status === 'Completed').length;
    const inProgressCount = targets.filter(t => t.status === 'In Progress').length;

    if (completedCount === targets.length) return 'Completed';
    if (inProgressCount > 0) return 'In Progress';
    return 'Planning Phase';
  };

  const calculateProgress = (plan: ProcurementPlan) => {
    const targets = plan.quarterly_targets;
    const completedCount = targets.filter(t => t.status === 'Completed').length;
    const progress = (completedCount / targets.length) * 100;

    if (progress === 0) return 'Not Started';
    if (progress <= 25) return 'Early Stage';
    if (progress <= 75) return 'Mid Stage';
    if (progress < 100) return 'Final Stage';
    return 'Completed';
  };

  const isWithinDateRange = (date: string) => {
    if (!dateRange?.from || !dateRange?.to) return true;
    const planDate = new Date(date);
    return planDate >= dateRange.from && planDate <= dateRange.to;
  };

  useEffect(() => {
    const fetchProcurementPlans = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/v1/procurement-plans/getallprocurementplans', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch procurement plans');
        const data = await response.json();
        setPlans(data.data.procurementPlans);
      } catch (error) {
        // Silently handle the error, let the UI show "No plans found"
      setPlans([]); // Ensure plans is empty to trigger "No plans found
      } finally {
        setLoading(false);
      }
    };
    fetchProcurementPlans();
  }, [toast]);

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.project_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || plan.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || calculatePlanStatus(plan) === selectedStatus;
    const matchesProgress = selectedProgress === 'all' || calculateProgress(plan) === selectedProgress;
    const matchesDateRange = isWithinDateRange(plan.createdAt);

    return matchesSearch && matchesDepartment && matchesStatus && matchesProgress && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    console.log('Exporting to Excel...');
  };

  const getQuarterStatusDisplay = (target: { status: string, target_details: string }) => {
    const statusColors = {
      'Completed': 'text-green-600',
      'In Progress': 'text-blue-600',
      'Planned': 'text-gray-600'
    };

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span className={`text-xs font-medium ${statusColors[target.status as keyof typeof statusColors]}`}>
              {target.status}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{target.target_details}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const handleAddNewPlan = async (newPlan: Omit<ProcurementPlan, '_id' | 'createdBy' | 'createdAt'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/procurement-plans/createprocurementplan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newPlan),
      });

      if (!response.ok) throw new Error('Failed to create procurement plan');
      const data = await response.json();
      const createdPlan = data.data.procurementPlan;

      setPlans(prev => [...prev, createdPlan]);
      toast({
        title: "Success",
        description: "New procurement plan has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add new procurement plan.",
        variant: "destructive",
      });
    }
  };

  const handleView = (plan: ProcurementPlan) => {
    setSelectedPlanId(plan._id);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6 shadow-lg">
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h1 className="text-2xl font-bold text-gray-900">Annual Procurement Plan - FY 2080/81</h1>
            </div>
            
            <div className="space-y-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Wireline">Wireline</SelectItem>
                    <SelectItem value="Wireless">Wireless</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Planning Phase">Planning Phase</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedProgress} onValueChange={setSelectedProgress}>
                  <SelectTrigger>
                    <SelectValue placeholder="Progress" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Progress</SelectItem>
                    <SelectItem value="Not Started">Not Started (0%)</SelectItem>
                    <SelectItem value="Early Stage">Early Stage (1-25%)</SelectItem>
                    <SelectItem value="Mid Stage">Mid Stage (26-75%)</SelectItem>
                    <SelectItem value="Final Stage">Final Stage (76-99%)</SelectItem>
                    <SelectItem value="Completed">Completed (100%)</SelectItem>
                  </SelectContent>
                </Select>

                <DateRangePicker 
                  date={dateRange}
                  onDateChange={setDateRange}
                />
              </div>
            </div>

            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="w-[120px]">Policy Number</TableHead>
                    <TableHead className="w-[120px]">Department</TableHead>
                    <TableHead className="w-[100px]">Dept. Index</TableHead>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Project Description</TableHead>
                    <TableHead className="text-right">Estimated Cost</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="min-w-[100px]">Q1</TableHead>
                    <TableHead className="min-w-[100px]">Q2</TableHead>
                    <TableHead className="min-w-[100px]">Q3</TableHead>
                    <TableHead className="min-w-[100px]">Q4</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={13} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : paginatedPlans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={13} className="text-center">No plans found</TableCell>
                    </TableRow>
                  ) : (
                    paginatedPlans.map((plan) => {
                      const deptIndex = plan.policy_number.split('-').slice(-1)[0];
                      const policyNumber = plan.policy_number.split('-').slice(0, -1).join('-');
                      
                      return (
                        <TableRow key={plan._id}>
                          <TableCell>{plan._id}</TableCell>
                          <TableCell>{policyNumber}</TableCell>
                          <TableCell>{plan.department}</TableCell>
                          <TableCell>{deptIndex}</TableCell>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {plan.project_name}
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {plan.project_description}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(plan.estimated_cost)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(plan.proposed_budget)}
                          </TableCell>
                          {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
                            <TableCell key={quarter} className="text-center">
                              {getQuarterStatusDisplay(
                                plan.quarterly_targets.find(t => t.quarter === quarter) || 
                                { status: 'Planned', target_details: 'No task planned' }
                              )}
                            </TableCell>
                          ))}
                          <TableCell>
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" size="sm" onClick={() => handleView(plan)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPlans.length)} of{' '}
                  {filteredPlans.length} results
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
              <Button variant="outline" onClick={handleExport} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
              {['admin', 'procurement_officer'].includes(user?.role) && (
                <Button 
                  className="w-full sm:w-auto"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Procurement Item
                </Button>
              )}

            </div>
          </div>
        </Card>
      </div>
      <ProcurementPlanForm
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddNewPlan}
      />
      {selectedPlanId && (
        <ProcurementPlanView
          open={isViewDialogOpen}
          onClose={() => {
            setIsViewDialogOpen(false);
            setSelectedPlanId(null);
          }}
          planId={selectedPlanId}
        />
      )}
    </div>
  );
};

export default ProcurementPlanPage;