export class Session {
    constructor(
        public accessToken: string,
        public idToken: string,
        public userGuid: string,
        public locale: string,
        public expiresAt: number,
        public participantGuid: string | null = null) { }
}
