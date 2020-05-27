import { ErrorType } from './errorType';

export class DdpError extends Error {
    public errorType: string;
    constructor(message: string, errorType: ErrorType) {
        super(message);
        this.errorType = errorType;
    }
}
