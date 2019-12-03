import { LogLevel } from './logLevel';

export class LogEvent {
    constructor(public level: LogLevel, public message: string, public context: string) { }
}
