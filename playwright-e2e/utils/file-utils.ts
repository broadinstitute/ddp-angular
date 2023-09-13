import fs from 'fs';
import csv from 'csv-parser';
import { logError, logInfo } from 'utils/log-utils';
import {Result} from "pdf-parse";
const pdf = require('pdf-parse');


export interface MailListCSV {
  email: string;
  dateCreated: string;
  firstName?: string;
  lastName?: string;
}

export function createTextFileSync(dir: string, pathName: string, data: string) {
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(pathName, data);
    logInfo(`File: ${pathName} - created successfully`)
  } catch (error) {
    logError(`Couldn't create the File: ${pathName}`);
    throw error;
  }
}

export function deleteFileSync(pathName: string) {
  try {
    fs.unlinkSync(pathName);
    logInfo(`File: ${pathName} - deleted successfully`);
  } catch (error) {
    logError(`Couldn't delete the File: ${pathName}`);
    throw error;
  }
}

export async function readMailListCSVFile(filePath: string | null): Promise<MailListCSV[]> {
  if (filePath == null) {
    throw Error('filePath is null');
  }
  const results: MailListCSV[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
    .pipe(csv({ strict: true }))
    .on('data', (data) => results.push(data))
    .on('end', () => resolve(results))
    .on('error', (error) => reject(error));
  });
}

export async function parsePDF(pdfFilePath: string | null): Promise<Result> {
  if (pdfFilePath == null) {
    throw Error('filePath is null');
  }
  let dataBuffer = fs.readFileSync(pdfFilePath);
  return pdf(dataBuffer, {version: "v2.0.550"})
    .catch(() => console.error('Error while parsing pdf. Path: ' + pdfFilePath));
}

