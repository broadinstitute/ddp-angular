import { logInfo } from './log-utils';

export function dateFormat(timeZone?: string): Intl.DateTimeFormat {
  return timeZone
    ? new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        timeZone
    })
    : new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });
}

/**
 * Returns local today's date in "mm/dd/yyyy" format
 */
export function getToday(): string {
  const today = new Date();
  const formatToday =
    `${today.toLocaleString('en-US', { month: '2-digit' })}/` +
    `${today.toLocaleString('en-US', { day: '2-digit' })}/` +
    `${today.toLocaleString('en-US', { year: 'numeric' })}`;
  // console.log(`Today is ${formatToday}`);
  return formatToday;
}

const normalizeDate = function() {
  const today = new Date(); // returns the date in UTC time
  today.setMinutes(today.getMinutes() + today.getTimezoneOffset()); // local date
  return today;
};

/**
 * Returns a given date in "mm/dd/yyyy" format
 * @param {Date} date
 * @returns {string}
 */
export function getDate(date?: Date): string {
  return dateFormat().format(date ? date : normalizeDate());
}

export function getTodayInTimezone(timezone: string): string {
  return dateFormat(timezone).format(new Date());
}

/**
 * Returns a given date in "Month DD, YYYY" format
 * @param dateString The date to format into Month DD, YYYY e.g. turn '11/29/2023' into 'Nov 29, 2023'
 * @returns Newly formated date as a string
 */
export function getDateMonthAbbreviated(dateString: string): string {
  const kitDateFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat('en-US', kitDateFormat).format(date);
  logInfo(`Formatted date in Month DD, YYYY format: ${formattedDate}`);
  return formattedDate;
}

/**
 * Turns the given date string into YYYY-MM-DD format and returns it
 * @param dateString The date to be formatted into ISo format i.e. YYYY-MM-DD format
 */
export function getDateinISOFormat(dateString: string): string {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-CA');
  logInfo(`Date formatted in YYYY-MM-DD format: ${formattedDate}`);
  return formattedDate;
}

export function getDateEasternTimeZone(date?: Date): string {
  return dateFormat('America/New_York').format(date ? date : new Date());
}

export function toLocalTime(date?: string, timeZone?: string): string {
  return date
    ? new Date(date).toLocaleTimeString('en-US', {timeZone})
    : new Date().toLocaleTimeString('en-US', {timeZone});
}

// convert local date to UTC date
export function getUtcDate(date?: Date): string {
  const utc = new Date(date ? date : new Date().toUTCString());
  const day = (`0${utc.getUTCDate()}`).slice(-2);
  const month = (`0${utc.getUTCMonth() + 1}`).slice(-2);
  return `${month}/${day}/${utc.getFullYear()}`; // mm/dd/yyyy
}

export function mailingListCreatedDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(date);
}

/*
 * Date substring in Mailing list download filename
 * Returns today date in mmddyy format. E.g. 050323
 */
export function getMailingListDownloadedFileDate(): string {
  const date = new Date();
  const year = date.toLocaleString('default', { year: '2-digit' });
  const month = date.toLocaleString('default', { month: '2-digit' });
  const day = date.toLocaleString('default', { day: '2-digit' });
  return `${month}${day}${year}`
}

export function offsetDaysFromToday(number = 1, opts: { isAdd?: boolean } = {}): Date {
  const { isAdd = false } = opts;
  const today = new Date();
  if (isAdd) {
    today.setDate(today.getDate() + number);
  } else {
    today.setDate(today.getDate() - number);
  }
  return today;
}

export function offsetDaysFromDate(date: Date, number = 1, opts: { isAdd?: boolean } = {}): Date {
  const { isAdd = false } = opts;
  if (isAdd) {
    return new Date(date.setDate(date.getDate() + number));
  }
  return new Date(date.setDate(date.getDate() - number));
}

export const calculateAge = (month: string, day: string, year: string): number => {
  const dateOfBirth = new Date(Number(year), Number(month), Number(day));
  const today = new Date();

  let resultAge = today.getFullYear() - dateOfBirth.getFullYear();
  const resultMonth = (today.getMonth() + 1) - dateOfBirth.getMonth(); //getMonth() is zero-based

  //Adjust age result depending on if birthday has not yet occurred for the year
  if (resultMonth < 0 || (resultMonth === 0 && today.getDate() < dateOfBirth.getDate())) {
    resultAge--;
  }

  return resultAge;
};
