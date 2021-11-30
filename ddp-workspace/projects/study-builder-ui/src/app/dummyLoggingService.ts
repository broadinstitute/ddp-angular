export class DummyLoggingService {
    logError(error: any): void {
        console.error(error);
    }
    logEvent(error: any): void {
        console.log(error);
    }
}
