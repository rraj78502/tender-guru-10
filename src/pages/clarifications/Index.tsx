
import { ClarificationManager } from "@/components/procurement/ClarificationManager";

const ClarificationsPage = () => (
  <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Clarifications Management</h1>
    <ClarificationManager 
      tenderId={1}
      clarifications={[]}
      onUpdate={() => {}}
    />
  </div>
);

export default ClarificationsPage;
