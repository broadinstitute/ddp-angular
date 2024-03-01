import { expect } from '@playwright/test';
import { CustomizeView, Label } from 'dsm/enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { test } from 'fixtures/dsm-fixture';
import { getDate, getToday } from 'utils/date-utils';
import { logInfo } from 'utils/log-utils';

test.describe('DSM Date Picker', () => {
  const study = StudyEnum.ANGIO;
  const dobColumn = 'Date of Birth';
  // DoB is 12/20/1995
  const dob = {
    yyyy: 1995,
    month: 11, // December because month is 0-indexed
    dayOfMonth: 20
  }

  test('Select date from calendar for Date of Birth on Participant List page @dsm @angio @participant-list',
    async ({ page, request }) => {
      const localDate = getToday();
      const splits = localDate.split('/'); // mm/dd/yyyy
      const date = splits[1];
      const month = new Date().toLocaleString('default', { month: 'long' });
      const year = splits[2];

      const participantListPage = await ParticipantListPage.goto(page, study, request);

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(CustomizeView.RESEARCH_CONSENT_FORM, [Label.DATE_OF_BIRTH]);

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();

      // Open Date of Birth Date picker
      const calendar = await searchPanel.openDatePicker(Label.DATE_OF_BIRTH, { open: true });
      expect(calendar.isVisible()).toBeTruthy();

      // Day picker
      const calendarDayPicker = calendar.dayPicker();

      const dayOfWeekLabel = calendarDayPicker.locator('th').filter({ has: page.locator('[aria-label="labelz.full"]') });
      await expect(dayOfWeekLabel).toHaveText(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], { timeout: 5000 });

      // Today's date is highlighted by default
      await expect(calendarDayPicker.locator('td button.active')).toHaveText(date.toString(), { useInnerText: true, timeout: 5000 });

      // Open Month picker
      await calendarDayPicker.locator('th button[id]').click();

      // Month picker
      const calendarMonthPicker = calendar.monthPicker();

      // Today's month is highlighted by default
      await expect(calendarMonthPicker.locator('td button.active')).toHaveText(month.toString(), { useInnerText: true, timeout: 5000 });

      // All months are visible
      await expect(calendarMonthPicker.locator('td button')).toHaveText(
        ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        { timeout: 5000 });

      // Open Year picker
      await calendarMonthPicker.locator('th button[id]').click();

      // Year picker
      const calendarYearPicker = calendar.yearPicker();

      // Today's year is highlighted by default
      await expect(calendarYearPicker.locator('td button.active')).toHaveText(year.toString(), { useInnerText: true, timeout: 5000 });

      // Close Date of Birth Date picker to reset fields
      await searchPanel.openDatePicker(Label.DATE_OF_BIRTH, { open: false });

      // Reopen calendar picker to select target date
      await searchPanel.openDatePicker(Label.DATE_OF_BIRTH, { open: true });
      // Select 12/20/1995
      await calendar.pickDate(dob);

      // Verify date match expected
      const selectDate = getDate(new Date(1995, 11, 20));
      const value = await searchPanel.textInputLocator(dobColumn).inputValue();
      expect(value).toBe(selectDate);
      logInfo(`Picked date ${selectDate} from DoB calendar`);

      // Click "Today" button
      await searchPanel.setTodayFor(dobColumn);
      const newValue = await searchPanel.textInputLocator(dobColumn).inputValue();
      expect(newValue).toBe(localDate);
    });
});
