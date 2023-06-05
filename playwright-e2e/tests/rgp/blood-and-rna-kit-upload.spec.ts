import { expect, Page } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { login } from 'authentication/auth-dsm';
import { Navigation } from 'dsm/component/navigation/navigation';
import Select from 'dss/component/select';
import { KitUploadInfo } from 'dsm/pages/kitUpload-page/models/kitUpload-model';
import {StudyEnum} from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import {WelcomePage} from 'dsm/pages/welcome-page';
import HomePage from 'dsm/pages/home-page';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import {StudyNavEnum} from 'dsm/component/navigation/enums/studyNav-enum';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import * as user from 'data/fake-user.json';
import KitUploadPage from 'dsm/pages/kitUpload-page/kitUpload-page';
import {SamplesNavEnum} from 'dsm/component/navigation/enums/samplesNav-enum';
import FamilyMemberTab from 'dsm/pages/participant-page/rgp/family-member-tab';
import { FamilyMember } from 'dsm/component/tabs/enums/familyMember-enum';

test.describe.skip('Blood & RNA Kit Upload', () => {
    let welcomePage: WelcomePage;
    let homePage: HomePage;
    let navigation: Navigation;

    let shortID: string;
    let kitUploadInfo: KitUploadInfo;
    let kitLabel: string;
    let trackingLabel: string;
    let shippingID: string;

    const study = StudyEnum.RGP;
    const kitType = KitTypeEnum.BLOOD_AND_RNA;
    const expectedKitTypes = [KitTypeEnum.BLOOD, KitTypeEnum.BLOOD_AND_RNA]; //Later will be just Blood & RNA kit type for RGP

    test.beforeEach(async ({ page, request }) => {
        await login(page);
        welcomePage = new WelcomePage(page);
        homePage = new HomePage(page);
        navigation = new Navigation(page, request);

        //select RGP study
        await new Select(page, { label: 'Select study' }).selectOption('RGP');
    });

    test('Verify that a single blood and rna kit can be uploaded, sent, and received @functional @rgp', async ({ page, request}) => {
        await welcomePage.selectStudy(study);
        await homePage.assertWelcomeTitle();
        await homePage.assertSelectedStudyTitle(study);

        //Go to recently created playwright test participant to get their short id
        const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
        await participantListPage.assertPageTitle();
        await participantListPage.waitForReady();

        await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);
        await participantListPage.selectParticipant(user.patient.participantGuid);

        //For RGP, the short id needed for the kit upload is the family member's subject id
        const proband = new FamilyMemberTab(page, FamilyMember.PROBAND);
        proband.relationshipID = user.patient.relationshipID;

        const probandTab = proband.getFamilyMemberTab();
        await expect(probandTab).toBeVisible();
        await probandTab.click();
        await expect(probandTab).toHaveClass('nav-link active');//Make sure the tab is in view and selected

        const participantInfoSection = proband.getParticipantInfoSection();
        await participantInfoSection.click();

        const probandSubjectID = proband.getSubjectID();
        await expect(probandSubjectID).not.toBeEmpty();
        console.log(`Proband's subject ID: ${probandSubjectID.inputValue()}`);
        shortID = await probandSubjectID.inputValue();

        //The rest of the kit upload information - RGP kits are by family member instead of by account - using the proband's info to make a kit
        kitUploadInfo = new KitUploadInfo(shortID, user.patient.firstName, user.patient.lastName);
        kitUploadInfo.street1 = user.patient.streetAddress;
        kitUploadInfo.city = user.patient.city;
        kitUploadInfo.postalCode = user.patient.zip;
        kitUploadInfo.state = user.patient.state.abbreviation;
        kitUploadInfo.country = user.patient.country.abbreviation;

        //Note: no blood kits are automatically created for RGP - so there's no need for preliminary deactivation of existing kits
        //Upload a Blood & RNA kit
        const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesNavEnum.KIT_UPLOAD);

    });
});
