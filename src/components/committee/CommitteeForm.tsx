
import FormContainer from "./form/FormContainer";
import FormHeader from "./form/FormHeader";
import FormActions from "./form/FormActions";
import BasicInfoFields from "./BasicInfoFields";
import DateInputs from "./DateInputs";
import CommitteeMembers from "./CommitteeMembers";
import FileUpload from "./FileUpload";
import { useCommitteeForm } from "@/hooks/useCommitteeForm";
import type { Committee } from "@/types/committee";

interface CommitteeFormProps {
  onClose: () => void;
  onCreateCommittee?: (committee: Committee) => void;
}

const CommitteeForm = ({ onClose, onCreateCommittee }: CommitteeFormProps) => {
  // BACKEND API: When loading existing committee data for editing
  // Endpoint: GET /api/committees/:id
  // Request: { id: number }
  // Response: Committee object with members, dates, etc.
  
  /* Integration Code:
  const [committee, setCommittee] = useState<Committee | null>(null);
  const [loading, setLoading] = useState(false);
  
  const fetchCommittee = async (committeeId: number) => {
    if (!committeeId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/committees/${committeeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch committee');
      
      const data = await response.json();
      setCommittee(data);
      
      // Initialize form with existing data
      setName(data.name);
      setPurpose(data.purpose);
      setFormDate(data.formationDate);
      setSpecificationDate(data.specifications?.submissionDate || '');
      setReviewDate(data.reviews?.[0]?.scheduledDate || '');
      setMembers(data.members || []);
    } catch (error) {
      console.error('Error fetching committee:', error);
      toast({
        title: "Error",
        description: "Failed to load committee data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // If editing an existing committee, fetch its data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const committeeId = urlParams.get('id');
    
    if (committeeId) {
      fetchCommittee(Number(committeeId));
    }
  }, []); */
  
  const {
    members,
    formDate,
    specificationDate,
    reviewDate,
    selectedFile,
    name,
    purpose,
    handleAddMember,
    handleUpdateMember,
    handleSubmit,
    setMembers,
    setFormDate,
    setSpecificationDate,
    setReviewDate,
    setSelectedFile,
    setName,
    setPurpose,
  } = useCommitteeForm(onClose, onCreateCommittee);

  return (
    <div className="w-full slide-in fade-in">
      <FormHeader onClose={onClose} />

      <form onSubmit={handleSubmit} className="space-y-8 mt-6">
        <div className="space-y-6">
          <BasicInfoFields
            name={name}
            purpose={purpose}
            onNameChange={setName}
            onPurposeChange={setPurpose}
          />

          <DateInputs
            formDate={formDate}
            specificationDate={specificationDate}
            reviewDate={reviewDate}
            onFormDateChange={setFormDate}
            onSpecificationDateChange={setSpecificationDate}
            onReviewDateChange={setReviewDate}
          />

          <CommitteeMembers
            members={members}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onRemoveMember={(index) => {
              // BACKEND API: When removing a member
              // Endpoint: DELETE /api/committees/:committeeId/members/:memberId
              // Request: { committeeId: number, memberId: number }
              // Response: { success: boolean }
              
              /* Integration Code:
              const removeMember = async (committeeId: number, memberId: number) => {
                try {
                  const response = await fetch(`/api/committees/${committeeId}/members/${memberId}`, {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                  
                  if (!response.ok) throw new Error('Failed to remove member');
                  
                  const result = await response.json();
                  
                  if (result.success) {
                    setMembers(members.filter((_, i) => i !== index));
                    
                    toast({
                      title: "Member Removed",
                      description: "Committee member has been removed successfully.",
                    });
                  }
                  
                  return result;
                } catch (error) {
                  console.error('Error removing member:', error);
                  
                  toast({
                    title: "Error",
                    description: "Failed to remove committee member",
                    variant: "destructive",
                  });
                  
                  throw error;
                }
              };
              
              // If editing an existing committee, call the API
              if (committee?.id && members[index]?.id) {
                removeMember(committee.id, members[index].id);
              } else {
                // For new committees, just update the state
                setMembers(members.filter((_, i) => i !== index));
              } */
              
              setMembers(members.filter((_, i) => i !== index));
            }}
          />

          <FileUpload onFileChange={setSelectedFile} />
        </div>

        <FormActions onClose={onClose} />
      </form>
    </div>
  );
};

export default CommitteeForm;
