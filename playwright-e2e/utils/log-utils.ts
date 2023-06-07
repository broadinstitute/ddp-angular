import { test } from '@playwright/test';

export function logParticipantCreated(participantEmail: string, participantName: string) {
  test.info().annotations.push({
    type: 'participant',
    description: `${participantEmail} ${participantName}`
  });
}

export function logParticipantWithdrew(participantId: string, shortId: string) {
  test.info().annotations.push({
    type: 'participant withdrawal',
    description: `participant ID: ${participantId}, Short ID: ${shortId}`
  });
}

export function logEmailVerificationResult(emailSubject: string, passed: boolean) {
  const testResult = passed ? ':heavy_check_mark:' : ':x:';
  test.info().annotations.push({
    type: `email with subject '${emailSubject}'`,
    description: `${testResult} ${emailSubject}`
  });
}
