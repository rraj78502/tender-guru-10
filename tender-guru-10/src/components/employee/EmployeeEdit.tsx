import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const EmployeeEdit = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { employees, user, updateUser, updateMe, hasPermission } = useAuth();
  const { toast } = useToast();

  const employee = employees.find(emp => emp._id === userId);

  const isOwnProfile = userId === user?._id;
  const isAdmin = hasPermission('manage_users');

  const [formData, setFormData] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
    role: employee?.role || "",
    department: employee?.department || "",
    phoneNumber: employee?.phoneNumber || "",
    designation: employee?.designation || "",
    isActive: employee?.isActive ?? true,
    otpEnabled: employee?.otpEnabled ?? false,
    otpMethod: employee?.otpMethod || "sms",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin && !isOwnProfile) {
      toast({
        title: "Access Denied",
        description: "You can only edit your own profile.",
        variant: "destructive",
      });
      navigate("/");
    }

    if (!employee && userId) {
      toast({
        title: "Employee Not Found",
        description: "The requested employee could not be found.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [employee, userId, isAdmin, isOwnProfile, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    let success;
    if (isOwnProfile && !isAdmin) {
      // Non-admin updating their own profile
      const { name, email, department, phoneNumber, designation } = formData;
      const updateData = { name, email, department, phoneNumber, designation };
      success = await updateMe(updateData);
    } else {
      // Admin updating any profile
      success = await updateUser(userId, formData);
    }
    setLoading(false);

    if (success) {
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
      navigate("/");
    } else {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  if (!employee) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Edit Employee</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {isAdmin && (
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={handleSelectChange('role')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="procurement_officer">Procurement Officer</SelectItem>
                  <SelectItem value="committee_member">Committee Member</SelectItem>
                  <SelectItem value="evaluator">Evaluator</SelectItem>
                  <SelectItem value="bidder">Bidder</SelectItem>
                  <SelectItem value="complaint_manager">Complaint Manager</SelectItem>
                  <SelectItem value="project_manager">Project Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </div>
          {isAdmin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="otpMethod">OTP Method</Label>
                <Select value={formData.otpMethod} onValueChange={handleSelectChange('otpMethod')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select OTP method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="otpEnabled"
                  checked={formData.otpEnabled}
                  onCheckedChange={handleSwitchChange('otpEnabled')}
                />
                <Label htmlFor="otpEnabled">OTP Enabled</Label>
              </div>
            </>
          )}
          {isAdmin && (
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange('isActive')}
              />
              <Label htmlFor="isActive">Active Status</Label>
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeEdit;