import { test } from '@playwright/test';

export function logParticipantCreated(participantEmail: string, participantName: string) {
  test.info().annotations.push({
    type: 'participant',
    description: `${participantEmail} ${participantName}`
  });
}

export function logParticipantWithdrew(participantId: string, shortId: string, registrationDate: string) {
  test.info().annotations.push({
    type: 'participant withdrawn',
    description: `participant ID: ${participantId}, Short ID: ${shortId}, Registration Date: ${registrationDate}`
  });
}

export function logEmailVerificationResult(emailSubject: string, passed: boolean) {
  const testResult = passed ? ':heavy_check_mark:' : ':x:';
  test.info().annotations.push({
    type: `email with subject '${emailSubject}'`,
    description: `${testResult} ${emailSubject}`
  });
}

export function logGenomeStudySampleKitReceived(shortId: string) {
  test.info().annotations.push({
    type: 'Genome Study Sample Kit Received',
    description: `Mark kit received for participant short_id: ${shortId}`
  });
}

export function logError(err: string) {
  test.info().annotations.push({
    type: 'ERROR',
    description: err
  });
}

export function logInfo(info: string) {
  test.info().annotations.push({
    type: 'Info',
    description: info
  });
}
