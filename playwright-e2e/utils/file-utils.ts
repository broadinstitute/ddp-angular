import fs from 'fs';
import csv from 'csv-parser';

export interface MailListCSV {
  email: string;
  dateCreated: string;
  firstName?: string;
  lastName?: string;
}

export async function readMailListCSVFile(filePath: string): Promise<MailListCSV[]> {
  const results: MailListCSV[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => resolve(results))
    .on('error', (error) => reject(error));
  });
}
