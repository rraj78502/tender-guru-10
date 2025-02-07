
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

const FileUpload = ({ onFileChange }: FileUploadProps) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
      toast({
        title: "File selected",
        description: `File "${e.target.files[0].name}" ready for upload`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="committee-letter">Committee Formation Letter</Label>
      <div className="flex items-center gap-4">
        <Input
          id="committee-letter"
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="cursor-pointer"
        />
        <Button type="button" variant="outline" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
