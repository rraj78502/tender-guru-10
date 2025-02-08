
import React from "react";
import TenderList from "@/components/tender/TenderList";
import ReviewModule from "@/components/ReviewModule";
import CommitteeList from "@/components/CommitteeList";
import DashboardStats from "@/components/dashboard/DashboardStats";

const DashboardContent = () => {
  const reviewData = {
    committeeId: 1,
    title: "Network Equipment Specification Review",
    submissionDate: "2024-04-01",
    status: "pending_review"
  };

  return (
    <>
      <div className="mb-8">
        <DashboardStats />
      </div>

      <div className="mb-12">
        <TenderList />
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
    </>
  );
};

export default DashboardContent;
