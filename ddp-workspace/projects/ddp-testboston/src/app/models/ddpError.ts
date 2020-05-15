import { ErrorType } from './errorType';

export class DdpError extends Error {
    errorType: ErrorType;
    constructor(msg: string, errorType: ErrorType) {
        super(msg);
        this.errorType = errorType;
    }
}
