import {Injectable} from "@angular/core";
import {DatePipe} from "@angular/common";
import {ISO8601DateFormat} from "../constants/date-formats";
import {AddPatientModel} from "../models/addPatient.model";

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
                               informedConsentDate,
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
      informedConsentDate: this.formatToISO8601date(informedConsentDate),
      assentDate: this.formatToISO8601date(assentDate),
    }
  }

  public formatToISO8601date(value: Date | string): string {
    return value ? this.datePipe.transform(value, ISO8601DateFormat) : '';
  }
}
