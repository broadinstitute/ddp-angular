export interface ModalActivityData {
  activityGuid: string;
  nextButtonText?: string | null;
  prevButtonText?: string | null;
  submitButtonText: string;
  showFinalConfirmation: boolean;
  confirmationButtonText?: string | null;
}
