import { test, expect, Page } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import HomePage from 'pages/dsm/home-page';
import { Navigation } from 'lib/component/dsm/navigation/navigation';
import { WelcomePage } from 'pages/dsm/welcome-page';
import { Study } from 'lib/component/dsm/navigation/enums/selectStudyNav.enum';
import KitUploadPage from 'pages/dsm/kitUpload-page';
import { SamplesMenu } from 'lib/component/dsm/navigation/enums/samplesNav.enum';
import { KitType } from 'lib/component/dsm/samples/enums/kitType.enum'
import { Titles } from 'pages/dsm/home-page';


test.describe.serial('RGP Kit Upload', () => {
    let welcomePage: WelcomePage;
    let homePage: HomePage;
    let navigation: Navigation;

    test.beforeEach(async ({ page }) => {
        await login(page);
        welcomePage = new WelcomePage(page);
        homePage = new HomePage(page);
        navigation = new Navigation(page);
    });

    //Test the Kit Upload page protion of the the process
    test('Can upload a Blood & RNA kit via Kit Upload page @functional @rgp', async ({ page }) => {
        //Go to DSM in order to do a kit upload (type: "BLOOD & RNA")
        await welcomePage.selectStudy(Study.RGP);

        const welcomeTitle = homePage.welcomeTitle;
        const studySelection = homePage.studySelectionTitle;
        const rgpStudySelectionText = homePage.getStudySelectionText('RGP');

        //DSM homepage assertions
        await expect(welcomeTitle).toHaveText(Titles.WELCOME);
        await expect(studySelection).toHaveText(rgpStudySelectionText);

        //Kit Upload page navigation: (Samples -> Kit Upload)
        const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesMenu.KIT_UPLOAD);
        const kitUploadPageTitle = kitUploadPage.getPageTitle();
        await expect(kitUploadPageTitle).toBeVisible();

        //Select the "Blood and RNA" kit type
        const bloodRNAKit = kitUploadPage.getKitTypeOption(KitType.BLOOD_AND_RNA);
        await bloodRNAKit.check();
        await expect(bloodRNAKit).toBeChecked();

        const skipAddressValidationOption = kitUploadPage.getSkipAddressValidationOption();

        //This test is with a study admin who has permissions to see the skip address validation option
        //This test is also using a valid address - so the option will not be selected here
        //todo add test to ensure invalid address is accepted if address validation is skipped
        await expect(skipAddressValidationOption).toBeVisible();

        const browseButton = kitUploadPage.getBrowseButton();
        await expect(browseButton).toBeVisible();
    })
})
