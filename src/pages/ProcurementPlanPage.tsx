
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
    // Implementation for Excel export would go here
    console.log('Exporting to Excel...');
  };

  const filteredPlans = plans.filter(plan => 
    plan.project_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'all' || plan.policy_number.includes(selectedCategory))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Annual Procurement Plan - FY 2080/81</h1>
            
            {/* Search and Filter Section */}
            <div className="flex gap-4 mb-6">
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
                <SelectTrigger className="w-[180px]">
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
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Project Name</TableHead>
                    <TableHead className="text-right">Estimated Cost</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead>Q1</TableHead>
                    <TableHead>Q2</TableHead>
                    <TableHead>Q3</TableHead>
                    <TableHead>Q4</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>{plan.id}</TableCell>
                      <TableCell className="font-medium">{plan.project_name}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(plan.estimated_cost)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(plan.proposed_budget)}
                      </TableCell>
                      {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
                        <TableCell key={quarter}>
                          {getStatusEmoji(
                            plan.quarterly_targets.find(t => t.quarter === quarter)?.status || 'Planned'
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-2">
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
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
              <Button>
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
