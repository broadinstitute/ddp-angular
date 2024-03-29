import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractionGroup } from '../abstraction-group/abstraction-group.model';
import { ActivityData } from '../activity-data/activity-data.model';
import { ActivityDefinition } from '../activity-data/models/activity-definition.model';
import { Group } from '../activity-data/models/group.model';
import { OptionDetail } from '../activity-data/models/option-detail.model';
import { Option } from '../activity-data/models/option.model';
import { QuestionAnswer } from '../activity-data/models/question-answer.model';
import { QuestionDefinition } from '../activity-data/models/question-definition.model';
import { FieldSettings } from '../field-settings/field-settings.model';
import { Filter } from '../filter-column/filter-column.model';
import { AbstractionField } from '../medical-record-abstraction/model/medical-record-abstraction-field.model';
import { Participant } from '../participant-list/participant-list.model';
import { NameValue } from './name-value.model';
import { AnswerValue } from '../../../../ddp-sdk/src/lib/models/activity/answerValue';

const fileSaver = require('file-saver');
const Json2csvParser = require('json2csv').Parser;

@Injectable()
export class Utils {
  // methods which might be useful for other components as well

  static PARTIAL_DATE_STRING = 'yyyy-MM';
  static DATE_STRING = 'yyyy-MM-dd';
  static DATE_STRING_CVS = 'MMddyy';
  static DATE_STRING_IN_CVS = 'MM/dd/yyyy';
  static DATE_STRING_IN_CVS_WITH_TIME = 'MM/dd/yyyy hh:mm:ss a';
  static DATE_STRING_IN_EVENT_CVS = 'MMM dd, yyyy, hh:mm:ss a';
  static DATE_PARTIAL = 'partial date';
  static COMMA = ',';
  static EMPTY_STRING_CSV = '""';
  static DATA = 'data';
  static PROFILE = 'profile';

  YES = 'Yes';
  NO = 'No';

  public static getFormattedDate(date: Date): string {
    return Utils.getDateFormatted(date, Utils.DATE_STRING);
  }

  public static getDateFormatted(date: Date, format: string): string {
    if (date instanceof Date && !isNaN(date.getTime())) {
      if (format != null) {
        return new DatePipe('en-US').transform(date, format);
      }
      return new DatePipe('en-US').transform(date, Utils.DATE_STRING_IN_CVS);
    }
    if (date != null) {
      return date.toString();
    }
    return '';
  }

  // used to get db saved date string (yyyy-MM-dd) as date
  public static getDate(dateString: string): Date {
    if (dateString.indexOf('-') > 0) {
      const dateParts: string[] = dateString.split('-');
      if (dateParts.length === 3) {
        return new Date(Number(dateParts[ 0 ]), Number(dateParts[ 1 ]) - 1, Number(dateParts[ 2 ]));
      }
    }
    return null;
  }

  // used to change db saved date (yyyy-MM) to user format
  public static getPartialFormatDate(dateString: string, format: string): string {
    if (Utils.DATE_STRING === format) {
      return dateString;
    } else if (Utils.DATE_STRING_IN_CVS === format) {
      if (dateString.indexOf('/') > -1) {
        return dateString;
      } else {
        const dateParts: string[] = dateString.split('-');
        return dateParts[ 1 ] + '/' + dateParts[ 0 ];
      }
    }
  }

  public static downloadCurrentData(
    data: any[], paths: any[], columns: {},
    fileName: string, isSurveyData?: boolean, activityDefinitionList?
  ): void {
    let headers = '';
    for (const path of paths) {
      for (let i = 1; i < path.length; i += 2) {
        const source = path[ i ];
        if (columns[ source ] != null) {
          for (const name of columns[ source ]) {
            let headerColumnName = name.participantColumn.display;
            if (isSurveyData) {
              headerColumnName = name.participantColumn.name;
            }
            headers += headerColumnName + ',';
          }
        }
      }
    }
    let csv = this.makeCSV(data, paths, columns, activityDefinitionList);
    csv = headers + '\r\n' + csv;
    const blob = new Blob([ csv ], {type: 'text/csv;charset=utf-8;'});
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    if (navigator.msSaveBlob) { // IE 10+
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  private static makeCSV(data: any[], paths: any[], columns: {}, activityDefinitionList?): string {
    let result = [];
    for (const d of data) {
      let input = [];
      for (const path of paths) {
        let nonDefaultFieldsResultArray: string[] = null;
        const output = this.makeCSVForObjectArray(d, path, columns, 0, activityDefinitionList);
        let temp = [];

        for (let i = 0; i < output.length; i++) {
          if (input.length === output.length) {
            temp.push(input[i] + output[i]);
          } else {
            for (const element of input) {
              temp.push(element + output[i]);
            }
          }
        }

        if (output.length > 1) {
          const resultOutputSplitted = Utils.fillEmptyValuesFromCorrespondingOutputArray(output);
          nonDefaultFieldsResultArray = Utils.mergeDefaultColumnsWithNonDefaultColumns(temp, resultOutputSplitted);
        }

        // for (let o of output) {
        //   for (let i of input) {
        //     temp.push( i + o );
        //   }
        // }
        if (nonDefaultFieldsResultArray) {
          temp = nonDefaultFieldsResultArray;
        } else if (input.length === 0) {
          temp = output;
        }
        input = temp;
      }
      result = result.concat(input);
    }
    const mainStr = result.join('\r\n');
    return mainStr;
  }

  private static fillEmptyValuesFromCorrespondingOutputArray(output: string[]): string[] {
    const resultOutputSplitted = output[0].split(this.COMMA);
    output.slice(1, output.length).forEach(outputArray => {
      const tempOutputArray = outputArray.split(this.COMMA);
      for (let j = 0; j < tempOutputArray.length; j++) {
        if (resultOutputSplitted[j] === this.EMPTY_STRING_CSV) {
          resultOutputSplitted[j] = tempOutputArray[j];
        }
      }
    });
    return resultOutputSplitted;
  }

  private static mergeDefaultColumnsWithNonDefaultColumns(temp: any[], resultOutputSplitted: string[]): string[] {
    const tempSplitted: string[] = temp[0].split(this.COMMA);
    const defaultFields: string[] = tempSplitted.slice(0, tempSplitted.length - resultOutputSplitted.length);
    return [defaultFields.concat(resultOutputSplitted).join(this.COMMA)];
  }

  public static makeCSVForObjectArray(data: object, paths: any[], columns: {}, index: number, activityDefinitionList?): string[] {
    const result: string[] = [];
    if (index > paths.length - 1) {
      return null;
    } else {
      let objects;
      if (!(data[ paths[ index ] ] instanceof Array)) {
        objects = [ data[ paths[ index ] ] ];
      } else {
        objects = data[ paths[ index ] ];
      }
      if (objects != null) {
        for (const o of objects) {
          const oString = this.makeCSVString(o, columns[ paths[ index + 1 ] ], data, activityDefinitionList);
          const a = this.makeCSVForObjectArray(o, paths, columns, index + 2, activityDefinitionList);
          if (a != null && a.length > 0) {
            for (const t of a) {
              result.push(oString + t);
            }
          } else {
            result.push(oString);
          }
        }
        if (objects.length === 0) {
          const oString = this.makeCSVString(null, columns[ paths[ index + 1 ] ]);
          result.push(oString);
        }
      }
      return result;
    }
  }

  private static isColumnNestedInParticipantData( data: Object, paths: any[], index: number ): boolean {
    return Utils.participantDataExists( data, paths, index ) && data[ Utils.DATA ][ paths[ index ] ];
  }

  private static participantDataExists( data: Object, path: any[], index: number ): boolean {
    return data && data[ Utils.DATA ];
  }

  private static isColumnNestedInProfileData( data: Object, columnName: string ): boolean {
    return this.profileDataExists( data ) && data[ Utils.PROFILE ][ columnName ];
  }

  private static profileDataExists( data: Object ): boolean {
    return data && data[ Utils.PROFILE ];
  }

  private static getObjectAdditionalValue(o: object, fieldName: string, column: any): string {
    if (o[ fieldName ] != null) {
      return o[ fieldName ][ column.participantColumn.name ];
    }
    return '';
  }

  private static makeCSVString(o: object, columns: any[], data?: any, activityDefinitionList?): string {
    let str = '';
    let col: Filter;
    if (columns != null) {
      if (o != null) {
        for (col of columns) {
          if(!col.searchable){
            const value = col.func(data,  activityDefinitionList);
            str = str + '"' + value + '"' + ',';
          }
          else if (col.type === 'ADDITIONALVALUE') {
            const fieldName = 'additionalValuesJson';
            // TODO: check is it correct ? - `fieldName` is set on the previous line
            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            if (fieldName !== '') {
              let value = this.getObjectAdditionalValue(o, fieldName, col);
              value = value == null ? '' : value.toString();
              value.replace('\\n', ' ');
              str = str + '"' + value + '"' + ',';
            }
          } else if (
            col.participantColumn.object != null
            && col.participantColumn.object === 'final'
            && o instanceof AbstractionGroup && col.participantColumn.tableAlias === o[ 'abstractionGroupId' ].toString()
          ) {
            if (o[ 'fields' ] != null && o[ 'fields' ] instanceof Array) {
              const abstractionField: AbstractionField = o[ 'fields' ].find(field =>
                field.medicalRecordAbstractionFieldId.toString() === col.participantColumn.name
              );
              if (abstractionField != null && abstractionField.fieldValue != null) {
                let value = abstractionField.fieldValue.value;
                value = value == null ? '' : value.toString();
                if (value !== '') {
                  let tmp = '';
                  const multiObject: any[] = this.getMultiObjects(value);
                  multiObject.forEach((object) => {
                    const keys: string[] = this.getMultiKeys(object);
                    keys.forEach((key) => {
                      if (key === 'other') {
                        object[ key ].forEach((oV) => {
                          const otherKeys: string[] = this.getMultiKeys(oV);
                          otherKeys.forEach((otherKey) => {
                            const tmp2 = oV[ otherKey ] == null ? '' : oV[ otherKey ];
                            tmp = tmp + 'Other - ' + otherKey + ': ' + tmp2 + ' ';
                          });
                        });
                      } else {
                        if (this.isDateValue(object[ key ])) {
                          const tmp2 = this.getDateValue(object[ key ]) == null ? '' : this.getDateValue(object[ key ]);
                          tmp = tmp + key + ': ' + tmp2 + ' ';
                        } else {
                          const tmp2 = object[ key ] == null ? '' : object[ key ];
                          tmp = tmp + key + ': ' + tmp2 + ' ';
                        }
                      }
                    });
                  });
                  if (tmp !== undefined && tmp !== null && tmp !== '') {
                    value = tmp.trim();
                    value.replace('\\n', ' ');
                  }
                }
                str = str + '"' + value + '"' + ','; // TODO make answer pretty
              }
            }
          } else {
            let value = null;
            if (Utils.isColumnNestedInProfileData( o, col.participantColumn.name )) {
              value = o[ Utils.PROFILE ][ col.participantColumn.name ];
            }
            else {
              value = o[ col.participantColumn.name ];
            }
            if (col.participantColumn.object != null && o[ col.participantColumn.object ] != null) {
              value = o[ col.participantColumn.object ][ col.participantColumn.name ];
            } else if (o['data'] && o['data'][col.participantColumn.name]) {
              value = o['data'][col.participantColumn.name];
            }
            if (col.type === Filter.DATE_TYPE) {
              if (!value) {
                value = '';
              } else {
                value = this.getDateFormatted(new Date(value), Utils.DATE_STRING_IN_CVS);
              }
            }
            value = value == null ? '' : value.toString();
            value.replace('\\n', ' ');
            str = str + '"' + value + '"' + ',';
          }
        }
      } else {
        for (col of columns) {
          let value = '';
          if (data != null) {
            // check for survey data
            const activityDataArray: ActivityData[] = this.getSurveyData( data, col.participantColumn.tableAlias );
            if (activityDataArray != null) {
              if (activityDataArray.length === 1) {
                const activityData = activityDataArray[ 0 ];
                if (( col.participantColumn.name === 'createdAt' || col.participantColumn.name === 'completedAt'
                  || col.participantColumn.name === 'lastUpdatedAt' ) && activityData[ col.participantColumn.name ] != null) {
                  value = this.getDateFormatted( new Date( activityData[ col.participantColumn.name ] ), this.DATE_STRING_IN_CVS );
                }
                else if (col.participantColumn.name === 'status' && activityData[ col.participantColumn.name ] != null) {
                  value = activityData[ col.participantColumn.name ];
                }
                else {
                  // eslint-disable-next-line max-len
                  const questionAnswer: QuestionAnswer = this.getQuestionAnswerByName( activityData.questionsAnswers, col.participantColumn.name );
                  value += this.getTextForQuestionAnswer(questionAnswer, col, activityDefinitionList, activityData);
                }
              }
              else {
                // eslint-disable-next-line max-len
                value = this.getActivityValueForMultipleActivities( activityDataArray, col.participantColumn.name, activityDefinitionList, col );
              }
            } else if (col.participantColumn.tableAlias === 'invitations') {
              if (data?.data != null && data.data.invitations != null) {
                let tmp = '';
                data.data.invitations.forEach((invite) => {
                  if (col.type === Filter.DATE_TYPE) {
                    tmp = tmp + ' ' + invite[ col.participantColumn.name ] == null ?
                      '' : this.getDateFormatted(new Date(invite[ col.participantColumn.name ]), this.DATE_STRING_IN_CVS);
                  } else if (col.participantColumn.name === 'guid') {
                    tmp = tmp + ' ' + invite[ col.participantColumn.name ] == null ? '' : invite[ col.participantColumn.name ].match(/.{1,4}/g).join('-');
                  } else {
                    tmp = tmp + ' ' + invite[ col.participantColumn.name ] == null ? '' : invite[ col.participantColumn.name ];
                  }
                });
                if (tmp !== undefined && tmp !== null && tmp !== '') {
                  value = tmp.trim();
                  value.replace('\\n', ' ');
                }
              }
            }
          }
          str = str + '"' + value + '"' + ',';
        }
      }
    }
    return str;
  }

  public static getSurveyData(participant: Participant, code: string): any[] | null {
    const array = [];
    if (participant != null && participant.data != null && participant.data.activities != null) {
      for (const x of participant.data.activities) {
        if (x.activityCode === code) {
          array.push( x );
        }
      }
      return array;
    }
    return null;
  }

  public static getQuestionAnswerByName(questionsAnswers: Array<QuestionAnswer>, name: string): QuestionAnswer | undefined {
    return questionsAnswers.find(x => x.stableId === name);
  }

  public static getMultiObjects(fieldValue: string | string[]): any {
    if (!(fieldValue instanceof Array)) {
      return JSON.parse(fieldValue);
    }
    return null;
  }

  public static getMultiKeys(o: any): string[] | null {
    if (o != null) {
      return Object.keys(o);
    }
    return null;
  }

  public static isDateValue(value: string): boolean {
    return value != null
      && typeof value === 'string'
      && value.indexOf('dateString') > -1
      && value.indexOf('est') > -1;
  }

  public static getDateValue(value: string): string {
    if (value != null) {
      const o: any = JSON.parse(value);
      return o[ 'dateString' ];
    }
    return '';
  }

  public static createCSV(fields: any[], dataArray: Array<any>, fileName: string): void {
    const json2csvParser = new Json2csvParser({fields});
    const csv = json2csvParser.parse(dataArray);
    Utils.fileSaverCreateCSV(fileName, csv);
  }

  public static fileSaverCreateCSV(fileName: string, csv: any): void {
    const data = new Blob([ csv ], {type: 'text/plain;charset=utf-8'});
    fileSaver.saveAs(data, fileName);
  }

  public static parseDate(dateString: string | undefined, format: string, allowUnknownDay: boolean): string | Date {
    if (dateString !== null && format !== null && dateString !== undefined) {
      let dateParts: string[] = null;
      if (Utils.DATE_STRING_IN_CVS === format) {
        dateParts = dateString.split('/');
        if (dateParts.length === 3) {
          return this.changePartialYearTo2000(dateParts[ 2 ], dateParts[ 0 ], dateParts[ 1 ]);
        } else if (allowUnknownDay && dateParts.length === 2) {
          if (dateParts[ 1 ].length === 4 && dateParts[ 0 ].length < 3) {
            if (Number(dateParts[ 0 ]) > -1 && Number(dateParts[ 0 ]) <= 12) {
              return Utils.DATE_PARTIAL;
            }
          }
        } else if (allowUnknownDay && dateParts.length === 1) {
          if (dateParts[ 0 ].length === 4) {
            return Utils.DATE_PARTIAL;
          }
        }
      } else if (Utils.DATE_STRING === format) {
        dateParts = dateString.split('-');
        if (dateParts.length === 3) {
          return this.changePartialYearTo2000(dateParts[ 0 ], dateParts[ 1 ], dateParts[ 2 ]);
        } else if (allowUnknownDay && dateParts.length === 2) {
          if (dateParts[ 0 ].length === 4 && dateParts[ 1 ].length < 3) {
            if (Number(dateParts[ 1 ]) > -1 && Number(dateParts[ 1 ]) <= 12) {
              return Utils.DATE_PARTIAL;
            }
          }
        } else if (allowUnknownDay && dateParts.length === 1) {
          if (dateParts[ 0 ].length === 4) {
            return Utils.DATE_PARTIAL;
          }
        }
      }
    }
    return null;
  }

  private static changePartialYearTo2000(year: string, month: string, day: string): Date {
    if (year.length < 2) {
      return new Date(Number('200' + year), Number(month) - 1, Number(day));
    } else if (year.length < 3) {
      return new Date(Number('20' + year), Number(month) - 1, Number(day));
    } else if (year.length < 4) {
      return new Date(Number('2' + year), Number(month) - 1, Number(day));
    } else {
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  public static getPartialDateFormatted(dateString: string , format: string): string {
    if (format != null) {
      let dateParts: string[] = null;
      if (Utils.DATE_STRING_IN_CVS === format) {
        dateParts = dateString.split('/');
        if (dateParts.length === 2) {
          if (dateParts[ 1 ].length === 4 && dateParts[ 0 ].length < 3) {
            if (Number(dateParts[ 0 ]) > -1 && Number(dateParts[ 0 ]) <= 12) {
              return dateParts[ 1 ] + '-' + dateParts[ 0 ];
            }
          }
        } else if (dateParts.length === 1) {
          if (dateParts[ 0 ].length === 4) {
            return dateParts[ 0 ];
          }
        }
      } else if (Utils.DATE_STRING === format) {
        dateParts = dateString.split('-');
        if (dateParts.length === 2) {
          if (dateParts[ 0 ].length === 4 && dateParts[ 1 ].length < 3) {
            if (Number(dateParts[ 1 ]) > -1 && Number(dateParts[ 1 ]) <= 12) {
              return dateString;
            }
          }
        } else if (dateParts.length === 1) {
          if (dateParts[ 0 ].length === 4) {
            return dateParts[ 0 ];
          }
        }
      }
    }
    return null;
  }

  public static getActivityDataValues(fieldSetting: FieldSettings, participant: Participant,
                                      activityDefinitions: ActivityDefinition[]): string {
    if (
      fieldSetting != null
      && fieldSetting.possibleValues != null
      && fieldSetting.possibleValues[0] != null
      && fieldSetting.possibleValues[0].value != null
    ) {
      const tmp: string[] = fieldSetting.possibleValues[ 0 ].value.split('.');
      if (tmp != null && tmp.length > 1) {
        if (tmp[ 0 ] === 'profile') {
          return participant.data.profile[tmp[1]];
        } else {
          if (participant != null && participant.data != null && participant.data.activities != null) {
            const activity: ActivityData = participant.data.activities.find(a => a.activityCode === tmp[ 0 ]);
            if (activity != null && activity.questionsAnswers != null) {
              const questionAnswer = activity.questionsAnswers.find(qAnswer => qAnswer.stableId === tmp[ 1 ]);
              if (questionAnswer != null) {
                if (tmp.length === 2) {
                  if (typeof questionAnswer.answer === 'boolean') {
                    if (questionAnswer.answer) {
                      return 'Yes';
                    }
                    return 'No';
                  }
                  if (questionAnswer.answer instanceof Array) {
                    return questionAnswer.answer[0];
                  }
                  return questionAnswer.answer;
                } else if (tmp.length === 3) {
                  if (
                    fieldSetting.possibleValues != null
                    && fieldSetting.possibleValues[ 0 ] != null
                    && fieldSetting.possibleValues[ 0 ].type != null
                    && fieldSetting.possibleValues[ 0 ].type === 'RADIO'
                  ) {
                    if (questionAnswer.answer != null) {
                      const found = questionAnswer.answer.find(answer => answer === tmp[ 2 ]);
                      if (found != null) {
                        return 'Yes';
                      }
                      return 'No';
                    }
                  } else if (activityDefinitions != null) {
                    const definition: ActivityDefinition = activityDefinitions.find(def => def.activityCode === tmp[ 0 ]);
                    if (definition != null && definition.questions != null) {
                      const question = definition.questions.find(q => q.stableId === tmp[ 1 ]);
                      if (question != null && question.childQuestions != null) {
                        for (let i = 0; i < question.childQuestions.length; i++) {
                          if (
                            question.childQuestions[ i ] != null
                            && question.childQuestions[ i ].stableId === tmp[ 2 ]
                            && questionAnswer.answer[ 0 ][ i ] != null
                          ) {
                            return questionAnswer.answer[ 0 ][ i ];
                          }
                        }
                      } else if (question != null && question.options != null) {
                        // TODO: check is it correct ? - is it needed ?
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return '';
  }

  public getDateFormatted(str): string {
    return Utils.getDateFormatted(this.getNiceUserDate(str), Utils.DATE_STRING_IN_CVS);
  }

  public getYesNo(value: any): string {
    if (value != null) {
      if (value === 1 || value === '1' || value === 'true' || value) {
        return this.YES;
      } else {
        return this.NO;
      }
    }
    return '-';
  }

  // get date of string
  public getNiceUserDate(dateString: string): Date {
    if (dateString != null && typeof dateString === 'string' && dateString.indexOf('-') > 0) {
      const dateParts: string[] = dateString.split('-');
      if (dateParts.length === 3) {
        let check: Date = null;
        if (dateParts[ 0 ].length === 4) {
          check = new Date(Number(dateParts[ 0 ]), Number(dateParts[ 1 ]) - 1, Number(dateParts[ 2 ]));
        } else if (dateParts[ 2 ].length === 4) {
          check = new Date(Number(dateParts[ 2 ]), Number(dateParts[ 0 ]) - 1, Number(dateParts[ 1 ]));
        }
        if (check != null && !isNaN(check.getTime())) {
          return check;
        }
      } else if (dateParts.length === 2) {
        const check: Date = new Date(Number(dateParts[ 0 ]), Number(dateParts[ 1 ]) - 1);
        if (!isNaN(check.getTime())) {
          return check;
        }
      }
    } else {
      const check: Date = new Date(Number(dateString));
      if (!isNaN(check.getTime())) {
        return check;
      }
    }
    return null;
  }


  public getNameValue(nameValues: Array<NameValue>, text: string): string {
    const nameValue = nameValues.find(x => x.name === text);
    if (nameValue != null) {
      return nameValue.value;
    }
    return '';
  }

  isGroupSelected(selected: Array<string>, group: Group): string {
    return selected.find(answer => group.groupStableId === answer);
  }

  getAnswerText(groupAnswer: string, options: Array<Option>): Option {
    return options.find(option => option.optionStableId === groupAnswer);
  }

  static getAnswerGroupOrOptionText(answer: any, qdef: QuestionDefinition): string {
    if (answer instanceof Array) {
      answer = answer[ 0 ];
    }
    let text = answer;
    let ans;
    if (qdef?.groups?.length > 0) {
      loop1: for (const group of qdef.groups) {
        if(group.groupStableId === answer){
          ans = group.groupText;
          break loop1;
        }
        for (const g of group.options) {
          if (g.optionStableId === answer) {
            ans = g.optionText;
            break loop1;
          }
        }
      }
      if (ans) {
        text = ans;
      }
    }
    if (!ans && qdef?.options?.length > 0) {
      // TODO: check is it correct ? shadow variable 'ans'
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const ans = qdef.options.find( option => option.optionStableId === answer );
      if (ans) {
        text = ans.optionText || ans.optionStableId;
      }
    }
    return text;
  }

  static getNestedOptionText( answer: any, qdef: QuestionDefinition, nestedOption ): string {
    if (answer instanceof Array) {
      answer = answer[ 0 ];
    }
    const text = answer;
    let ans;
    if (qdef?.options) {
      const option = qdef.options.find( opt => opt.optionStableId === answer );
      if (option) {
        const ne = option.nestedOptions.find( o => o.optionStableId === nestedOption );
        ans = ne.optionText;
      }
    }
    if (ans) {
      return ans;
    }
    return text;
  }

  isOptionSelected(selected: Array<string>, optionStableId: string): string {
    return selected.find(x => x === optionStableId);
  }


  static getOptionDetails(optionDetails: Array<OptionDetail>, stableId: string): OptionDetail {
    return optionDetails.find(x => x.option === stableId);
  }

  static getQuestionDefinition(activities: Array<ActivityDefinition>, activity: string,
                               stableId: string, version: string): QuestionDefinition {
    const questions = activities?.find(x => x.activityCode === activity && x.activityVersion === version).questions;
    if (questions != null) {
      return questions.find(x => x.stableId === stableId);
    }
    return null;
  }

  static getActivityDefinition( activities: ActivityDefinition[], activityCode: string, version: string ): ActivityDefinition{
    return  activities?.find( x => x.activityCode === activityCode && x.activityVersion === version );
  }

  static getFilteredActivityDefinitions( activities: ActivityDefinition[], activityCode: string, version: string ): ActivityDefinition[] {
    return  activities?.filter( x => x.activityCode === activityCode && x.activityVersion === version );
  }

  getAbstractionGroup(groups: Array<AbstractionGroup>, groupId: string): AbstractionGroup | undefined {
    return groups.find(x => x.abstractionGroupId.toString() === groupId);
  }

  getAbstractionField(fields: Array<AbstractionField>, fieldId: string): AbstractionField | undefined {
    return fields.find(x => x.medicalRecordAbstractionFieldId.toString() === fieldId);
  }

  public maxDate(): Date {
    return new Date();
  }

  // breaking change after Angular update to v.10
  // Instead of passing a validating function,
  // we should now pass a class instance (object) of type ErrorStateMatcher
  // that has an isErrorState method.
  // See https://github.com/angular/components/issues/7694
  phoneNumberValidator(): ErrorStateMatcher {
    return {
      isErrorState: (control: FormControl | null) => {
        if (control?.value) {
          return !(control.value.match(/^\d{3}-\d{3}-\d{4}$/));
        }

        return false;
      }
    };
  }

  private static getTextForQuestionAnswer(questionAnswer: QuestionAnswer, col, activityDefinitionList, activityData): string {
    let value = '';
    if (questionAnswer != null) {
      const qDef: QuestionDefinition = Utils.getQuestionDefinition(
        activityDefinitionList, col.participantColumn.tableAlias,
        questionAnswer.stableId, activityData.activityVersion
      );
      if (col.type === Filter.DATE_TYPE) {
        value += this.getDateFormatted( new Date( questionAnswer.date ), this.DATE_STRING_IN_CVS ) + ', ';
      }
      else if (col.type === Filter.COMPOSITE_TYPE) {
        const answers = Utils.getNiceTextForCSVCompositeType( questionAnswer, qDef );
        answers.forEach( ans => value += ( ans + ', ' ) + '\n' );
      }
      else {
        const answers = Utils.getCorrectTextAsAnswerForCSV( questionAnswer, qDef );
        answers.forEach( ans => value += ans + '\n' );
      }
    }
    return value;
  }


  private static getActivityValueForMultipleActivities(activityDataArray: ActivityData[], name: string,
                                                       activityDefinitionList: any, col ): string {
    let value = '';
    for (const activityData of activityDataArray) {
      for (const questionsAnswer of activityData.questionsAnswers) {
        if (questionsAnswer.stableId === name) {
          value += this.getTextForQuestionAnswer(questionsAnswer, col, activityDefinitionList, activityData);
        }
      }
      value += '\n';
    }
    return value;
  }

  public static getCorrectTextAsAnswerForCSV( questionAnswer: QuestionAnswer, qDef: QuestionDefinition ): string[] {
    const answers = [];
    let probableAnswer = questionAnswer.answer;
    if (!(questionAnswer.answer instanceof Array)){
      probableAnswer = [];
      probableAnswer.push(questionAnswer.answer);
    }
    for (let answer of probableAnswer) {
      let text = answer;
      let activityAnswers = '';
      const ans = this.getAnswerGroupOrOptionText( answer, qDef );
      if (ans) {
        text = ans;
      }
      activityAnswers += text ;
      if (answer instanceof Array) {
        answer = answer[ 0 ];
      }
      if ((questionAnswer.groupedOptions || questionAnswer.nestedOptions) &&
        (questionAnswer.groupedOptions[ answer ] || questionAnswer.nestedOptions[ answer ])
      ) {
        activityAnswers += '(';
        // TODO: check is it correct ? shadow variable 'ans'
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const ans = questionAnswer.groupedOptions[ answer ];
        if (ans) {
          for (const a of ans) {
            activityAnswers +=  this.getAnswerGroupOrOptionText( a, qDef ) + ',';
          }
        }

        if (questionAnswer.nestedOptions[ answer ]) {
          for (const nestedOption of questionAnswer.nestedOptions[ answer ]) {
            const nestedOptionText = this.getNestedOptionText( answer, qDef, nestedOption );
            if (nestedOptionText && nestedOptionText.length > 0) {
              activityAnswers += nestedOptionText + ',';
            }
          }
        }
        activityAnswers += '),';
      }
      if (questionAnswer.optionDetails) {

        const freeText = this.getOptionDetails( questionAnswer.optionDetails, answer );
        if (freeText) {
          activityAnswers += '(';
          activityAnswers += freeText.details;
          activityAnswers += '),';
        }

      }
      if (activityAnswers.lastIndexOf( ',' ) === activityAnswers.length - 1) {
        activityAnswers = activityAnswers.substring( 0, activityAnswers.length - 1 );
      }
      activityAnswers += '\n';
      answers.push( activityAnswers );
    }
    return answers;
  }

  private static getAnswer( answer: AnswerValue, qdef: QuestionDefinition ): string {
    const text = answer;
    let ans;
    if (qdef?.childQuestions) {
      loop1: for (const childq of qdef.childQuestions) {
        if (childq.groups) {
          for (const g of childq.groups) {
            for (const option of g.options) {
              if (option.optionStableId === answer) {
                ans = option.optionText;
                break loop1;
              }
            }
          }
        }
        if (!ans && childq.options) {
          for (const g of childq.options) {
            if (g.optionStableId === answer) {
              ans = g.optionText;
              break loop1;
            }
          }
        }
      }
    }
    if (ans) {
      return ans;
    }
    return typeof text === 'string' ? text : null;
  }

  public static getNiceTextForCSVCompositeType( questionAnswer: QuestionAnswer, qdef: QuestionDefinition ): string[] {
    const answers = [];
    for (const answer of questionAnswer.answer) {
      if (answer instanceof Array) {
        let answerText = '';
        for (const childAnswer of answer) {
          const text = this.getAnswer(childAnswer, qdef);
          if (text) {
            answerText += text + ' ';
          }
        }
        answers.push(answerText);
      } else {
        const text = this.getAnswer(answer, qdef);
        if (text) {
          answers.push(text);
        }
      }
    }

    return answers;
  }

  getGroupedOptionsForAnswer( activityData: ActivityData, name: any, questionAnswer: any ): string[] {
    const answers: Array<string> = [];
    for (const y of activityData.questionsAnswers) {
      if (y.stableId === name) {
        for (const answer of y.answer) {
          if (answer === questionAnswer) {
            if (y.groupedOptions) {
              const ans = y.groupedOptions[ answer ];
              if (ans) {
                for (const a of ans) {
                  answers.push( a );
                }
              }
            }
          }
        }
      }
    }
    return answers.reverse();
  }

  public static convertUnderScoresToCamelCase(colName: string): string {
    let camelCaseColumnName = '';
    const camelCaseRegex = new RegExp('[a-z]{1,}([A-Z][a-z]{1,}){1,}');
    let splittedWords = colName.split('_');
    if (splittedWords.length === 1) {
      camelCaseColumnName = camelCaseRegex.test(splittedWords[0]) ? splittedWords[0] : splittedWords[0].toLowerCase();
    } else {
      splittedWords = splittedWords.map(word => word.toLowerCase());
      for (let i = 0; i < splittedWords.length; i++) {
        if (i === 0) {
          camelCaseColumnName += splittedWords[i].toLowerCase();
        } else {
          const word = splittedWords[i][0].toUpperCase() + splittedWords[i].substring(1);
          camelCaseColumnName += word;
        }
      }
    }
    return camelCaseColumnName;
  }

  public static getLongDateFormatted( value: number ): string {
    if (!value || value === 0) {
      return '';
    }
    const date = new Date( value );
    return new DatePipe( 'en-US' ).transform( date, Utils.DATE_STRING_IN_CVS );
  }

  public static getNiceDateFormat( uploadedAt: string ): string {
    return new DatePipe( 'en-US' ).transform( uploadedAt, Utils.DATE_STRING_IN_CVS_WITH_TIME );
  }
}
