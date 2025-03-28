
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Eye, Send } from "lucide-react";
import { mockLetters } from "@/mock/letterData";
import type { CommitteeFormationLetter } from "@/types/letter";
import LetterUpload from "./LetterUpload";
import LetterViewer from "./LetterViewer";

const LetterManagement = () => {
  // BACKEND API: Get committee formation letters
  // Endpoint: GET /api/committees/letters
  // Request: Optional filters like { committeeId?: number, status?: string }
  // Response: Array of CommitteeFormationLetter objects
  
  /* Integration Code:
  const [letters, setLetters] = useState<CommitteeFormationLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchLetters = async (filters?: { committeeId?: number; status?: string }) => {
    try {
      setLoading(true);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters?.committeeId) queryParams.append('committeeId', filters.committeeId.toString());
      if (filters?.status) queryParams.append('status', filters.status);
      
      const queryString = queryParams.toString();
      const url = `/api/committees/letters${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch letters');
      
      const data = await response.json();
      setLetters(data);
      setError('');
    } catch (error) {
      console.error('Error fetching letters:', error);
      setError('Failed to load letters. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLetters();
  }, []); */

  const [letters, setLetters] = useState<CommitteeFormationLetter[]>(mockLetters);
  const [selectedLetter, setSelectedLetter] = useState<CommitteeFormationLetter | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const { toast } = useToast();

  const handleDistribute = (letter: CommitteeFormationLetter) => {
    // BACKEND API: Distribute letter to committee members
    // Endpoint: POST /api/committees/letters/:letterId/distribute
    // Request: { recipientIds: number[], distributionMethod: "email" | "system" | "both" }
    // Response: { success: boolean, distributions: Array of distribution objects }

    /* Integration Code:
    const distributeLetterToMembers = async (letter: CommitteeFormationLetter, recipientIds: number[], distributionMethod: "email" | "system" | "both") => {
      try {
        const response = await fetch(`/api/committees/letters/${letter.id}/distribute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipientIds,
            distributionMethod
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Distribution failed');
        }
        
        const result = await response.json();
        
        toast({
          title: "Distribution Successful",
          description: `Letter has been distributed to ${result.distributions.length} recipients.`,
        });
        
        // Update letter with new distribution info
        const updatedLetters = letters.map(l => 
          l.id === letter.id 
            ? { ...l, distributions: [...l.distributions, ...result.distributions] } 
            : l
        );
        setLetters(updatedLetters);
        
        return result;
      } catch (error) {
        console.error('Error distributing letter:', error);
        
        toast({
          title: "Distribution Failed",
          description: error.message || "An error occurred during letter distribution.",
          variant: "destructive",
        });
        
        throw error;
      }
    }; */
    
    toast({
      title: "Letter Distribution",
      description: `Distribution initiated for letter ${letter.referenceNumber}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Committee Formation Letters</h2>
        <LetterUpload onUpload={(letter) => setLetters([...letters, letter])} />
      </div>

      <div className="grid gap-4">
        {letters.map((letter) => (
          <Card key={letter.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{letter.referenceNumber}</h3>
                <p className="text-sm text-gray-500">{letter.purpose}</p>
                <p className="text-xs text-gray-400">
                  Issued: {new Date(letter.issueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // BACKEND API: Get letter details
                    // Endpoint: GET /api/committees/letters/:letterId
                    // Request: { letterId: number }
                    // Response: CommitteeFormationLetter object with full details
                    
                    /* Integration Code:
                    const fetchLetterDetails = async (letterId: number) => {
                      try {
                        const response = await fetch(`/api/committees/letters/${letterId}`, {
                          method: 'GET',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        });
                        
                        if (!response.ok) throw new Error('Failed to fetch letter details');
                        
                        const letterDetails = await response.json();
                        setSelectedLetter(letterDetails);
                        setShowViewer(true);
                      } catch (error) {
                        console.error('Error fetching letter details:', error);
                        
                        toast({
                          title: "Error",
                          description: "Could not load letter details",
                          variant: "destructive",
                        });
                      }
                    };
                    
                    fetchLetterDetails(letter.id); */
                    
                    setSelectedLetter(letter);
                    setShowViewer(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDistribute(letter)}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Distribute
                </Button>
                <Button variant="outline" size="sm">
                  {/* BACKEND API: Download letter file
                  // Endpoint: GET /api/committees/letters/:letterId/download
                  // Request: { letterId: number }
                  // Response: Binary file data with appropriate content-type
                  
                  // Integration Code:
                  const downloadLetter = async (letterId: number) => {
                    try {
                      // Using window.open for simple file download
                      window.open(`/api/committees/letters/${letterId}/download`, '_blank');
                      
                      // Alternative approach for more control:
                      // const response = await fetch(`/api/committees/letters/${letterId}/download`);
                      // if (!response.ok) throw new Error('Download failed');
                      // 
                      // const blob = await response.blob();
                      // const url = window.URL.createObjectURL(blob);
                      // const a = document.createElement('a');
                      // a.href = url;
                      // a.download = `letter-${letterId}.pdf`;
                      // document.body.appendChild(a);
                      // a.click();
                      // window.URL.revokeObjectURL(url);
                      // document.body.removeChild(a);
                    } catch (error) {
                      console.error('Error downloading letter:', error);
                      
                      toast({
                        title: "Download Failed",
                        description: "Could not download the letter file.",
                        variant: "destructive",
                      });
                    }
                  }; */}
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showViewer && selectedLetter && (
        <LetterViewer
          letter={selectedLetter}
          onClose={() => {
            setShowViewer(false);
            setSelectedLetter(null);
          }}
        />
      )}
    </div>
  );
};

export default LetterManagement;
