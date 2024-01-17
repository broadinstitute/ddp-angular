import fs from 'fs';
import csv from 'csv-parser';
import { logError, logInfo } from 'utils/log-utils';
import admZip from 'adm-zip';

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

export function tabDelimitedString(data: string[]): string {
  const tabDelimited = data.join('\t');
  return tabDelimited;
}

export function unzip(filepath: string, targetFilePath: string): string[] {
  const files: string[] = [];
  try {
    const zip = new admZip(filepath);
    zip.extractAllTo(targetFilePath);
    for (const zipEntry of zip.getEntries()) {
      // console.log(zipEntry.toString()); // uncomment for debug
      files.push(zipEntry.name);
    }
  } catch (err) {
    console.error(`Error upzip file: ${filepath}`);
    throw new Error(`${err}`);
  }
  return files;
}
