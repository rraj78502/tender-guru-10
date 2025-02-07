
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, CalendarClock, CheckCircle, AlertCircle } from "lucide-react";

// Mock data for committees
const mockCommittees = [
  {
    id: 1,
    title: "Network Equipment Specification Committee",
    formationDate: "2024-03-15",
    specificationDate: "2024-04-01",
    reviewDate: "2024-04-15",
    status: "pending_review",
    members: [
      { name: "John Doe", role: "chairperson" },
      { name: "Jane Smith", role: "member" },
      { name: "Mike Johnson", role: "member" },
    ],
  },
  {
    id: 2,
    title: "Software Development Committee",
    formationDate: "2024-03-10",
    specificationDate: "2024-03-25",
    reviewDate: "2024-04-05",
    status: "specification_submitted",
    members: [
      { name: "Alice Brown", role: "chairperson" },
      { name: "Bob Wilson", role: "member" },
    ],
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending_review":
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Pending Review
        </Badge>
      );
    case "specification_submitted":
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-green-500 hover:bg-green-600">
          <CheckCircle className="h-3 w-3" />
          Specification Submitted
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <CalendarClock className="h-3 w-3" />
          In Progress
        </Badge>
      );
  }
};

const CommitteeList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Active Committees</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mockCommittees.map((committee) => (
          <Card key={committee.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{committee.title}</h3>
                  {getStatusBadge(committee.status)}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CalendarClock className="h-4 w-4" />
                    <span>Formed: {new Date(committee.formationDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>Specification Due: {new Date(committee.specificationDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{committee.members.length} Members</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Committee Members:</p>
                  <div className="flex flex-wrap gap-2">
                    {committee.members.map((member, index) => (
                      <Badge
                        key={index}
                        variant={member.role === "chairperson" ? "default" : "outline"}
                        className="capitalize"
                      >
                        {member.name} ({member.role})
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[120px]">
                <Badge
                  variant="outline"
                  className="text-center"
                >
                  Review Date:
                  <br />
                  {new Date(committee.reviewDate).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommitteeList;
