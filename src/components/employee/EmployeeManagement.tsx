
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "@/components/ui/dialog";
import type { Employee } from "@/types/employee";
import { useMockDb } from "@/hooks/useMockDb";
import SearchBar from "./SearchBar";
import EmployeeList from "./EmployeeList";
import EmployeeForm from "./EmployeeForm";
import { mockEmployees } from "@/mock/employeeData";

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
    
    // Reset form and close modal
    setShowAddForm(false);
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

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCloseModal = () => {
    setShowAddForm(false);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <EmployeeList employees={displayedEmployees} />
      </div>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <EmployeeForm
            employee={newEmployee}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;
