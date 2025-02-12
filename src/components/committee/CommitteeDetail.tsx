
import { useParams, useNavigate } from "react-router-dom";
import { useMockDb } from "@/hooks/useMockDb";
import { Committee } from "@/types/committee";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, Users, FileText, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const CommitteeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: committees } = useMockDb<Committee>("committees");
  
  const committee = committees.find(c => c.id === Number(id));

  if (!committee) {
    toast({
      title: "Committee not found",
      description: "The requested committee could not be found.",
      variant: "destructive",
    });
    navigate("/");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{committee.name}</h1>
            <p className="text-gray-600 mt-2">{committee.purpose}</p>
          </div>
          <Badge variant={committee.approvalStatus === "approved" ? "default" : "secondary"}>
            {committee.approvalStatus}
          </Badge>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              Formation Date: {new Date(committee.formationDate).toLocaleDateString()}
            </div>

            <Separator />

            <div>
              <div className="flex items-center mb-4">
                <Users className="h-5 w-5 mr-2" />
                <h2 className="text-lg font-semibold">Committee Members</h2>
              </div>
              <div className="grid gap-4">
                {committee.members.map((member) => (
                  <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{member.department}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 mr-2" />
                <h2 className="text-lg font-semibold">Tasks</h2>
              </div>
              <div className="grid gap-4">
                {committee.tasks.map((task) => (
                  <div key={task.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={task.status === "completed" ? "default" : "secondary"}>
                        {task.status}
                      </Badge>
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {committee.reviews.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center mb-4">
                    <FileText className="h-5 w-5 mr-2" />
                    <h2 className="text-lg font-semibold">Reviews</h2>
                  </div>
                  <div className="grid gap-4">
                    {committee.reviews.map((review) => (
                      <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <Badge>{review.status}</Badge>
                          <span className="text-sm text-gray-600">
                            {new Date(review.scheduledDate).toLocaleDateString()}
                          </span>
                        </div>
                        {review.minutes && (
                          <p className="text-sm text-gray-600 mt-2">{review.minutes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommitteeDetail;
