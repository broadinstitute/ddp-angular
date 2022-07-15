import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ISO8601DateFormat} from '../constants/date-formats';
import {AddPatientModel} from '../models/addPatient.model';

@Injectable()
export class PatientsService {
  readonly STUDY = 'fon';

  constructor(private datePipe: DatePipe) {}

  public generatePatientInfo({
                               email,
                               studyGuid,
                               firstName,
                               lastName,
                               birthDate,
                               consentDate,
                               centerId,
                               assentDate
                             }: Partial<AddPatientModel>): AddPatientModel {

    return {
      email,
      studyGuid: this.STUDY || studyGuid,
      firstName,
      lastName,
      centerId,
      birthDate: this.formatToISO8601date(birthDate),
      consentDate: this.formatToISO8601date(consentDate),
      assentDate: this.formatToISO8601date(assentDate),
    };
  }

  public formatToISO8601date(value: Date | string): string | null {
    return value ? this.datePipe.transform(value, ISO8601DateFormat) : null;
  }
}
