export class DummyLoggingService {
    logError(...args: any): void {
        console.error(args.join(', '));
    }
    logEvent(...args: any): void {
        console.log(args.join(', '));
    }
}
