
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "@/components/ui/dialog";
import type { Employee } from "@/types/employee";
import { useMockDb } from "@/hooks/useMockDb";
import SearchBar from "./SearchBar";
import EmployeeList from "./EmployeeList";
import EmployeeForm from "./EmployeeForm";
import { mockEmployees } from "@/mock/employeeData";
import * as XLSX from 'xlsx';

const EmployeeManagement = () => {
  const { toast } = useToast();
  const { data: employees, create: createEmployee } = useMockDb<Employee>('employees');
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    dateJoined: "",
    isActive: true
  });

  const filteredEmployees = employees.length ? employees : mockEmployees;
  const displayedEmployees = filteredEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setNewEmployee({
      employeeId: "",
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      dateJoined: "",
      isActive: true
    });
  };

  const handleInputChange = (name: keyof Omit<Employee, 'id'>, value: string) => {
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmployee.employeeId || !newEmployee.name || !newEmployee.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    createEmployee(newEmployee);
    
    toast({
      title: "Success",
      description: "Employee added successfully"
    });
    
    handleCloseModal();
  };

  const handleAddClick = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleCloseModal = () => {
    setShowAddForm(false);
    resetForm();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCloseModal();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      let successCount = 0;
      let errorCount = 0;

      for (const row of jsonData) {
        try {
          const employee: Omit<Employee, 'id'> = {
            employeeId: String(row.employeeId || ''),
            name: String(row.name || ''),
            email: String(row.email || ''),
            phone: String(row.phone || ''),
            department: String(row.department || ''),
            designation: String(row.designation || ''),
            dateJoined: String(row.dateJoined || new Date().toISOString().split('T')[0]),
            isActive: true
          };

          if (!employee.employeeId || !employee.name || !employee.email) {
            errorCount++;
            continue;
          }

          createEmployee(employee);
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }

      toast({
        title: "Bulk Import Complete",
        description: `Successfully imported ${successCount} employees. ${errorCount} entries had errors.`
      });
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to process the Excel file. Please check the format.",
        variant: "destructive"
      });
    }

    // Reset the input
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
            />
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import Excel
            </Button>
          </label>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <EmployeeList employees={displayedEmployees} />
      </div>

      {showAddForm && (
        <Dialog open={showAddForm} onOpenChange={handleOpenChange}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <EmployeeForm
              employee={newEmployee}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              onCancel={handleCloseModal}
            />
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default EmployeeManagement;
