
import FormContainer from "./form/FormContainer";
import FormHeader from "./form/FormHeader";
import FormActions from "./form/FormActions";
import BasicInfoFields from "./BasicInfoFields";
import DateInputs from "./DateInputs";
import CommitteeMembers from "./CommitteeMembers";
import TaskManager from "./TaskManager";
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
    tasks,
    name,
    purpose,
    handleCreateTask,
    handleUpdateTask,
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
    <FormContainer>
      <FormHeader onClose={onClose} />

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Task Management</h3>
          <TaskManager
            members={members}
            tasks={tasks}
            onTaskCreate={handleCreateTask}
            onTaskUpdate={handleUpdateTask}
          />
        </div>

        <FileUpload onFileChange={setSelectedFile} />

        <FormActions onClose={onClose} />
      </form>
    </FormContainer>
  );
};

export default CommitteeForm;
