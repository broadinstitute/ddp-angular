import { ErrorHandler } from '@angular/core';

export class DummyErrorHandler extends ErrorHandler {
    handleError(error: any): void {
        console.error(error);
    }
}
