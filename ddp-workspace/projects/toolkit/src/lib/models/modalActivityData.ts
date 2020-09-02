export interface ModalActivityData {
  studyGuid: string;
  instanceGuid: string;
  nextButtonText?: string | null;
  prevButtonText?: string | null;
  submitButtonText: string;
  showFinalConfirmation: boolean;
  confirmationButtonText?: string | null;
}
