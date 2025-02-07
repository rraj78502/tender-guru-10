
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TechnicalCriteria, TechnicalScore } from "@/types/evaluation";

interface Props {
  teamId: number;
  criteria: TechnicalCriteria[];
}

const TechnicalEvaluation = ({ teamId, criteria }: Props) => {
  const { toast } = useToast();
  const [scores, setScores] = useState<TechnicalScore[]>([]);

  const handleScoreSubmit = (criteriaId: number, score: number, comments: string) => {
    const newScore: TechnicalScore = {
      id: Date.now(),
      criteriaId,
      evaluatorId: 1, // Would come from auth context
      vendorId: 1, // Would be passed as prop
      score,
      comments,
      timestamp: new Date().toISOString(),
    };

    setScores((prev) => [...prev, newScore]);
    toast({
      title: "Score Submitted",
      description: "Technical evaluation score has been recorded",
    });
  };

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Technical Evaluation</h3>
          <Button variant="outline">Export Scores</Button>
        </div>

        {criteria.map((criterion) => (
          <Card key={criterion.id} className="p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{criterion.name}</h4>
                <p className="text-sm text-gray-500">{criterion.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Score (Max: {criterion.maxScore})</Label>
                  <Input 
                    type="number" 
                    max={criterion.maxScore}
                    onChange={(e) => {
                      const score = Math.min(Number(e.target.value), criterion.maxScore);
                      handleScoreSubmit(criterion.id, score, "");
                    }}
                  />
                </div>
                <div>
                  <Label>Weight</Label>
                  <Input 
                    type="text" 
                    value={`${criterion.weight * 100}%`} 
                    disabled 
                  />
                </div>
              </div>

              <div>
                <Label>Comments</Label>
                <Textarea 
                  placeholder="Add evaluation comments..."
                  onChange={(e) => {
                    const existingScore = scores.find(s => s.criteriaId === criterion.id);
                    if (existingScore) {
                      handleScoreSubmit(criterion.id, existingScore.score, e.target.value);
                    }
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TechnicalEvaluation;
