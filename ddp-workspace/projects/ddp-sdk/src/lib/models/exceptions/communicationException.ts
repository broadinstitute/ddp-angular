import { DdpException } from './ddpException';

export class CommunicationException extends DdpException {
    constructor(private method: string, body: any = undefined) {
        super(body);
    }

    public get Method(): string {
        return this.method;
    }
}
