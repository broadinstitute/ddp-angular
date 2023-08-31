import { expect } from '@playwright/test';
import { CustomViewColumns } from 'dsm/component/filters/sections/search/search-enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { test } from 'fixtures/dsm-fixture';
import { getDate } from 'utils/date-utils';
import { logInfo } from 'utils/log-utils';

test.describe('DSM Date Picker', () => {
  test('Pick 12/20/1995 as date of birth on Participant List @dsm', async ({ page, request }) => {
    const today = new Date();
    const splits = getDate(today).split('/'); // mm/dd/yyyy
    const date = splits[1];
    const month = today.toLocaleString('default', { month: 'long' });
    const year = splits[2];

    const participantListPage = await ParticipantListPage.goto(page, StudyEnum.ANGIO, request);

    const customizeViewPanel = participantListPage.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns(CustomViewColumns.RESEARCH_CONSENT_FORM, ['Date of Birth']);

    const searchPanel = participantListPage.filters.searchPanel;
    await searchPanel.open();

    // Open Date of Birth Date picker
    const calendar = await searchPanel.openDatePicker('Date of Birth', { open: true });
    expect(calendar.isVisible()).toBeTruthy();

    // Day picker
    const calendarDayPicker = calendar.dayPicker();

    const dayOfWeekLabel = calendarDayPicker.locator('th').filter({ has: page.locator('[aria-label="labelz.full"]') });
    await expect(dayOfWeekLabel).toHaveText(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);

    // Today's date is highlighted by default
    await expect(calendarDayPicker.locator('td button.active')).toHaveText(date.toString(), { useInnerText: true });

    // Open Month picker
    await calendarDayPicker.locator('th button[id]').click();

    // Month picker
    const calendarMonthPicker = calendar.monthPicker();

    // Today's month is highlighted by default
    await expect(calendarMonthPicker.locator('td button.active')).toHaveText(month.toString(), { useInnerText: true });

    // All months are visible
    await expect(calendarMonthPicker.locator('td button')).toHaveText(
      ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);

    // Open Year picker
    await calendarMonthPicker.locator('th button[id]').click();

    // Year picker
    const calendarYearPicker = calendar.yearPicker();

    // Today's year is highlighted by default
    await expect(calendarYearPicker.locator('td button.active')).toHaveText(year.toString(), { useInnerText: true });

    // Close Date of Birth Date picker to reset fields
    await searchPanel.openDatePicker('Date of Birth', { open: false });

    // Reopen calendar picker to select target date
    await searchPanel.openDatePicker('Date of Birth', { open: true });
    // Select date is 12/20/1995
    await calendar.pickDate({
      yyyy: 1995,
      month: 11, // December because month is 0-indexed
      dayOfMonth: 20
    });

    // Verify date value match
    const selectDate = getDate(new Date(1995, 11, 20));
    logInfo(`Date picker: Pick date is ${selectDate}`);

    const value = await searchPanel.textInputLocator('Date of Birth').inputValue();
    expect(value).toBe(selectDate);
  });
});
