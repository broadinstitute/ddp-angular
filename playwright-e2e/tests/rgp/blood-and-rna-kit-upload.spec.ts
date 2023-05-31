import { expect, Page } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { login } from 'authentication/auth-dsm';
import { Navigation } from 'dsm/component/navigation/navigation';
import Select from 'dss/component/select';


test.describe('Blood & RNA Kit Upload', () => {
    test('Verify that a blood and rna kit can be uploaded, sent, and received @functional @rgp', async ({ page, request}) => {
    await login(page);
    const navigation = new Navigation(page, request);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption('RGP');
    });
});