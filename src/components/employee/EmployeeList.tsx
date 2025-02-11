
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download } from "lucide-react";
import type { Employee } from "@/types/employee";
import { exportToCSV } from "@/utils/exportUtils";

interface EmployeeListProps {
  employees: Employee[];
}

type SortField = 'employeeId' | 'name' | 'department' | 'designation';
type SortOrder = 'asc' | 'desc';

const EmployeeList = ({ employees }: EmployeeListProps) => {
  const [sortConfig, setSortConfig] = useState<{ field: SortField; order: SortOrder }>({
    field: 'employeeId',
    order: 'asc'
  });

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    const fieldA = a[sortConfig.field].toLowerCase();
    const fieldB = b[sortConfig.field].toLowerCase();
    
    if (sortConfig.order === 'asc') {
      return fieldA.localeCompare(fieldB);
    }
    return fieldB.localeCompare(fieldA);
  });

  const handleExport = () => {
    exportToCSV(employees, 'employee-list');
  };

  return (
    <Card className="p-4">
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('employeeId')}>
              Employee ID
              <ArrowUpDown className="ml-1 h-4 w-4 inline" />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
              Name
              <ArrowUpDown className="ml-1 h-4 w-4 inline" />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('department')}>
              Department
              <ArrowUpDown className="ml-1 h-4 w-4 inline" />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('designation')}>
              Designation
              <ArrowUpDown className="ml-1 h-4 w-4 inline" />
            </TableHead>
            <TableHead>Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEmployees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.employeeId}</TableCell>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.designation}</TableCell>
              <TableCell>
                <div>
                  <div>{employee.email}</div>
                  <div className="text-sm text-muted-foreground">{employee.phone}</div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default EmployeeList;

