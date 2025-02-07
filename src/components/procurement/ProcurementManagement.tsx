
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BidSecurity, DocumentFee, PreBidMeeting, Clarification } from "@/types/procurement";
import BidSecurityTab from "./tabs/BidSecurityTab";
import DocumentFeesTab from "./tabs/DocumentFeesTab";
import PreBidMeetingsTab from "./tabs/PreBidMeetingsTab";
import ClarificationsTab from "./tabs/ClarificationsTab";

const ProcurementManagement = ({ tenderId }: { tenderId: number }) => {
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
          <BidSecurityTab
            tenderId={tenderId}
            bidSecurities={bidSecurities}
            onUpdate={setBidSecurities}
          />
        </TabsContent>

        <TabsContent value="document-fees">
          <DocumentFeesTab
            tenderId={tenderId}
            documentFees={documentFees}
            onUpdate={setDocumentFees}
          />
        </TabsContent>

        <TabsContent value="pre-bid">
          <PreBidMeetingsTab
            tenderId={tenderId}
            meetings={preBidMeetings}
            onUpdate={setPreBidMeetings}
          />
        </TabsContent>

        <TabsContent value="clarifications">
          <ClarificationsTab
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

