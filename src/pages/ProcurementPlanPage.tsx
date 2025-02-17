
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Search, Download, Plus, Eye, Edit } from "lucide-react";
import { mockProcurementPlans } from "@/mock/procurementPlanData";
import type { ProcurementPlan } from "@/types/procurement-plan";

const ProcurementPlanPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [plans, setPlans] = useState<ProcurementPlan[]>(mockProcurementPlans);

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'Completed': return '✅';
      case 'In Progress': return '🔄';
      case 'Planned': return '❌';
      default: return '❌';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleExport = () => {
    console.log('Exporting to Excel...');
  };

  const filteredPlans = plans.filter(plan => 
    plan.project_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'all' || plan.policy_number.includes(selectedCategory))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6 shadow-lg">
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h1 className="text-2xl font-bold text-gray-900">Annual Procurement Plan - FY 2080/81</h1>
            </div>
            
            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="PP-2080">FY 2080/81</SelectItem>
                  <SelectItem value="PP-2081">FY 2081/82</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table Section */}
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Project Name</TableHead>
                    <TableHead className="text-right">Estimated Cost</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="w-[60px]">Q1</TableHead>
                    <TableHead className="w-[60px]">Q2</TableHead>
                    <TableHead className="w-[60px]">Q3</TableHead>
                    <TableHead className="w-[60px]">Q4</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>{plan.id}</TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {plan.project_name}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(plan.estimated_cost)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(plan.proposed_budget)}
                      </TableCell>
                      {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
                        <TableCell key={quarter} className="text-center">
                          {getStatusEmoji(
                            plan.quarterly_targets.find(t => t.quarter === quarter)?.status || 'Planned'
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Actions Section */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
              <Button variant="outline" onClick={handleExport} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add New Procurement Item
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProcurementPlanPage;
