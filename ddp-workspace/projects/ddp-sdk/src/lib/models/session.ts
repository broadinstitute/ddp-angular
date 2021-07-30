export class Session {
    constructor(
        public accessToken: string,
        public idToken: string,
        public userGuid: string,
        public locale: string,
        public expiresAt: number,
        // guid of participant which the current user access dashboard(for prism)/activities
        public participantGuid: string | null = null,
        public isAdmin: boolean = false,
        public invitationId: string | null = null) { }
}
