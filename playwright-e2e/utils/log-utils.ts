import { test } from '@playwright/test';

function localTime() {
  return new Date().toLocaleTimeString();
}

export function logParticipantCreated(participantEmail: string, participantName: string) {
  test.info().annotations.push({
    type: 'Participant',
    description: `${localTime()}: ${participantEmail} ${participantName}`
  });
}

export function logParticipantWithdrew(participantId: string, shortId: string, registrationDate: string) {
  test.info().annotations.push({
    type: 'Participant',
    description: `${localTime()}: Participant ID: ${participantId}, Short ID: ${shortId}, Registration Date: ${registrationDate}`
  });
}

export function logEmailVerificationResult(emailSubject: string, passed: boolean) {
  const testResult = passed ? ':heavy_check_mark:' : ':x:';
  test.info().annotations.push({
    type: `Email with subject '${emailSubject}'`,
    description: `${localTime()}: ${testResult} ${emailSubject}`
  });
}

export function logGenomeStudySampleKitReceived(shortId: string) {
  test.info().annotations.push({
    type: 'Genome Study Sample Kit Received',
    description: `${localTime()}: Mark kit received for participant short_id: ${shortId}`
  });
}

export function logError(err: string) {
  test.info().annotations.push({
    type: 'ERROR',
    description: `${localTime()}: ${err}`
  });
}

export function logInfo(info: string) {
  test.info().annotations.push({
    type: 'Info',
    description: `${localTime()}: ${info}`
  });
}
