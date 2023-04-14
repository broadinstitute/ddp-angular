import { test, expect, Page } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import HomePage from 'pages/dsm/home-page';
import { Navigation } from 'lib/component/dsm/navigation/navigation';
import { WelcomePage } from 'pages/dsm/welcome-page';
import { Study } from 'lib/component/dsm/navigation/enums/selectStudyNav.enum';
import KitUploadPage from 'pages/dsm/kitUpload-page';
import { SamplesMenu } from 'lib/component/dsm/navigation/enums/samplesNav.enum';


test.describe('RGP Kit Upload', () => {
    let welcomePage: WelcomePage;
    let homePage: HomePage;
    let navigation: Navigation;

    test.beforeEach(async ({ page }) => {
        await login(page);
        welcomePage = new WelcomePage(page);
        homePage = new HomePage(page);
        navigation = new Navigation(page);
    });

    test('Can upload a Blood & RNA kit @functional @rgp', async ({ page }) => {
        //Go to DSM in order to do a kit upload (type: "BLOOD & RNA")
        await welcomePage.selectStudy(Study.RGP);

        await homePage.assertWelcomeTitle();
        await homePage.assertSelectedStudyTitle('RGP');

        const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesMenu.KIT_UPLOAD);
        await kitUploadPage.assertPageTitle();
    })
})