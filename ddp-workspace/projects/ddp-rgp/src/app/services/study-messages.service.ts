import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { StudyMessage } from '../models/StudyMessage';

/**
 * Mocking and delay is for development purposes
 * until proper backend interaction is set up
 */

@Injectable({
  providedIn: 'root',
})
export class StudyMessagesService {
  private readonly BASE_TRANSLATE_KEY = 'StudyMessages';
  private readonly APPLICATION_TRANSLATE_KEY = 'Application';
  private readonly APPLICATION_DECISION_TRANSLATE_KEY = 'ApplicationDecision';
  private readonly CONSENT_SESSION_TRANSLATE_KEY = 'ConsentSession';
  private readonly CONSENT_FORM_TRANSLATE_KEY = 'ConsentForm';
  private readonly MEDICAL_RECORDS_TRANSLATE_KEY = 'MedicalRecords';
  private readonly RED_CAP_TRANSLATE_KEY = 'RedCap';
  private readonly SAMPLE_TRANSLATE_KEY = 'Sample';
  private readonly WITHDRAW_TRANSLATE_KEY = 'Withdraw';
  private readonly DATA_ANALYSIS_TRANSLATE_KEY = 'DataAnalysis';

  getMessages(): Observable<StudyMessage[]> {
    return of(this.mockMessages()).pipe(delay(3000));
  }

  private mockMessages(): StudyMessage[] {
    return [
      this.getMedicalRecordsMessage(),
      this.getConsentFormMessage(),
      this.getConsentSessionMessage(),
      this.getApplicationDecisionMessage(),
      this.getApplicationMessage(),
    ];
  }

  private getApplicationMessage(): StudyMessage {
    /**
     * Calculate 'date' and 'stage' dynamically
     */
    const date = new Date('05-01-2021');
    const stage = 'ThankYou';

    return {
      date,
      subject: this.getSubjectKey(this.APPLICATION_TRANSLATE_KEY, stage),
      message: this.getMessageKey(this.APPLICATION_TRANSLATE_KEY, stage),
      more: this.getMoreTextKey(this.APPLICATION_TRANSLATE_KEY, stage),
    };
  }

  private getApplicationDecisionMessage(): StudyMessage {
    /**
     * Calculate 'date' and 'stage' dynamically
     */
    const date = new Date('05-02-2021');
    const stage = 'Accepted';

    return {
      date,
      subject: this.getSubjectKey(
        this.APPLICATION_DECISION_TRANSLATE_KEY,
        stage,
      ),
      message: this.getMessageKey(
        this.APPLICATION_DECISION_TRANSLATE_KEY,
        stage,
      ),
      more: this.getMoreTextKey(this.APPLICATION_DECISION_TRANSLATE_KEY, stage),
    };
  }

  private getConsentSessionMessage(): StudyMessage {
    /**
     * Calculate 'date' and 'stage' dynamically
     */
    const date = new Date('05-03-2021');
    const stage = 'ScheduleNeeded';

    return {
      date,
      subject: this.getSubjectKey(this.CONSENT_SESSION_TRANSLATE_KEY, stage),
      message: this.getMessageKey(this.CONSENT_SESSION_TRANSLATE_KEY, stage),
      more: this.getMoreTextKey(this.CONSENT_SESSION_TRANSLATE_KEY, stage),
    };
  }

  private getConsentFormMessage(): StudyMessage {
    /**
     * Calculate 'date' and 'stage' dynamically
     */
    const date = new Date('05-04-2021');
    const stage = 'SignedFormReceived';

    return {
      date,
      subject: this.getSubjectKey(this.CONSENT_FORM_TRANSLATE_KEY, stage),
      message: this.getMessageKey(this.CONSENT_FORM_TRANSLATE_KEY, stage),
      more: this.getMoreTextKey(this.CONSENT_FORM_TRANSLATE_KEY, stage),
    };
  }

  private getMedicalRecordsMessage(): StudyMessage {
    /**
     * Calculate 'date' and 'stage' dynamically
     */
    const date = new Date('05-05-2021');
    const stage = 'Partial';

    return {
      date,
      subject: this.getSubjectKey(this.MEDICAL_RECORDS_TRANSLATE_KEY, stage),
      message: this.getMessageKey(this.MEDICAL_RECORDS_TRANSLATE_KEY, stage),
      more: this.getMoreTextKey(this.MEDICAL_RECORDS_TRANSLATE_KEY, stage),
    };
  }

  private getBaseKey(messageTranslateKey: string, stage: string): string {
    return `${this.BASE_TRANSLATE_KEY}.${messageTranslateKey}.${stage}`;
  }

  private getSubjectKey(messageTranslateKey: string, stage: string): string {
    return `${this.getBaseKey(messageTranslateKey, stage)}.Subject`;
  }

  private getMessageKey(messageTranslateKey: string, stage: string): string {
    return `${this.getBaseKey(messageTranslateKey, stage)}.Message`;
  }

  private getMoreTextKey(messageTranslateKey: string, stage: string): string {
    return `${this.getBaseKey(messageTranslateKey, stage)}.More`;
  }
}
