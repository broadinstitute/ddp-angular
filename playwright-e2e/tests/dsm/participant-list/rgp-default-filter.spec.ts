import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';

test.describe('Participants list', () => {
  test('RGP default filters @dsm @rgp', async ({ page, request }) => {
    const participantListPage = await ParticipantListPage.goto(page, StudyEnum.RGP, request);
    const searchPanel = participantListPage.filters.searchPanel;
    await searchPanel.open();

    expect.soft(await searchPanel.textInputExists('Family ID')).toBe(true);
    expect.soft(await searchPanel.textInputExists('Subject ID')).toBe(true);
    expect.soft(await searchPanel.textInputExists('First Name')).toBe(true);
    expect.soft(await searchPanel.textInputExists('Last Name')).toBe(true);
    expect.soft(await searchPanel.textInputExists('Phone (Primary)')).toBe(true);
    expect.soft(await searchPanel.textInputExists('Preferred Email')).toBe(true);

    expect.soft(await searchPanel.dateInputExists('DOB')).toBe(true);
    expect.soft(await searchPanel.textInputExists('Age Today')).toBe(true);

    // Preferred Language
    expect.soft(await searchPanel.checkboxExists('Preferred Language', 'English')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Preferred Language', 'Spanish')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Preferred Language', 'Other')).toBe(true);

    // Relationship to Proband
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Self')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Sister')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Brother')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Mother')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Father')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Paternal Grandmother')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Paternal Grandfather')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Maternal Grandmother')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Maternal Grandfather')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Daughter')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Son')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Other')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Half Sibling Maternal')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Half Sibling Paternal')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Maternal Aunt')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Maternal First Cousin')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Maternal Uncle')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Paternal Aunt')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Paternal First Cousin')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Relationship to Proband', 'Paternal Uncle')).toBe(true);

    // Affected Status
    expect.soft(await searchPanel.checkboxExists('Affected Status', 'Affected')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Affected Status', 'Unaffected')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Affected Status', 'Uncertain')).toBe(true);

    // Acceptance Status
    expect.soft(await searchPanel.checkboxExists('Acceptance Status**', 'Accepted')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Acceptance Status**', 'In Review')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Acceptance Status**', 'More Info Needed')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Acceptance Status**', 'Not Accepted')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Acceptance Status**', 'NMI to Accepted')).toBe(true);
    expect.soft(await searchPanel.checkboxExists('Acceptance Status**', 'Pre-review')).toBe(true);

    expect.soft(await searchPanel.dateInputExists('Acceptance Status Date**')).toBe(true);
    expect.soft(await searchPanel.dateInputExists('Enrollment Date**')).toBe(true);

    expect(test.info().errors).toHaveLength(0);
  });
});
