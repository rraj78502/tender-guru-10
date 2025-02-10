
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SpecificationSubmission from "./SpecificationSubmission";
import ReviewScheduler from "./ReviewScheduler";
import ReviewMinutes from "./ReviewMinutes";
import DocumentApproval from "./DocumentApproval";
import type { SpecificationDocument, ReviewSession } from "@/types/specification";

const SpecificationManagement = () => {
  const [activeTab, setActiveTab] = useState("submission");
  const [currentSpecification, setCurrentSpecification] = useState<SpecificationDocument | null>(null);
  const [currentReview, setCurrentReview] = useState<ReviewSession | null>(null);

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4">
          <TabsTrigger value="submission">Specification Submission</TabsTrigger>
          <TabsTrigger value="review">Review Scheduling</TabsTrigger>
          <TabsTrigger value="minutes">Review Minutes</TabsTrigger>
          <TabsTrigger value="approval">Document Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="submission">
          <SpecificationSubmission
            specification={currentSpecification}
            onSpecificationUpdate={setCurrentSpecification}
          />
        </TabsContent>

        <TabsContent value="review">
          <ReviewScheduler
            specification={currentSpecification}
            review={currentReview}
            onReviewUpdate={setCurrentReview}
          />
        </TabsContent>

        <TabsContent value="minutes">
          <ReviewMinutes
            review={currentReview}
            onReviewUpdate={setCurrentReview}
          />
        </TabsContent>

        <TabsContent value="approval">
          <DocumentApproval
            specification={currentSpecification}
            review={currentReview}
            onSpecificationUpdate={setCurrentSpecification}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SpecificationManagement;
