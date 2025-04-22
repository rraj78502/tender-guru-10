
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
