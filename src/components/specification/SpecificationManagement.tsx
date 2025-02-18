
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import SpecificationSubmission from "./SpecificationSubmission";
import ReviewScheduler from "./ReviewScheduler";
import ReviewMinutes from "./ReviewMinutes";
import DocumentApproval from "./DocumentApproval";
import VersionHistory from "./VersionHistory";
import type { SpecificationDocument, ReviewSession, DocumentVersion } from "@/types/specification";
import { 
  mockSpecifications, 
  mockReviews, 
  getSpecificationById, 
  getReviewBySpecificationId,
  getVersionHistory,
} from "@/mock/specificationData";

const SpecificationManagement = () => {
  const [activeTab, setActiveTab] = useState("submission");
  const [currentSpecification, setCurrentSpecification] = useState<SpecificationDocument | null>(null);
  const [currentReview, setCurrentReview] = useState<ReviewSession | null>(null);
  const { toast } = useToast();

  // Load initial mock data
  useEffect(() => {
    const initialSpec = mockSpecifications[0];
    if (initialSpec) {
      setCurrentSpecification(initialSpec);
      const associatedReview = getReviewBySpecificationId(initialSpec.id);
      if (associatedReview) {
        setCurrentReview(associatedReview);
      }
    }
  }, []);

  const handleSpecificationUpdate = (spec: SpecificationDocument) => {
    setCurrentSpecification(spec);
    console.log("Specification updated:", spec);
    toast({
      title: "Specification Updated",
      description: "The specification has been successfully updated.",
    });
  };

  const handleVersionCompare = (v1: DocumentVersion, v2: DocumentVersion) => {
    console.log("Comparing versions:", v1, v2);
    toast({
      title: "Version Comparison",
      description: `Comparing version ${v1.version} with version ${v2.version}`,
    });
  };

  const handleViewVersion = (version: DocumentVersion) => {
    console.log("Viewing version:", version);
    toast({
      title: "Version View",
      description: `Viewing version ${version.version}`,
    });
  };

  const handleReviewUpdate = (review: ReviewSession) => {
    setCurrentReview(review);
    console.log("Review updated:", review);
    toast({
      title: "Review Updated",
      description: "The review session has been successfully updated.",
    });
  };

  return (
    <Card className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm shadow-lg p-6 rounded-xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 gap-4 p-1 bg-muted/20 rounded-lg">
          <TabsTrigger value="submission" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Specification Submission
          </TabsTrigger>
          <TabsTrigger value="versions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Version History
          </TabsTrigger>
          <TabsTrigger value="review" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Review Scheduling
          </TabsTrigger>
          <TabsTrigger value="minutes" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Review Minutes
          </TabsTrigger>
          <TabsTrigger value="approval" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Document Approval
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 bg-white rounded-lg shadow-sm p-6 animate-fadeIn">
          <TabsContent value="submission">
            <SpecificationSubmission
              specification={currentSpecification}
              onSpecificationUpdate={handleSpecificationUpdate}
            />
          </TabsContent>

          <TabsContent value="versions">
            {currentSpecification?.versionHistory ? (
              <VersionHistory
                versions={currentSpecification.versionHistory}
                onCompareVersions={handleVersionCompare}
                onViewVersion={handleViewVersion}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No version history available
              </div>
            )}
          </TabsContent>

          <TabsContent value="review">
            <ReviewScheduler
              specification={currentSpecification}
              review={currentReview}
              onReviewUpdate={handleReviewUpdate}
            />
          </TabsContent>

          <TabsContent value="minutes">
            <ReviewMinutes
              review={currentReview}
              onReviewUpdate={handleReviewUpdate}
            />
          </TabsContent>

          <TabsContent value="approval">
            <DocumentApproval
              specification={currentSpecification}
              review={currentReview}
              onSpecificationUpdate={handleSpecificationUpdate}
            />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default SpecificationManagement;
