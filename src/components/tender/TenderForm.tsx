
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TenderFormProps {
  onClose: () => void;
}

const TenderForm = ({ onClose }: TenderFormProps) => {
  const { toast } = useToast();
  const [tenderData, setTenderData] = useState({
    title: "",
    description: "",
    publishDate: "",
    openingDate: "",
    bidValidity: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tender form submitted:", tenderData);
    
    toast({
      title: "Tender Created",
      description: "Tender has been created successfully.",
    });
    
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTenderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card p-6 slide-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Tender</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Tender Title</Label>
            <Input
              id="title"
              name="title"
              value={tenderData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={tenderData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="publishDate">Publish Date</Label>
              <Input
                id="publishDate"
                name="publishDate"
                type="date"
                value={tenderData.publishDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="openingDate">Opening Date</Label>
              <Input
                id="openingDate"
                name="openingDate"
                type="date"
                value={tenderData.openingDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bidValidity">Bid Validity (in days)</Label>
            <Input
              id="bidValidity"
              name="bidValidity"
              type="number"
              value={tenderData.bidValidity}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Tender
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TenderForm;
