export interface InvitationCheckPayload {
    recaptchaToken: string;
    invitationId: string;
    auth0ClientId: string;
    qualificationDetails: {zipCode: string};
}
