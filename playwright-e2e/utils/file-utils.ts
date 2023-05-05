import fs from 'fs';

export function crateTextFileSync(pathName: string, data: string) {
  try {
    fs.writeFileSync(pathName, data);
    console.log(`File: ${pathName} - created successfully`)
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function deleteFileSync(pathName: string) {
  try {
    fs.unlinkSync(pathName)
    console.log(`File: ${pathName} - deleted successfully`)
  } catch (error) {
    console.error(error);
    throw error;
  }
}
