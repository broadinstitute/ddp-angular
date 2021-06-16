import { Injectable } from '@angular/core';

import { LoggingService, UserStatusResponse } from 'ddp-sdk';

import { RegistrationStatus } from '../models/registration-status';
import { Workflow } from '../models/workflow';
import { WorkflowModel } from '../models/workflow.model';

@Injectable({
  providedIn: 'root',
})
export class RegistrationStatusService {
  private contactUsStatuses = [
    RegistrationStatus.NotEligible,
    RegistrationStatus.Duplicate,
  ];
  private readonly LOG_SOURCE = 'RegistrationStatusService';

  constructor(private loggingService: LoggingService) {}

  findStatus(response: UserStatusResponse): WorkflowModel {
    return response.workflows.find(
      w => w.workflow === Workflow.RegistrationStatus,
    );
  }

  isContactUsStatus(workflow: WorkflowModel): boolean {
    return this.contactUsStatuses.includes(
      workflow.status as RegistrationStatus,
    );
  }

  getEnrollmentMessageKey(workflow: WorkflowModel): string {
    const baseKey = 'EnrollmentStatus.Messages';

    switch (workflow.status) {
      case RegistrationStatus.NotRegistered:
        return `${baseKey}.NotRegistered`;
      case RegistrationStatus.Registered:
        return `${baseKey}.Registered`;
      case RegistrationStatus.Consented:
        return `${baseKey}.Consented`;
      case RegistrationStatus.ConsentedNeedsAssent:
        return `${baseKey}.ConsentedNeedsAssent`;
      case RegistrationStatus.SubmittedPhysicianInfo:
        return `${baseKey}.SubmittedPhysicianInfo`;
      case RegistrationStatus.SubmittedMedicalHistory:
        return `${baseKey}.SubmittedMedicalHistory`;
      case RegistrationStatus.SubmittedGenomeStudyShippingInfo:
        return `${baseKey}.SubmittedGenomeStudyShippingInfo`;
      case RegistrationStatus.SubmittedEnrollment:
        return `${baseKey}.SubmittedEnrollment`;
      case RegistrationStatus.Enrolled:
        return `${baseKey}.Enrolled`;
      case RegistrationStatus.NotEligible:
      case RegistrationStatus.Duplicate:
        return `${baseKey}.ContactUs`;
      default:
        this.loggingService.logError(
          this.LOG_SOURCE,
          `Unknown registration status: "${workflow.status}"`,
          workflow,
        );
        break;
    }
  }
}
