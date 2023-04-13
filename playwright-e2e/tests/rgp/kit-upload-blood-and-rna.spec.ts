import { test, expect, Page } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import HomePage from 'pages/dsm/home-page';
import { Navigation } from 'lib/component/dsm/navigation/navigation';
import { WelcomePage } from 'pages/dsm/welcome-page';
import { Study } from 'lib/component/dsm/navigation/enums/selectStudyNav.enum';
import dsmHome from 'pages/dsm/home-page';


test.describe('RGP Kit Upload', () => {

    test('Can upload a Blood & RNA kit @functional @rgp', async ({ page }) => {
        //Go to DSM in order to do a kit upload (type: "BLOOD & RNA")
        const dsm = new dsmHome(page);
    })
})