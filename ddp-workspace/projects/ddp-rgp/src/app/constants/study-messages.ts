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
    condition: workflow => workflow.status === AcceptanceStatus.InReview,
    additionalCondition: workflows =>
      // If we depend on a "date" workflow, then let's ensure we have it.
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.AcceptanceStatusDate && workflow.status),
    dateWorkflowKey: WorkflowKey.AcceptanceStatusDate,
    baseKey: 'Application',
    stageKey: 'InReview',
    group: 1,
  },
  {
    workflowKey: WorkflowKey.PortalMessage,
    condition: workflow => workflow.status === PortalMessage.GenericThankYou,
    additionalCondition: workflows =>
      // For the "date" workflow objects, study staff might clear out the date
      // in DSM, which will result in an empty string for the actual date value,
      // so we should check the `status` property.
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.PortalMessageDate && workflow.status),
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
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.AcceptanceStatusDate && workflow.status),
    dateWorkflowKey: WorkflowKey.AcceptanceStatusDate,
    baseKey: 'ApplicationDecision',
    stageKey: 'Accepted',
    group: 2,
  },
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow => workflow.status === AcceptanceStatus.NotAccepted,
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.AcceptanceStatusDate && workflow.status),
    dateWorkflowKey: WorkflowKey.AcceptanceStatusDate,
    baseKey: 'ApplicationDecision',
    stageKey: 'NotAccepted',
    group: 2,
  },
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow => workflow.status === AcceptanceStatus.MoreInfoNeeded,
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.AcceptanceStatusDate && workflow.status),
    dateWorkflowKey: WorkflowKey.AcceptanceStatusDate,
    baseKey: 'ApplicationDecision',
    stageKey: 'MoreInfoNeeded',
    group: 2,
  },
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow => workflow.status === AcceptanceStatus.NmiToAccept,
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.AcceptanceStatusDate && workflow.status),
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
    condition: workflow => [
        AcceptanceStatus.Accepted,
        AcceptanceStatus.MoreInfoNeeded,
        AcceptanceStatus.NmiToAccept,
        AcceptanceStatus.NotAccepted,
      ].includes(workflow.status as AcceptanceStatus),
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.AcceptanceStatusDate && workflow.status) &&
      !workflows.find(workflow => workflow.workflow === WorkflowKey.AcuityAppointmentDate && workflow.status),
    dateWorkflowKey: WorkflowKey.AcceptanceStatusDate,
    baseKey: 'ConsentSession',
    stageKey: 'ScheduleNeeded',
    group: 3,
  },
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow => [
        AcceptanceStatus.Accepted,
        AcceptanceStatus.MoreInfoNeeded,
        AcceptanceStatus.NmiToAccept,
        AcceptanceStatus.NotAccepted,
      ].includes(workflow.status as AcceptanceStatus),
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.AcuityAppointmentDate && workflow.status),
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
    condition: workflow => [
        AcceptanceStatus.Accepted,
        AcceptanceStatus.MoreInfoNeeded,
        AcceptanceStatus.NmiToAccept,
        AcceptanceStatus.NotAccepted,
      ].includes(workflow.status as AcceptanceStatus),
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.DateOfConsentCall && workflow.status) &&
      !workflows.find(workflow => workflow.workflow === WorkflowKey.EnrollmentDate && workflow.status),
    dateWorkflowKey: WorkflowKey.DateOfConsentCall,
    baseKey: 'ConsentForm',
    stageKey: 'SignedFormRequired',
    group: 4,
  },
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow => [
        AcceptanceStatus.Accepted,
        AcceptanceStatus.MoreInfoNeeded,
        AcceptanceStatus.NmiToAccept,
        AcceptanceStatus.NotAccepted,
      ].includes(workflow.status as AcceptanceStatus),
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.EnrollmentDate && workflow.status),
    dateWorkflowKey: WorkflowKey.EnrollmentDate,
    baseKey: 'ConsentForm',
    stageKey: 'SignedFormReceived',
    group: 4,
  },
  {
    workflowKey: WorkflowKey.AcceptanceStatus,
    condition: workflow =>
      workflow.status === AcceptanceStatus.Accepted ||
      workflow.status === AcceptanceStatus.MoreInfoNeeded,
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.AcceptanceStatusDate && workflow.status) &&
      !!workflows.find(workflow =>
          workflow.workflow === WorkflowKey.InactiveReason &&
          workflow.status === InactiveReason.Declined),
    dateWorkflowKey: WorkflowKey.AcceptanceStatusDate,
    baseKey: 'ConsentForm',
    stageKey: 'Decline',
    group: 4,
  },

  /**
   * Medical records
   */
  {
    workflowKey: WorkflowKey.MedicalRecordsReceived,
    condition: workflow => workflow.status === MedicalRecordsReceived.No,
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.EnrollmentDate && workflow.status),
    dateWorkflowKey: WorkflowKey.EnrollmentDate,
    baseKey: 'MedicalRecords',
    stageKey: 'NoRecords',
    group: 5,
  },
  {
    workflowKey: WorkflowKey.MedicalRecordsReceived,
    condition: workflow => workflow.status === MedicalRecordsReceived.Partial,
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.EnrollmentDate && workflow.status) &&
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.MedicalRecordsLastReceived && workflow.status),
    dateWorkflowKey: WorkflowKey.MedicalRecordsLastReceived,
    baseKey: 'MedicalRecords',
    stageKey: 'Partial',
    group: 5,
  },
  {
    workflowKey: WorkflowKey.MedicalRecordsReceived,
    condition: workflow => workflow.status === MedicalRecordsReceived.Yes,
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.EnrollmentDate && workflow.status) &&
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.MedicalRecordsLastReceived && workflow.status),
    dateWorkflowKey: WorkflowKey.MedicalRecordsLastReceived,
    baseKey: 'MedicalRecords',
    stageKey: 'Received',
    group: 5,
  },
  {
    workflowKey: WorkflowKey.MedicalRecordsReceived,
    condition: workflow => workflow.status === MedicalRecordsReceived.NA,
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.EnrollmentDate && workflow.status),
    dateWorkflowKey: WorkflowKey.EnrollmentDate,
    baseKey: 'MedicalRecords',
    stageKey: 'NA',
    group: 5,
  },

  /**
   * Survey
   */
  {
    workflowKey: WorkflowKey.RedCapSurveyTaker,
    condition: workflow => workflow.status === RedCapSurveyTaker.Yes,
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.EnrollmentDate && workflow.status) &&
      !workflows.find(workflow => workflow.workflow === WorkflowKey.RedCapSurveyCompletedDate && workflow.status),
    dateWorkflowKey: WorkflowKey.EnrollmentDate,
    baseKey: 'Survey',
    stageKey: 'Enrolled',
    group: 6,
  },
  {
    workflowKey: WorkflowKey.RedCapSurveyCompletedDate,
    condition: () => true,
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.EnrollmentDate && workflow.status) &&
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.RedCapSurveyCompletedDate && workflow.status),
    dateWorkflowKey: WorkflowKey.RedCapSurveyCompletedDate,
    baseKey: 'Survey',
    stageKey: 'Complete',
    group: 6,
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
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.EnrollmentDate && workflow.status) &&
      !workflows.find(workflow => workflow.workflow === WorkflowKey.DateKitSent && workflow.status) &&
      !workflows.find(workflow => workflow.workflow === WorkflowKey.DateKitReceived && workflow.status),
    dateWorkflowKey: WorkflowKey.EnrollmentDate,
    baseKey: 'Sample',
    stageKey: 'Enrolled',
    group: 7,
  },
  {
    workflowKey: WorkflowKey.DateKitSent,
    condition: () => true,
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.EnrollmentDate && workflow.status) &&
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.DateKitSent && workflow.status) &&
      !workflows.find(workflow => workflow.workflow === WorkflowKey.DateKitReceived && workflow.status),
    dateWorkflowKey: WorkflowKey.DateKitSent,
    baseKey: 'Sample',
    stageKey: 'Sent',
    group: 7,
  },
  {
    workflowKey: WorkflowKey.DateKitReceived,
    condition: () => true,
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.EnrollmentDate && workflow.status) &&
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.DateKitReceived && workflow.status),
    dateWorkflowKey: WorkflowKey.DateKitReceived,
    baseKey: 'Sample',
    stageKey: 'Received',
    group: 7,
  },

  /**
   * Withdraw
   */
  {
    workflowKey: WorkflowKey.PortalMessage,
    condition: workflow => workflow.status === PortalMessage.Withdraw,
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.PortalMessageDate && workflow.status),
    dateWorkflowKey: WorkflowKey.PortalMessageDate,
    baseKey: 'Withdraw',
    stageKey: 'Withdraw',
    group: 8,
  },

  /**
   * Data analysis
   */
  {
    workflowKey: WorkflowKey.PortalMessage,
    condition: workflow =>
      workflow.status === PortalMessage.FamilyStepsComplete,
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.PortalMessageDate && workflow.status),
    dateWorkflowKey: WorkflowKey.PortalMessageDate,
    baseKey: 'DataAnalysis',
    stageKey: 'FamilyStepsComplete',
    group: 9,
  },
  {
    workflowKey: WorkflowKey.PortalMessage,
    condition: workflow =>
      workflow.status === PortalMessage.ProbandStepsComplete,
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.PortalMessageDate && workflow.status),
    dateWorkflowKey: WorkflowKey.PortalMessageDate,
    baseKey: 'DataAnalysis',
    stageKey: 'ProbandStepsComplete',
    group: 9,
  },
  {
    workflowKey: WorkflowKey.PortalMessage,
    condition: workflow => workflow.status === PortalMessage.ProbandNeg,
    additionalCondition: workflows =>
      !!workflows.find(workflow => workflow.workflow === WorkflowKey.PortalMessageDate && workflow.status),
    dateWorkflowKey: WorkflowKey.PortalMessageDate,
    baseKey: 'DataAnalysis',
    stageKey: 'ProbandNeg',
    group: 9,
  },
];
