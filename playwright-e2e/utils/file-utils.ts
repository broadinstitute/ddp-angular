import fs from 'fs';
import csv from 'csv-parser';

export interface MailListCSV {
  email: string;
  dateCreated: string;
  firstName?: string;
  lastName?: string;
}

export function createTextFileSync(pathName: string, data: string) {
  try {
    fs.writeFileSync(pathName, data);
    console.log(`File: ${pathName} - created successfully`)
  } catch (error) {
    console.error(`Couldn't create the File: ${pathName}`);
    throw error;
  }
}

export function deleteFileSync(pathName: string) {
  try {
    fs.unlinkSync(pathName);
    console.log(`File: ${pathName} - deleted successfully`);
  } catch (error) {
    console.error(`Couldn't delete the File: ${pathName}`);
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
