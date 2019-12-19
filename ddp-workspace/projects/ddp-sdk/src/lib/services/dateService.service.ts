import { Injectable } from '@angular/core';

@Injectable()
export class DateService {
    public checkExistingDate(year: number, month: number, day: number): boolean { // year, month and day should be numbers
        if (year < 1 || month < 1 || day < 1) {
            return false;
        }

        // months are intended from 1 to 12
        const months31 = [1, 3, 5, 7, 8, 10, 12]; // months with 31 days
        const months30 = [4, 6, 9, 11]; // months with 30 days
        const months28 = [2]; // the only month with 28 days (29 if year isLeap)

        const isLeap = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);

        const valid = (months31.indexOf(month) !== -1 && day <= 31) || (months30.indexOf(month) !== -1 && day <= 30) || (months28.indexOf(month) !== -1 && day <= 28) || (months28.indexOf(month) !== -1 && day <= 29 && isLeap);

        return valid; // it returns true or false
    }

    // Helper to parse string into a date object by looking at individual fields,
    // since calling date constructor directly is discouraged.
    public convertDateString(date: string): Date {
        const fields = date.split('-');
        const year = parseInt(fields[0], 10);
        const month = parseInt(fields[1], 10) - 1;
        const day = parseInt(fields[2], 10);
        return new Date(year, month, day);
    }
}
