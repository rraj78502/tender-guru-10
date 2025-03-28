
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import type { Complaint } from "@/types/complaint";

interface Props {
  onSubmit: (complaint: Omit<Complaint, "id" | "submittedAt" | "responses">) => void;
}

const ComplaintRegistration = ({ onSubmit }: Props) => {
  // BACKEND API: Get complaint categories
  // Endpoint: GET /api/complaints/categories
  // Request: None
  // Response: Array of category objects { id: number, name: string, description: string }
  
  /* Integration Code:
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/complaints/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching complaint categories:', error);
      // Use default categories if API fails
      setCategories([
        { id: 1, name: 'Technical', description: 'Technical issues' },
        { id: 2, name: 'Access', description: 'Access related issues' },
        { id: 3, name: 'Process', description: 'Process related issues' },
        { id: 4, name: 'Other', description: 'Other issues' }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []); */
  
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    submittedBy: "",
    agencyId: 1,
    status: "pending" as const,
    priority: "medium" as const,
    category: "Technical",
    emailNotifications: true,
    documents: [] as File[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // BACKEND API: Register complaint
    // Endpoint: POST /api/complaints
    // Request Body: Multipart form with complaint data and documents
    // {
    //   title: string,
    //   description: string,
    //   submittedBy: string,
    //   agencyId: number,
    //   priority: "low" | "medium" | "high",
    //   category: string,
    //   emailNotifications: boolean,
    //   documents: File[]
    // }
    // Response: { id: number, ...complaintData, status: "pending", submittedAt: string }
    
    /* Integration Code:
    const registerComplaint = async () => {
      const formData = new FormData();
      
      // Add all complaint data fields to formData
      formData.append('title', formData.title);
      formData.append('description', formData.description);
      formData.append('submittedBy', formData.submittedBy);
      formData.append('agencyId', formData.agencyId.toString());
      formData.append('priority', formData.priority);
      formData.append('category', formData.category);
      formData.append('emailNotifications', formData.emailNotifications.toString());
      
      // Add all documents to formData
      formData.documents.forEach((file, index) => {
        formData.append(`document-${index}`, file);
      });
      
      try {
        const response = await fetch('/api/complaints', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }
        
        const newComplaint = await response.json();
        
        toast({
          title: "Complaint Registered",
          description: "Your complaint has been submitted successfully.",
        });
        
        // Pass the new complaint to the parent component
        onSubmit({
          ...formData,
          documents: formData.documents.map((file, index) => ({
            id: index + 1,
            fileName: file.name,
            fileType: file.type,
            uploadedAt: new Date().toISOString(),
            fileSize: file.size
          }))
        });
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          submittedBy: "",
          agencyId: 1,
          status: "pending",
          priority: "medium",
          category: "Technical",
          emailNotifications: true,
          documents: []
        });
        
        return newComplaint;
      } catch (error) {
        console.error('Error registering complaint:', error);
        
        toast({
          title: "Registration Failed",
          description: error.message || "An error occurred during complaint registration.",
          variant: "destructive",
        });
        
        throw error;
      }
    }; */
    
    onSubmit({
      ...formData,
      documents: formData.documents.map((file, index) => ({
        id: index + 1,
        fileName: file.name,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
        fileSize: file.size
      }))
    });

    toast({
      title: "Success",
      description: "Complaint registered successfully"
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      submittedBy: "",
      agencyId: 1,
      status: "pending",
      priority: "medium",
      category: "Technical",
      emailNotifications: true,
      documents: []
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        documents: [...Array.from(e.target.files as FileList)]
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter complaint title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your complaint"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="submittedBy">Submitted By</Label>
          <Input
            id="submittedBy"
            value={formData.submittedBy}
            onChange={e => setFormData(prev => ({ ...prev, submittedBy: e.target.value }))}
            placeholder="Your name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={value => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Access">Access</SelectItem>
              <SelectItem value="Process">Process</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={value => setFormData(prev => ({ ...prev, priority: value as any }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="documents">Documents</Label>
          <div className="flex items-center gap-2">
            <Input
              id="documents"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("documents")?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
            <span className="text-sm text-gray-500">
              {formData.documents.length} file(s) selected
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="notifications"
          checked={formData.emailNotifications}
          onCheckedChange={checked => setFormData(prev => ({ ...prev, emailNotifications: checked }))}
        />
        <Label htmlFor="notifications">Receive email notifications</Label>
      </div>

      <Button type="submit">Submit Complaint</Button>
    </form>
  );
};

export default ComplaintRegistration;
