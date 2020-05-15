export interface InvitationCheckPayload {
    recaptchaToken: string;
    invitationId: string;
    auth0ClientId: string;
    zip?: string;
}
