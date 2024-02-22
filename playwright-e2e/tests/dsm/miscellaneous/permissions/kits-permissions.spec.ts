import { expect } from '@playwright/test';
import Dropdown from 'dsm/component/dropdown';
import { Menu, Miscellaneous, Navigation, Samples, StudyName } from 'dsm/component/navigation';
import { UserPermission } from 'dsm/pages/miscellaneous-pages/enums/userPermission-enum';
import UserPermissionPage from 'dsm/pages/miscellaneous-pages/user-and-permissions-page';
import Select from 'dss/component/select';
import { testLimitedPermissions as test } from 'fixtures/dsm-fixture';

test.describe('Kits Permissions', () => {
    const studies = [StudyName.OSTEO2, StudyName.LMS];
    const testEmail = process.env.DSM_USER2_EMAIL as string; // Mason Whiteclaw

    for (const study of studies) {
      test(`@${study}: Without permissions, user cannot see Kits pages`, async ({ page, request }) => {
        const navigation = new Navigation(page, request);

        await test.step('Verify user does not have any Kits permissions', async () => {
          await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

          // Verify user permissions match expected
          await navigation.selectFromMiscellaneous(Miscellaneous.USERS_AND_PERMISSIONS);
          const userPermissionsPage = new UserPermissionPage(page);

          const studyAdmin = userPermissionsPage.getStudyAdmin(testEmail);
          await studyAdmin.scrollIntoViewIfNeeded();
          await studyAdmin.click(); // expand section to show details
          let checkbox = userPermissionsPage.getPermissionCheckbox(studyAdmin, UserPermission.KIT_VIEW_AND_DEACTIVATION_REACTIVATION);
          expect(await checkbox.isChecked()).toBeFalsy();
          checkbox = userPermissionsPage.getPermissionCheckbox(studyAdmin, UserPermission.KIT_VIEW_KIT_PAGES);
          expect(await checkbox.isChecked()).toBeFalsy();
          checkbox = userPermissionsPage.getPermissionCheckbox(studyAdmin, UserPermission.KIT_CREATE_OVERNIGHT_SHIPPING_LABELS);
          expect(await checkbox.isChecked()).toBeFalsy();
          checkbox = userPermissionsPage.getPermissionCheckbox(studyAdmin, UserPermission.KIT_CLINICAL_ORDER);
          expect(await checkbox.isChecked()).toBeFalsy();
          checkbox = userPermissionsPage.getPermissionCheckbox(studyAdmin, UserPermission.KIT_DISCARD_SAMPLES);
          expect(await checkbox.isChecked()).toBeFalsy();
          checkbox = userPermissionsPage.getPermissionCheckbox(studyAdmin, UserPermission.KIT_UPLOAD);
          expect(await checkbox.isChecked()).toBeFalsy();
          checkbox = userPermissionsPage.getPermissionCheckbox(studyAdmin, UserPermission.KIT_UPLOAD_INVALID_ADDRESS);
          expect(await checkbox.isChecked()).toBeFalsy();
        });

        await test.step('Verify Kits related menu options are not in Samples menu', async () => {
          const samplesMenu = new Dropdown(page, Menu.SAMPLES);
          const allOptions = await samplesMenu.getDisplayedOptions<Samples>();
          expect(allOptions.includes(Samples.CLINICAL_ORDERS)).toBeTruthy();
        });
      })
    }
})
