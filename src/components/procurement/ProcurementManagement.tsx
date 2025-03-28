
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { BidSecurity, DocumentFee, PreBidMeeting, Clarification } from "@/types/procurement";
import BidSecurityTab from "./tabs/BidSecurityTab";
import DocumentFeesTab from "./tabs/DocumentFeesTab";
import PreBidMeetingsTab from "./tabs/PreBidMeetingsTab";
import ClarificationsTab from "./tabs/ClarificationsTab";
import { useMockDb } from "@/hooks/useMockDb";

const ProcurementManagement = ({ tenderId }: { tenderId: number }) => {
  // BACKEND API: Get procurement management data
  // Endpoint: GET /api/tenders/:tenderId/procurement
  // Request: { tenderId: number }
  // Response: { 
  //   bidSecurities: BidSecurity[],
  //   documentFees: DocumentFee[],
  //   preBidMeetings: PreBidMeeting[],
  //   clarifications: Clarification[]
  // }
  
  /* Integration Code:
  const [procurementData, setProcurementData] = useState({
    bidSecurities: [] as BidSecurity[],
    documentFees: [] as DocumentFee[],
    preBidMeetings: [] as PreBidMeeting[],
    clarifications: [] as Clarification[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchProcurementData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tenders/${tenderId}/procurement`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch procurement data');
      
      const data = await response.json();
      setProcurementData(data);
      setError('');
    } catch (error) {
      console.error('Error fetching procurement data:', error);
      setError('Failed to load procurement data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProcurementData();
  }, [tenderId]); */
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bid-security");
  
  const { data: bidSecurities, update: updateBidSecurity } = useMockDb<BidSecurity>('bidSecurities');
  const { data: documentFees, update: updateDocumentFee } = useMockDb<DocumentFee>('documentFees');
  const { data: preBidMeetings, update: updatePreBidMeeting } = useMockDb<PreBidMeeting>('preBidMeetings');
  const { data: clarifications, update: updateClarification } = useMockDb<Clarification>('clarifications');

  useEffect(() => {
    console.log("Loading procurement data for tender:", tenderId);
  }, [tenderId]);

  const handleUpdate = (type: string, data: any) => {
    // BACKEND API: Update procurement item
    // Endpoint: PUT /api/tenders/:tenderId/procurement/:type/:itemId
    // Example: PUT /api/tenders/123/procurement/bid-security/456
    // Request Body: Updated item data
    // Response: { success: boolean, data: updated item }
    
    /* Integration Code:
    const updateProcurementItem = async (type: string, itemId: number, itemData: any) => {
      try {
        const response = await fetch(`/api/tenders/${tenderId}/procurement/${type}/${itemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Update failed');
        }
        
        const result = await response.json();
        
        if (result.success) {
          // Update local state based on item type
          switch (type) {
            case 'bid-security':
              updateBidSecurity(itemId, result.data);
              break;
            case 'document-fees':
              updateDocumentFee(itemId, result.data);
              break;
            case 'pre-bid':
              updatePreBidMeeting(itemId, result.data);
              break;
            case 'clarifications':
              updateClarification(itemId, result.data);
              break;
          }
          
          toast({
            title: "Updated Successfully",
            description: `${type.replace('-', ' ')} has been updated.`,
          });
        }
        
        return result;
      } catch (error) {
        console.error('Error updating procurement item:', error);
        
        toast({
          title: "Update Failed",
          description: error.message || "An error occurred while updating.",
          variant: "destructive",
        });
        
        throw error;
      }
    };
    
    // Call the update function with the correct data
    if (data.id) {
      updateProcurementItem(type, data.id, data);
    } */
    
    switch (type) {
      case 'bid-security':
        updateBidSecurity(data.id, data);
        break;
      case 'document-fees':
        updateDocumentFee(data.id, data);
        break;
      case 'pre-bid':
        updatePreBidMeeting(data.id, data);
        break;
      case 'clarifications':
        updateClarification(data.id, data);
        break;
    }

    toast({
      title: "Updated Successfully",
      description: `${type.replace('-', ' ')} has been updated.`,
    });
  };

  return (
    <Card className="p-3 sm:p-4 md:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Procurement Management</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-0">
          <TabsTrigger value="bid-security">Bid Security</TabsTrigger>
          <TabsTrigger value="document-fees">Doc Fees</TabsTrigger>
          <TabsTrigger value="pre-bid">Pre-Bid</TabsTrigger>
          <TabsTrigger value="clarifications">Clarifications</TabsTrigger>
        </TabsList>

        <div className="mt-4 sm:mt-6">
          <TabsContent value="bid-security">
            <BidSecurityTab
              tenderId={tenderId}
              bidSecurities={bidSecurities}
              onUpdate={(data) => handleUpdate('bid-security', data)}
            />
          </TabsContent>

          <TabsContent value="document-fees">
            <DocumentFeesTab
              tenderId={tenderId}
              documentFees={documentFees}
              onUpdate={(data) => handleUpdate('document-fees', data)}
            />
          </TabsContent>

          <TabsContent value="pre-bid">
            <PreBidMeetingsTab
              tenderId={tenderId}
              meetings={preBidMeetings}
              onUpdate={(data) => handleUpdate('pre-bid', data)}
            />
          </TabsContent>

          <TabsContent value="clarifications">
            <ClarificationsTab
              tenderId={tenderId}
              clarifications={clarifications}
              onUpdate={(data) => handleUpdate('clarifications', data)}
            />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default ProcurementManagement;
