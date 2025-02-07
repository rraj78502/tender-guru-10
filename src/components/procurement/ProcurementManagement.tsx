
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BidSecurityManager from "./BidSecurityManager";
import DocumentFeeManager from "./DocumentFeeManager";
import PreBidMeetingManager from "./PreBidMeetingManager";
import ClarificationManager from "./ClarificationManager";
import type { BidSecurity, DocumentFee, PreBidMeeting, Clarification } from "@/types/procurement";

const ProcurementManagement = ({ tenderId }: { tenderId: number }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bid-security");
  const [bidSecurities, setBidSecurities] = useState<BidSecurity[]>([]);
  const [documentFees, setDocumentFees] = useState<DocumentFee[]>([]);
  const [preBidMeetings, setPreBidMeetings] = useState<PreBidMeeting[]>([]);
  const [clarifications, setClarifications] = useState<Clarification[]>([]);

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
          <BidSecurityManager
            tenderId={tenderId}
            bidSecurities={bidSecurities}
            onUpdate={setBidSecurities}
          />
        </TabsContent>

        <TabsContent value="document-fees">
          <DocumentFeeManager
            tenderId={tenderId}
            documentFees={documentFees}
            onUpdate={setDocumentFees}
          />
        </TabsContent>

        <TabsContent value="pre-bid">
          <PreBidMeetingManager
            tenderId={tenderId}
            meetings={preBidMeetings}
            onUpdate={setPreBidMeetings}
          />
        </TabsContent>

        <TabsContent value="clarifications">
          <ClarificationManager
            tenderId={tenderId}
            clarifications={clarifications}
            onUpdate={setClarifications}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ProcurementManagement;
