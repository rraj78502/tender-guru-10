
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import type { FinancialEvaluation as FinancialEvaluationType } from "@/types/evaluation";

interface Props {
  teamId: number;
  evaluations: FinancialEvaluationType[];
}

const FinancialEvaluation = ({ teamId, evaluations }: Props) => {
  const { toast } = useToast();
  const [selectedEvaluation, setSelectedEvaluation] = useState<FinancialEvaluationType | null>(null);

  const handleApprove = (evaluation: FinancialEvaluationType) => {
    toast({
      title: "Evaluation Approved",
      description: `Financial evaluation for Vendor ${evaluation.vendorId} has been approved`,
    });
  };

  const handleReject = (evaluation: FinancialEvaluationType) => {
    toast({
      title: "Evaluation Rejected",
      description: `Financial evaluation for Vendor ${evaluation.vendorId} has been rejected`,
    });
  };

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Financial Evaluation</h3>
          <Button variant="outline">Export Results</Button>
        </div>

        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor ID</TableHead>
                <TableHead>Bid Amount</TableHead>
                <TableHead>Technical Score</TableHead>
                <TableHead>Financial Score</TableHead>
                <TableHead>Total Score</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell>{evaluation.vendorId}</TableCell>
                  <TableCell>${evaluation.bidAmount.toLocaleString()}</TableCell>
                  <TableCell>{evaluation.technicalScore}</TableCell>
                  <TableCell>{evaluation.financialScore}</TableCell>
                  <TableCell>{evaluation.totalScore}</TableCell>
                  <TableCell>{evaluation.rank}</TableCell>
                  <TableCell>
                    <Badge variant={evaluation.status === "evaluated" ? "secondary" : "outline"}>
                      {evaluation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(evaluation)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleReject(evaluation)}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default FinancialEvaluation;
