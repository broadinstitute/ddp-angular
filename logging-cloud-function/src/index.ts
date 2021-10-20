import * as express from 'express';
import { HttpFunction } from '@google-cloud/functions-framework';
import { LogEntry } from './model/logEntry';
import { Entry } from '@google-cloud/logging/build/src';

const {Logging} = require('@google-cloud/logging');
const DEFAULT_PROJECT_ID ='broad-ddp-dev';

const projectId = process.env.GCP_PROJECT ? process.env.GCP_PROJECT : DEFAULT_PROJECT_ID;

// Creates a client
const loggingClient = new Logging({projectId});

// Selects the log to write to
const log = loggingClient.log('something');

export const logMessage:  HttpFunction = (req: express.Request, res: express.Response) => {
    res.header('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Max-Age', '3600');
        res.status(204).send();
        return;
    }

    if (req.body) { 
        let entry: LogEntry;
        try {
            entry = new LogEntry(projectId, req.body);
        } catch(error) {
            console.error("Could not process log entry: %o", req.body);
            res.status(400).send(error);
            return;
        }
        log.write(new Entry(entry.toGoogleEntryMetadata()))
            .catch((error: any) => {
                console.error("Could not write to log: %o", error);
            });
        res.status(204).send();
    }
};

