import { StudyMessageConfiguration } from '../models/StudyMessageConfiguration';
import { AcceptanceStatus } from './acceptance-status';
import { InactiveReason } from './inactive-reason';
import { KitTypeToRequest } from './kit-type-to-request';
import { MedicalRecordsReceived } from './medical-records-received';
import { PortalMessage } from './portal-message';
import { RedCapSurveyTaker } from './redcap-survey-taker';
import { WorkflowKey } from './workflow-key';

export const studyMessagesConfiguration: StudyMessageConfiguration[] = [
  /**
   * Application
   */
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow => workflow.status === AcceptanceStatus.PreReview,
    baseKey: 'Application',
    stageKey: 'PreReview',
    group: 1,
  },
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow => workflow.status === AcceptanceStatus.InReview,
    dateWorkflowKey: WorkflowKey.AcceptanceStatusDate,
    baseKey: 'Application',
    stageKey: 'InReview',
    group: 1,
  },
  {
    workflowKey: WorkflowKey.PortalMessage,
    condition: workflow => workflow.status === PortalMessage.GenericThankYou,
    dateWorkflowKey: WorkflowKey.PortalMessageDate,
    baseKey: 'Application',
    stageKey: 'ThankYou',
    exclusive: true,
    group: 1,
  },

  /**
   * Application decision
   */
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow => workflow.status === AcceptanceStatus.Accepted,
    dateWorkflowKey: WorkflowKey.AcceptanceStatusDate,
    baseKey: 'ApplicationDecision',
    stageKey: 'Accepted',
    group: 2,
  },
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow => workflow.status === AcceptanceStatus.NotAccepted,
    dateWorkflowKey: WorkflowKey.AcceptanceStatusDate,
    baseKey: 'ApplicationDecision',
    stageKey: 'NotAccepted',
    group: 2,
  },
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow => workflow.status === AcceptanceStatus.MoreInfoNeeded,
    dateWorkflowKey: WorkflowKey.AcceptanceStatusDate,
    baseKey: 'ApplicationDecision',
    stageKey: 'MoreInfoNeeded',
    group: 2,
  },
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow => workflow.status === AcceptanceStatus.NmiToAccept,
    dateWorkflowKey: WorkflowKey.AcceptanceStatusDate,
    baseKey: 'ApplicationDecision',
    stageKey: 'NMI',
    group: 2,
  },

  /**
   * Consent session
   */
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow =>
      workflow.status === AcceptanceStatus.Accepted ||
      workflow.status === AcceptanceStatus.MoreInfoNeeded,
    additionalCondition: workflows =>
      !workflows.find(
        workflow => workflow.workflow === WorkflowKey.AcuityAppointmentDate,
      ),
    dateWorkflowKey: WorkflowKey.AcceptanceStatusDate,
    baseKey: 'ConsentSession',
    stageKey: 'ScheduleNeeded',
    group: 3,
  },
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow =>
      workflow.status === AcceptanceStatus.Accepted ||
      workflow.status === AcceptanceStatus.MoreInfoNeeded,
    additionalCondition: workflows =>
      !!workflows.find(
        workflow => workflow.workflow === WorkflowKey.AcuityAppointmentDate,
      ),
    dateWorkflowKey: WorkflowKey.AcuityAppointmentDate,
    baseKey: 'ConsentSession',
    stageKey: 'Scheduled',
    group: 3,
  },

  /**
   * Consent form
   */
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow =>
      workflow.status === AcceptanceStatus.Accepted ||
      workflow.status === AcceptanceStatus.MoreInfoNeeded,
    additionalCondition: workflows =>
      !!workflows.find(
        workflow => workflow.workflow === WorkflowKey.DateOfConsentCall,
      ),
    dateWorkflowKey: WorkflowKey.DateOfConsentCall,
    baseKey: 'ConsentForm',
    stageKey: 'SignedFormRequired',
    group: 3,
  },
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow =>
      workflow.status === AcceptanceStatus.Accepted ||
      workflow.status === AcceptanceStatus.MoreInfoNeeded,
    additionalCondition: workflows =>
      !!workflows.find(
        workflow => workflow.workflow === WorkflowKey.EnrollmentDate,
      ),
    dateWorkflowKey: WorkflowKey.EnrollmentDate,
    baseKey: 'ConsentForm',
    stageKey: 'SignedFormReceived',
    group: 3,
  },
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow =>
      workflow.status === AcceptanceStatus.Accepted ||
      workflow.status === AcceptanceStatus.MoreInfoNeeded,
    additionalCondition: workflows =>
      !!workflows.find(
        workflow =>
          workflow.workflow === WorkflowKey.InactiveReason &&
          workflow.status === InactiveReason.Declined,
      ),
    dateWorkflowKey: WorkflowKey.AcceptanceStatusDate,
    baseKey: 'ConsentForm',
    stageKey: 'Decline',
    group: 3,
  },

  /**
   * Medical records
   */
  {
    workflowKey: WorkflowKey.MedicalRecordsReceived,
    condition: workflow => workflow.status === MedicalRecordsReceived.No,
    additionalCondition: workflows =>
      !!workflows.find(
        workflow => workflow.workflow === WorkflowKey.EnrollmentDate,
      ),
    dateWorkflowKey: WorkflowKey.EnrollmentDate,
    baseKey: 'MedicalRecords',
    stageKey: 'NoRecords',
    group: 3,
  },
  {
    workflowKey: WorkflowKey.MedicalRecordsReceived,
    condition: workflow => workflow.status === MedicalRecordsReceived.Partial,
    additionalCondition: workflows =>
      !!workflows.find(
        workflow => workflow.workflow === WorkflowKey.EnrollmentDate,
      ),
    dateWorkflowKey: WorkflowKey.MedicalRecordsLastReceived,
    baseKey: 'MedicalRecords',
    stageKey: 'Partial',
    group: 3,
  },
  {
    workflowKey: WorkflowKey.MedicalRecordsReceived,
    condition: workflow => workflow.status === MedicalRecordsReceived.Yes,
    additionalCondition: workflows =>
      !!workflows.find(
        workflow => workflow.workflow === WorkflowKey.EnrollmentDate,
      ),
    dateWorkflowKey: WorkflowKey.MedicalRecordsLastReceived,
    baseKey: 'MedicalRecords',
    stageKey: 'Received',
    group: 3,
  },
  {
    workflowKey: WorkflowKey.MedicalRecordsReceived,
    condition: workflow => workflow.status === MedicalRecordsReceived.NA,
    additionalCondition: workflows =>
      !!workflows.find(
        workflow => workflow.workflow === WorkflowKey.EnrollmentDate,
      ),
    dateWorkflowKey: WorkflowKey.EnrollmentDate,
    baseKey: 'MedicalRecords',
    stageKey: 'NA',
    group: 3,
  },

  /**
   * Survey
   */
  {
    workflowKey: WorkflowKey.RedCapSurveyTaker,
    condition: workflow => workflow.status === RedCapSurveyTaker.Yes,
    additionalCondition: workflows =>
      !!workflows.find(
        workflow => workflow.workflow === WorkflowKey.EnrollmentDate,
      ),
    dateWorkflowKey: WorkflowKey.EnrollmentDate,
    baseKey: 'Survey',
    stageKey: 'Enrolled',
    group: 3,
  },
  {
    workflowKey: WorkflowKey.RedCapSurveyCompletedDate,
    condition: () => true,
    additionalCondition: workflows =>
      !!workflows.find(
        workflow => workflow.workflow === WorkflowKey.EnrollmentDate,
      ),
    dateWorkflowKey: WorkflowKey.RedCapSurveyCompletedDate,
    baseKey: 'Survey',
    stageKey: 'Complete',
    group: 3,
  },

  /**
   * Sample
   */
  {
    workflowKey: WorkflowKey.KitTypeToRequest,
    condition: workflow =>
      workflow.status === KitTypeToRequest.Blood ||
      workflow.status === KitTypeToRequest.Saliva,
    additionalCondition: workflows =>
      !!workflows.find(
        workflow => workflow.workflow === WorkflowKey.EnrollmentDate,
      ),
    dateWorkflowKey: WorkflowKey.EnrollmentDate,
    baseKey: 'Sample',
    stageKey: 'Enrolled',
    group: 3,
  },
  {
    workflowKey: WorkflowKey.DateKitSent,
    condition: () => true,
    dateWorkflowKey: WorkflowKey.DateKitSent,
    baseKey: 'Sample',
    stageKey: 'Sent',
    group: 3,
  },
  {
    workflowKey: WorkflowKey.DateKitReceived,
    condition: () => true,
    dateWorkflowKey: WorkflowKey.DateKitReceived,
    baseKey: 'Sample',
    stageKey: 'Received',
    group: 3,
  },

  /**
   * Withdraw
   */
  {
    workflowKey: WorkflowKey.PortalMessage,
    condition: workflow => workflow.status === PortalMessage.Withdraw,
    dateWorkflowKey: WorkflowKey.PortalMessageDate,
    baseKey: 'Withdraw',
    stageKey: 'Withdraw',
    group: 3,
  },

  /**
   * Data analysis
   */
  {
    workflowKey: WorkflowKey.PortalMessage,
    condition: workflow =>
      workflow.status === PortalMessage.FamilyStepsComplete,
    dateWorkflowKey: WorkflowKey.PortalMessageDate,
    baseKey: 'DataAnalysis',
    stageKey: 'FamilyStepsComplete',
    group: 3,
  },
  {
    workflowKey: WorkflowKey.PortalMessage,
    condition: workflow =>
      workflow.status === PortalMessage.ProbandStepsComplete,
    dateWorkflowKey: WorkflowKey.PortalMessageDate,
    baseKey: 'DataAnalysis',
    stageKey: 'ProbandStepsComplete',
    group: 3,
  },
  {
    workflowKey: WorkflowKey.PortalMessage,
    condition: workflow => workflow.status === PortalMessage.ProbandNeg,
    dateWorkflowKey: WorkflowKey.PortalMessageDate,
    baseKey: 'DataAnalysis',
    stageKey: 'ProbandNeg',
    group: 3,
  },
];
