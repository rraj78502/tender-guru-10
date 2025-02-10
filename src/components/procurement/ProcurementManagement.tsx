
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { BidSecurity, DocumentFee, PreBidMeeting, Clarification } from "@/types/procurement";
import BidSecurityTab from "./tabs/BidSecurityTab";
import DocumentFeesTab from "./tabs/DocumentFeesTab";
import PreBidMeetingsTab from "./tabs/PreBidMeetingsTab";
import ClarificationsTab from "./tabs/ClarificationsTab";
import { 
  mockBidSecurities, 
  mockDocumentFees, 
  mockPreBidMeetings, 
  mockClarifications 
} from "@/mock/procurementData";

const ProcurementManagement = ({ tenderId }: { tenderId: number }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bid-security");
  const [bidSecurities, setBidSecurities] = useState<BidSecurity[]>(mockBidSecurities);
  const [documentFees, setDocumentFees] = useState<DocumentFee[]>(mockDocumentFees);
  const [preBidMeetings, setPreBidMeetings] = useState<PreBidMeeting[]>(mockPreBidMeetings);
  const [clarifications, setClarifications] = useState<Clarification[]>(mockClarifications);

  useEffect(() => {
    console.log("Loading procurement data for tender:", tenderId);
  }, [tenderId]);

  const handleUpdate = (type: string, data: any) => {
    switch (type) {
      case 'bid-security':
        setBidSecurities(data);
        break;
      case 'document-fees':
        setDocumentFees(data);
        break;
      case 'pre-bid':
        setPreBidMeetings(data);
        break;
      case 'clarifications':
        setClarifications(data);
        break;
    }

    toast({
      title: "Updated Successfully",
      description: `${type.replace('-', ' ')} has been updated.`,
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Procurement Management</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bid-security">Bid Security</TabsTrigger>
          <TabsTrigger value="document-fees">Document Fees</TabsTrigger>
          <TabsTrigger value="pre-bid">Pre-Bid Meetings</TabsTrigger>
          <TabsTrigger value="clarifications">Clarifications</TabsTrigger>
        </TabsList>

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
      </Tabs>
    </Card>
  );
};

export default ProcurementManagement;
