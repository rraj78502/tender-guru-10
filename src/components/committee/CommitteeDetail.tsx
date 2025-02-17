
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMockDb } from "@/hooks/useMockDb";
import { Committee } from "@/types/committee";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  ArrowLeft, 
  Users, 
  FileText, 
  Clock, 
  Home,
  FileCheck,
  MessageSquare,
  AlertCircle,
  ChevronRight 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const CommitteeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: committees } = useMockDb<Committee>("committees");
  
  console.log("Looking for committee with ID:", id);
  console.log("Available committees:", committees);
  
  const committee = committees?.find(c => c.id === Number(id));
  
  console.log("Found committee:", committee);

  if (committees.length > 0 && !committee) {
    toast({
      title: "Committee not found",
      description: "The requested committee could not be found.",
      variant: "destructive",
    });
    navigate("/");
    return null;
  }

  if (!committee) {
    return null;
  }

  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    pending_review: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  };

  const taskStatusColors = {
    pending: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800"
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{committee.name}</h1>
            <p className="text-gray-600 mt-2">{committee.purpose}</p>
          </div>
          <Badge className={statusColors[committee.approvalStatus]}>
            {committee.approvalStatus.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            {/* Formation Details */}
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Calendar className="h-5 w-5" />
                <span>Formation Date: {format(new Date(committee.formationDate), 'PPP')}</span>
              </div>
            </div>

            <Separator />

            {/* Committee Members */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold">Committee Members</h2>
              </div>
              <div className="grid gap-4">
                {committee.members.map((member) => (
                  <div key={member.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{member.role}</p>
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

            {/* Tasks Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold">Tasks</h2>
              </div>
              <div className="grid gap-4">
                {committee.tasks.map((task) => (
                  <div key={task.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                      <Badge className={taskStatusColors[task.status]}>
                        {task.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Due: {format(new Date(task.dueDate), 'PPP')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Specifications Status */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileCheck className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold">Specifications</h2>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Submission Date</p>
                    <p className="font-medium">{format(new Date(committee.specifications.submissionDate), 'PPP')}</p>
                  </div>
                  <Badge className={statusColors[committee.specifications.status]}>
                    {committee.specifications.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            {committee.reviews.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <h2 className="text-lg font-semibold">Reviews</h2>
                  </div>
                  <div className="grid gap-4">
                    {committee.reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">Scheduled: {format(new Date(review.scheduledDate), 'PPP')}</p>
                            {review.actualDate && (
                              <p className="text-sm text-gray-600">
                                Conducted: {format(new Date(review.actualDate), 'PPP')}
                              </p>
                            )}
                          </div>
                          <Badge className={statusColors[review.status]}>
                            {review.status.replace('_', ' ').toUpperCase()}
                          </Badge>
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

            {/* Important Alerts */}
            {committee.approvalStatus === 'pending' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-orange-700">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <h4 className="font-medium">Pending Approval</h4>
                    <p className="text-sm">Committee formation is awaiting approval</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommitteeDetail;

