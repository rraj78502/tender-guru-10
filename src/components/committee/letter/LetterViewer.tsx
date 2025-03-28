
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CommitteeFormationLetter } from "@/types/letter";

interface LetterViewerProps {
  letter: CommitteeFormationLetter;
  onClose: () => void;
}

const LetterViewer = ({ letter, onClose }: LetterViewerProps) => {
  // BACKEND API: Get letter content and metadata
  // Endpoint: GET /api/committees/letters/:letterId/content
  // Request: { letterId: number }
  // Response: { fileContent: string, contentType: string, metadata: object }
  
  /* Integration Code:
  const fetchLetterContent = async (letterId: number) => {
    try {
      const response = await fetch(`/api/committees/letters/${letterId}/content`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch letter content');
      
      const data = await response.json();
      setLetterContent(data.fileContent);
      setLetterMetadata(data.metadata);
      return data;
    } catch (error) {
      console.error('Error fetching letter content:', error);
      throw error;
    }
  };
  
  // Call this function when component mounts or when letter changes
  useEffect(() => {
    if (letter?.id) {
      fetchLetterContent(letter.id);
    }
  }, [letter]); */
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Letter Preview - {letter.referenceNumber}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Reference Number</p>
                <p>{letter.referenceNumber}</p>
              </div>
              <div>
                <p className="font-semibold">Issue Date</p>
                <p>{new Date(letter.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold">Department</p>
                <p>{letter.department}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <p className="capitalize">{letter.status}</p>
              </div>
            </div>
            
            <div>
              <p className="font-semibold">Purpose</p>
              <p>{letter.purpose}</p>
            </div>

            <div>
              <p className="font-semibold">Distributions</p>
              {/* BACKEND API: Get letter distribution history
              // Endpoint: GET /api/committees/letters/:letterId/distributions
              // Request: { letterId: number }
              // Response: Array of distribution records with recipient details and timestamps
              
              // Integration Code:
              const fetchDistributions = async (letterId: number) => {
                try {
                  const response = await fetch(`/api/committees/letters/${letterId}/distributions`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                  
                  if (!response.ok) throw new Error('Failed to fetch distributions');
                  
                  const distributions = await response.json();
                  setDistributions(distributions);
                  return distributions;
                } catch (error) {
                  console.error('Error fetching distributions:', error);
                  return [];
                }
              };
              
              // Call this function when component mounts or when letter changes
              useEffect(() => {
                if (letter?.id) {
                  fetchDistributions(letter.id);
                }
              }, [letter]); */}
              {letter.distributions.length > 0 ? (
                <ul className="list-disc pl-5">
                  {letter.distributions.map((dist, index) => (
                    <li key={index}>
                      Member ID: {dist.memberId} - Sent: {new Date(dist.sentDate).toLocaleDateString()}
                      {dist.acknowledgmentDate && 
                        ` - Acknowledged: ${new Date(dist.acknowledgmentDate).toLocaleDateString()}`
                      }
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No distributions yet</p>
              )}
            </div>

            <div className="border rounded-lg p-4">
              <p className="font-semibold mb-2">Document Preview</p>
              <iframe
                src={letter.fileUrl}
                className="w-full h-[400px] border rounded"
                title={`Preview of ${letter.fileName}`}
              />
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LetterViewer;
