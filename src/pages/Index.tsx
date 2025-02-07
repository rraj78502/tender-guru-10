
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CommitteeForm from "@/components/CommitteeForm";
import CommitteeList from "@/components/CommitteeList";
import ReviewModule from "@/components/ReviewModule";
import TenderForm from "@/components/tender/TenderForm";

const Index = () => {
  const [showCommitteeForm, setShowCommitteeForm] = useState(false);
  const [showTenderForm, setShowTenderForm] = useState(false);

  // Mock review data
  const reviewData = {
    committeeId: 1,
    title: "Network Equipment Specification Review",
    submissionDate: "2024-04-01",
    status: "pending_review"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 slide-in">
          <div className="inline-block px-3 py-1 mb-4 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
            Tender Management System
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to TenderFlow
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Streamline your tender process with our comprehensive management system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 glass-card fade-in hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Committee Formation</h3>
            <p className="text-gray-600 mb-4">
              Create and manage specification committees
            </p>
            <Button 
              onClick={() => setShowCommitteeForm(true)}
              className="w-full"
            >
              Create Committee
            </Button>
          </Card>

          <Card className="p-6 glass-card fade-in hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Active Tenders</h3>
            <p className="text-gray-600 mb-4">
              View and manage ongoing tender processes
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowTenderForm(true)}
            >
              Create Tender
            </Button>
          </Card>

          <Card className="p-6 glass-card fade-in hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Specifications</h3>
            <p className="text-gray-600 mb-4">
              Review and approve tender specifications
            </p>
            <Button variant="outline" className="w-full">
              View Specifications
            </Button>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Pending Reviews</h2>
            <ReviewModule {...reviewData} />
          </div>
          <div>
            <CommitteeList />
          </div>
        </div>

        {showCommitteeForm && (
          <CommitteeForm onClose={() => setShowCommitteeForm(false)} />
        )}

        {showTenderForm && (
          <TenderForm onClose={() => setShowTenderForm(false)} />
        )}
      </div>
    </div>
  );
};

export default Index;
