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
 * Returns a date with format mm/dd/yyyy
 * @param {Date} date
 * @returns {string}
 */
export function getDate(date?: Date): string {
  return dateFormat().format(date ? date : new Date());
}

export function getDateEasternTimeZone(date?: Date): string {
  return dateFormat('America/New_York').format(date ? date : new Date());
}

export function getUtcDate(): string {
  const utc = new Date(new Date().toUTCString());
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

export const calculateAge = (month: string, day: string, year: string): number => {
  const dateOfBirth = new Date(Number(year), Number(month), Number(day));
  const today = new Date();

  let resultAge = today.getFullYear() - dateOfBirth.getFullYear();
  const resultMonth = today.getMonth() - dateOfBirth.getMonth();

  //Adjust age result depending on if birthday has not yet occurred for the year
  if (resultMonth < 0 || (resultMonth === 0 && today.getDate() < dateOfBirth.getDate())) {
    resultAge--;
  }

  return resultAge;
};
