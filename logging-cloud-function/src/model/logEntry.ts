import { LogSeverity } from './logSeverity';
import { isLogEntryHttpRequest, LogEntryHttpRequest } from './logEntryHttpRequest';


export class LogEntry {
    logName: string;
    severity: LogSeverity;
    textPayload: string | Object;
    trace?: string;
    httpRequest?: LogEntryHttpRequest;
    labels?: Record<string,string>;

    constructor(projectId: string, entry: any) {
        if (!entry.logName || typeof entry.logName  !== 'string'
            || !entry.textPayload
            || !entry.severity || !Object.values(LogSeverity).includes(entry.severity)
            || (entry.httpRequest && !isLogEntryHttpRequest(entry.httpRequest))
            || (entry.labels && Object.values(entry.labels).find(val => typeof val !== 'string'))) {
            throw new Error("Invalid body");
        }

        this.logName = `projects/${projectId}/logs/${entry.logName}`;
        this.severity = entry.severity;
        this.textPayload = entry.textPayload;
        this.trace = entry.trace;
        if (entry.httpRequest && isLogEntryHttpRequest(entry.httpRequest)) {
            const req: LogEntryHttpRequest = entry.httpRequest;
            this.httpRequest = {
                requestUrl: req.requestUrl,
                requestMethod: req.requestMethod,
                userAgent: req.userAgent
            };
        }
        if(entry.labels) {
            this.labels = entry.labels;
        }
    }

    toGoogleEntryMetadata(): Object {
        return JSON.parse(JSON.stringify(this));
    }
}
