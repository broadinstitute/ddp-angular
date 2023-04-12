import {UserSetting} from './user-setting.model';
import {Utils} from '../utils/utils';

function validateDefaultValues(settings: UserSetting): void {
  expect(settings).toBeTruthy();
  expect(settings.getRowsPerPage()).toBe(10);
  expect(settings.getRowSet0()).toBe(10);
  expect(settings.getRowSet1()).toBe(25);
  expect(settings.getRowSet2()).toBe(50);
  expect(settings.getDateFormat()).toBe(Utils.DATE_STRING_IN_CVS);
}

describe('UserSetting', ()=> {
  it('should create an instance', () => {
    const defaultConstructorUserSetting =
      new UserSetting(0,
        0,0,0,null,null, null, null);
    validateDefaultValues(defaultConstructorUserSetting);
  });

    it('should create an instance from empty json', () => {
      const userSetting = UserSetting.parse(JSON.parse('{}'));
      validateDefaultValues(userSetting);
    });

    it('should create an instance from rowsOnPage json, with other values as defaults', () => {
      const userSetting = UserSetting.parse(JSON.parse('{"rowsOnPage":13}'));
      expect(userSetting).toBeTruthy();
      expect(userSetting.getRowsPerPage()).toBe(13);
      expect(userSetting.getRowSet0()).toBe(10);
      expect(userSetting.getRowSet1()).toBe(25);
      expect(userSetting.getRowSet2()).toBe(50);
      expect(userSetting.getDateFormat()).toBe(Utils.DATE_STRING_IN_CVS);
    });

    it('should create an instance from json with a date format string, others as defaults', () => {
      const userSetting = UserSetting.parse(JSON.parse('{"_dateFormat":"some text"}'));
      expect(userSetting).toBeTruthy();
      expect(userSetting.getRowsPerPage()).toBe(10);
      expect(userSetting.getRowSet0()).toBe(10);
      expect(userSetting.getRowSet1()).toBe(25);
      expect(userSetting.getRowSet2()).toBe(50);
      expect(userSetting.getDateFormat()).toBe('some text');
    });
});
