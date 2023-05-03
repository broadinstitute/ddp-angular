/**
 * Returns a date with format mm/dd/yyyy
 * @param {Date} date
 * @returns {string}
 */
export function getDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }).format(date);
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
