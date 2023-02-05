import { test, expect } from "@playwright/test";


export function logParticpantCreated(participantEmail: string, participantName: string) {
    test.info().annotations.push({
        type: "participant",
        description: participantEmail + ' ' + participantName,
    });
}

export function logEmailVerificationResult(emailSubject: string, passed:boolean) {
    const testResult = passed ? ":heavy_check_mark:" : ":x:";
    test.info().annotations.push({
        type: "email with subject '" + emailSubject + "'",
        description: testResult + " " + emailSubject
    });
}