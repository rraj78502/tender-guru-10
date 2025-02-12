
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, CalendarClock, CheckCircle, AlertCircle } from "lucide-react";
import { useMockDb } from "@/hooks/useMockDb";
import type { Committee } from "@/types/committee";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending_review":
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Pending Review
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-green-500 hover:bg-green-600">
          <CheckCircle className="h-3 w-3" />
          Approved
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <CalendarClock className="h-3 w-3" />
          Draft
        </Badge>
      );
  }
};

const CommitteeList = () => {
  const { data: committees = [] } = useMockDb<Committee>('committees');
  
  console.log('Rendering CommitteeList with committees:', committees);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Active Committees</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {committees.map((committee) => {
          console.log('Rendering committee:', committee);
          return (
            <Card key={committee.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{committee.name}</h3>
                    {getStatusBadge(committee.approvalStatus)}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <CalendarClock className="h-4 w-4" />
                      <span>Formed: {new Date(committee.formationDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>Specification Due: {new Date(committee.specifications.submissionDate).toLocaleDateString()}</span>
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
                          {member.name || 'Unnamed Member'} ({member.role})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[120px]">
                  <Badge variant="outline" className="text-center">
                    Tasks: {committee.tasks.length}
                  </Badge>
                </div>
              </div>
            </Card>
          );
        })}

        {committees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No committees have been formed yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitteeList;
