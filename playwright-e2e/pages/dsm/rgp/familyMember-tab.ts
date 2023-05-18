import { Locator, Page } from '@playwright/test';
import { FamilyMember } from 'lib/component/dsm/study/rgp/enums/familyMember.enum';

/**
 * Captures the webelements that can be interacted with for RGP Family Members
 * Family Member tabs are usually displayed to the right of the Participant Page -> Survey Data tab
 */
export default class FamilyMemberTab {
    private _firstName!: string;
    private _lastName!: string;
    private _relationshipID!: string;
    private _familyID!: number;
    private _relationToProband: FamilyMember;
    private readonly page: Page;

    constructor(page: Page, relationToProband: FamilyMember) {
        this.page = page;
        this._firstName; //proband starts with this as unknown, first name is used as an identifier in DSM & DSS
        this._lastName; //proband starts with this as unknown
        this._familyID;
        this._relationshipID;
        this._relationToProband = relationToProband;
    }

    public set relationshipID(relationshipID : string) {
        this._relationshipID = relationshipID;
    }

    public get relationshipID(): string {
        return this._relationshipID;
    }

    public set familyID(familyID : number) {
        this._familyID = familyID;
    }

    public get familyID(): number {
        return this._familyID;
    }

    public set relationToProband(relationToProband: FamilyMember) {
        this._relationToProband = relationToProband;
    }

    public get relationToProband(): FamilyMember {
        return this._relationToProband
    }

    public set firstName(firstName: string) {
        this._firstName = firstName;
    }

    public get firstName(): string {
        return this._firstName;
    }

    public set lastName(lastName: string) {
        this._lastName = lastName;
    }

    public get lastName(): string {
        return this._lastName;
    }

    /* Locators */

    /**
     * Uses the relationshipID to find the tab to be returned, must be ran after setting the relationshipID
     * @returns locator for a family member's tab
     */
    public getFamilyMemberTab(): Locator {
        return this.page.locator(`//li//span[contains(text(), 'RGP') and contains(text(), '${this._relationshipID}')]`);
    }

    public getJumpToMenuText(): Locator {
        return this.page.getByRole('tabpanel').getByText('Jump to:');
    }

    public getParticipantInfoMenuLink(): Locator {
        return this.page.locator("//a[contains(text(), 'Participant Info')]");
    }

    public getContactInfoMenuLink(): Locator {
        return this.page.locator("//a[contains(text(), 'Contact Info')]");
    }

    public getStudyStatusMenuLink(): Locator {
        return this.page.locator("//a[contains(text(), 'Study Status')]");
    }

    public getMedicalRecordsMenuLink(): Locator {
        return this.page.locator("//a[contains(text(), 'Medical records')]");
    }

    public getPrimarySampleMenuLink(): Locator {
        return this.page.locator("//a[contains(text(), 'Primary Sample')]");
    }

    public getTissueMenuLink(): Locator {
        return this.page.locator("//a[text()='Tissue']");
    }

    public getRORMenuLink(): Locator {
        return this.page.locator("//a[contains(text(), 'ROR')]");
    }

    public getSurveyMenuLink(): Locator {
        return this.page.locator("//a[text()='Survey']");
    }

    public getParticipantInfoSection(): Locator {
        return this.page.locator("//button[contains(text(), 'Participant Info')]");
    }

    public getSubjectID(): Locator {
        return this.page.locator("//input[@data-placeholder='Subject ID']");
    }

    public getFamilyID(): Locator {
        return this.page.locator("//input[@data-placeholder='Family ID']");
    }

    public async inputImportantNotes(notes: string): Promise<void> {
        await this.page.getByPlaceholder('Important Notes').fill(`${notes}`);
    }

    public async inputProcessNotes(notes: string): Promise<void> {
        await this.page.getByPlaceholder('Process Notes').fill(`${notes}`);
    }

    public getFirstName(): Locator {
        return this.page.locator("//td[contains(text(), 'First Name')]/following-sibling::td//div/input[@data-placeholder='First Name']");
    }

    public getMiddleName(): Locator {
        return this.page.locator("//input[@data-placeholder='Middle Name']");
    }

    public getLastName(): Locator {
        return this.page.locator("//td[contains(text(), 'Last Name')]/following-sibling::td//div/input[@data-placeholder='Last Name']");
    }

    public getNameSuffix(): Locator {
        return this.page.locator("//input[@data-placeholder='Name Suffix']");
    }

    /**
     * This only needs to be called once for the first instance of a dropdown being clicked as
     * dropdowns in the RGP family member dynamic form seem to have the same xpath
     * @returns dropdown locator
     */
    public getDropdownOptions(): Locator {
        return this.page.locator("//div[@role='listbox']").locator('//mat-option');
    }

    public getPreferredLanguage(): Locator {
        return this.page.locator("//td[contains(text(), 'Preferred Language')]/following-sibling::td/mat-select");
    }

    public getSex(): Locator {
        return this.page.locator("//td[contains(text(), 'Sex')]/following-sibling::td/mat-select");
    }

    public getPronouns(): Locator {
        return this.page.locator("//td[contains(text(), 'Pronouns')]/following-sibling::td/mat-select");
    }

    public getDateOfBirth(): Locator {
        return this.page.locator("//td[contains(text(), 'DOB')]/following-sibling::td//div//input[@data-placeholder='mm/dd/yyyy']");
    }

    public getAgeToday(): Locator {
        return this.page.locator("//td[contains(text(), 'Age Today')]/following-sibling::td//div//input[@data-placeholder='Age Today']");
    }

    public getLivingStatusOption(option: string): Locator {
        return this.page.getByRole('radio', { name: `${option}` });
    }

    public getRelationshipToProband(): Locator {
        return this.page.locator("//td[contains(text(), 'Relationship to Proband')]/following-sibling::td/mat-select");
    }

    public getAffectedStatus(): Locator {
        return this.page.locator("//td[contains(text(), 'Affected Status')]/following-sibling::td/mat-select");
    }

    public getRace(): Locator {
        return this.page.locator("//td[contains(text(), 'Race')]/following-sibling::td/mat-select");
    }

    public getEthnicity(): Locator {
        return this.page.locator("//td[contains(text(), 'Ethnicity')]/following-sibling::td/mat-select");
    }

    public async inputMixedRaceNotes(notes: string): Promise<void> {
        await this.page.getByPlaceholder('Mixed Race Notes').fill(`${notes}`);
    }

    public getContactInfoSection(): Locator {
        return this.page.locator("//button[contains(text(), 'Contact Info')]");
    }

    public getPrimaryPhoneNumber(): Locator {
        return this.page.locator("//td[contains(text(), 'Phone')]/following-sibling::td//div//input[@data-placeholder='Phone (Primary)']");
    }

    public getSecondaryPhoneNumber(): Locator {
        return this.page.locator("//td[contains(text(), 'Phone')]/following-sibling::td//div//input[@data-placeholder='Phone (Secondary)']");
    }

    public getPreferredEmail(): Locator {
        return this.page.locator("//td[contains(text(), 'Preferred Email')]/following-sibling::td//div//input[@data-placeholder='Preferred Email']");
    }

    public getSendSecure(): Locator {
        return this.page.locator("//td[contains(text(), 'Send Secure')]/following-sibling::td/mat-select");
    }

    public getPortalMessage(): Locator {
        return this.page.locator("//td[contains(text(), 'Portal Message')]/following-sibling::td/mat-select");
    }

    public getPortalMessageDate(): Locator {
        return this.page.locator("//td[contains(text(), 'Portal Message Date')]/following-sibling::td//div/input");
    }

    public getStreetOne(): Locator {
        return this.page.locator("//td[contains(text(), 'Street 1')]/following-sibling::td//div//input[@data-placeholder='Street 1']");
    }

    public getStreetTwo(): Locator {
        return this.page.locator("//td[contains(text(), 'Street 2')]/following-sibling::td//div//input[@data-placeholder='Street 2']");
    }

    public getCity(): Locator {
        return this.page.locator("//td[contains(text(), 'City')]/following-sibling::td//div//input[@data-placeholder='City']");
    }

    public getState(): Locator {
        return this.page.locator("//td[contains(text(), 'State')]/following-sibling::td/mat-select");
    }

    public getZip(): Locator {
        return this.page.locator("//td[contains(text(), 'Zip')]/following-sibling::td//div//input[@data-placeholder='Zip']");
    }

    public getCountry(): Locator {
        return this.page.locator("//td[contains(text(), 'Country')]/following-sibling::td//div//input[@data-placeholder='Country']");
    }

    public getStudyStatusSection(): Locator {
        return this.page.locator("//button[contains(text(), 'Study Status')]")
    }

    public getAcceptanctStatus(): Locator {
        return this.page.locator("//td[contains(text(), 'Acceptance Status')]/following-sibling::td/mat-select");
    }

    public getAcceptanctStatusDate(): Locator {
        return this.page.locator("//td[contains(text(), 'Acceptance Status Date')]/following-sibling::td//div/input");
    }

    public getActiveInactiveHold(): Locator {
        return this.page.locator("//td[contains(text(), 'Active/Inactive/HOLD')]/following-sibling::td/mat-select");
    }

    public getInactiveReason(): Locator {
        return this.page.locator("//td[contains(text(), 'Inactive Reason')]/following-sibling::td/mat-select");
    }

    public getAcuityAppointmentDate(): Locator {
        return this.page.locator("//td[contains(text(), 'Acuity Appointment Date')]/following-sibling::td//div/input");
    }

    public getDateOfConsentCall(): Locator {
        return this.page.locator("//td[contains(text(), 'Date of Consent Call')]/following-sibling::td//div/input");
    }

    public getEnrollmentDate(): Locator {
        return this.page.locator("//td[contains(text(), 'Enrollment Date')]/following-sibling::td//div/input");
    }

    public getDataSharingPermissions(): Locator {
        return this.page.locator("//td[contains(text(), 'Data-sharing permissions')]/following-sibling::td/mat-select");
    }

    public async inputConsentingNotes(notes: string): Promise<void> {
        await this.page.getByPlaceholder('Consenting Notes').fill(`${notes}`);
    }

    public getConsentDocumentationCompleteOption(option: string): Locator {
        return this.page.locator(`//td[contains(text(), 'Consent Documentation Complete')]` +
        `/following-sibling::td//mat-radio-button//span[text()='${option}']`);
    }

    public getPhotoPermissions(): Locator {
        return this.page.locator("//td[contains(text(), 'Photo Permissions')]/following-sibling::td/mat-select");
    }

    public getMedicalRecordsSection(): Locator {
        return this.page.locator("//button[contains(text(), 'Medical record')]");
    }

    public getMedicalRecordsReceived(option: string): Locator {
        return this.page.locator(`//td[contains(text(), 'Medical Records Received')]` +
        `/following-sibling::td//mat-radio-button//span[text()='${option}']`);
    }

    public getMedicalRecordsLastReceived(): Locator {
        return this.page.locator("//td[contains(text(), 'Medical Records Last Received')]/following-sibling::td//div/input");
    }

    public async inputMedicalRecordsNotes(notes: string): Promise<void> {
        await this.page.getByPlaceholder('Medical Records Notes').fill(`${notes}`);
    }

    public getMedicalRecordsReleaseObtained(option: string): Locator {
        return this.page.locator(`//td[contains(text(), 'Medical Records Release Obtained')]` +
        `/following-sibling::td//mat-radio-button//span[text()='${option}']`);
    }

    public getRecordsLastRequested(): Locator {
        return this.page.locator("//td[contains(text(), 'Records Last Requested')]/following-sibling::td//div/input");
    }

    public getFamilyUrlProvided(): Locator {
        return this.page.locator("//td[contains(text(), 'Family Provided URL (if any)')]" +
        "/following-sibling::td//div//input[@data-placeholder='Family Provided URL (if any)']");
    }

    public getReferralSource(): Locator {
        return this.page.locator("//td[contains(text(), 'Referral Source')]/following-sibling::td/mat-select");
    }

    public async inputReferralNotes(notes: string): Promise<void> {
        await this.page.getByPlaceholder('Referral Notes').fill(`${notes}`);
    }

    public getReferringClinician(): Locator {
        return this.page.locator("//td[contains(text(), 'Referring Clinician')]" +
        "/following-sibling::td//div//input[@data-placeholder='Referring Clinician']");
    }

    public getClinicianReferralForm(): Locator {
        return this.page.locator("//td[contains(text(), 'Clinician Referral Form')]/following-sibling::td/mat-select");
    }

    public getConsentToSpeakWithClinician(): Locator {
        return this.page.locator("//td[contains(text(), 'Consent to speak with clinician')]/following-sibling::td/mat-select");
    }

    public getCohort(): Locator {
        return this.page.locator("//td[contains(text(), 'Cohort')]/following-sibling::td/mat-select");
    }

    public getPrimarySampleSection(): Locator {
        return this.page.locator("//button[contains(text(), 'Primary Sample')]");
    }

    public getKitTypeToRequest(): Locator {
        return this.page.locator("//td[contains(text(), 'Kit Type to Request')]/following-sibling::td/mat-select");
    }

    public getDateKitSent(): Locator {
        return this.page.locator("//td[contains(text(), 'Date Kit Sent')]/following-sibling::td//div/input");
    }

    public getCliaOrNonCliaKitSent(): Locator {
        return this.page.locator("//td[contains(text(), 'CLIA or NonCLIA Kit Sent')]/following-sibling::td/mat-select");
    }

    public getDateEdtaSampleReceived(): Locator {
        return this.page.locator("//td[contains(text(), 'Date EDTA Sample Received')]/following-sibling::td//div/input");
    }

    public getDatePaxgeneSampleReceived(): Locator {
        return this.page.locator("//td[contains(text(), 'Date PAXgene Sample Received')]/following-sibling::td//div/input");
    }

    public getDateBackupEdtaTubeReceived(): Locator {
        return this.page.locator("//td[contains(text(), 'Date back-up EDTA tube received')]/following-sibling::td//div/input");
    }

    public getSentToGPDate(): Locator {
        return this.page.locator("//td[contains(text(), 'Sent to GP')]/following-sibling::td//div/input");
    }

    public async inputSampleNotes(notes: string): Promise<void> {
        await this.page.getByPlaceholder('Sample Notes').fill('Testing notes here - Sample Notes');
    }

    public getBloodSalivaProcessing(): Locator {
        return this.page.locator("//td[contains(text(), 'Blood/Saliva Processing')]/following-sibling::td/mat-select");
    }

    public getLongReadWGS(): Locator {
        return this.page.locator("//td[contains(text(), 'Long-read WGS')]/following-sibling::td/mat-select");
    }

    public getMethylation(): Locator {
        return this.page.locator("//td[contains(text(), 'Methylation')]/following-sibling::td/mat-select");
    }

    public getBloodRnaSeq(option: string): Locator {
        return this.page.locator(`//td[contains(text(), 'Blood RNAseq?')]/following-sibling::td//mat-radio-button//span[text()='${option}']`);
    }

    public getTissueSection(): Locator {
        return this.page.locator("//button[contains(text(), 'Tissue')]");
    }

    public getPotentialTissueSampleAvailable(): Locator {
        return this.page.locator("//td[contains(text(), 'Potential tissue sample available')]/following-sibling::td/mat-select");
    }

    public async inputTissueNotes(notes: string): Promise<void> {
        await this.page.getByPlaceholder('Tissue Notes').fill(`${notes}`);
    }

    public getTissueTypeReceived(): Locator {
        return this.page.locator("//td[contains(text(), 'Tissue Type Received')]" +
        "/following-sibling::td//div//input[@data-placeholder='Tissue Type Received']");
    }

    public getTissueProcessing(): Locator {
        return this.page.locator("//td[contains(text(), 'Tissue processing')]/following-sibling::td/mat-select");
    }

    public getTissueSampleID(): Locator {
        return this.page.locator("//td[contains(text(), 'Tissue Sample ID')]" +
        "/following-sibling::td//div//input[@data-placeholder='Tissue Sample ID']");
    }

    public getRORSection(): Locator {
        return this.page.locator("//button[contains(text(), 'ROR')]");
    }

    public getReportableResult(): Locator {
        return this.page.locator("//td[contains(text(), 'Reportable result')]/following-sibling::td/mat-select");
    }

    public getRorNotification(): Locator {
        return this.page.locator("//td[contains(text(), 'ROR notification')]/following-sibling::td/mat-select");
    }

    public getSolved(): Locator {
        return this.page.locator("//td[contains(text(), 'Solved')]/following-sibling::td/mat-select");
    }

    public getGeneName(): Locator {
        return this.page.locator("//td[contains(text(), 'Gene name')]/following-sibling::td//div//input[@data-placeholder='Gene name']");
    }

    public getProceedingToConfirm(): Locator {
        return this.page.locator("//td[contains(text(), 'Proceeding to confirm')]/following-sibling::td/mat-select");
    }

    public getProviderContactInfo(): Locator {
        return this.page.locator("//td[contains(text(), 'Provider contact info')]" +
        "/following-sibling::td//div//input[@data-placeholder='Provider contact info']");
    }

    public getConfirmLab(): Locator {
        return this.page.locator("//td[contains(text(), 'Confirm Lab')]/following-sibling::td/mat-select");
    }

    public getConfirmLabAccessionNumber(): Locator {
        return this.page.locator("//td[contains(text(), 'Confirm lab accession number')]" +
        "/following-sibling::td//div//input[@data-placeholder='Confirm lab accession number']");
    }

    public getDateConfirmKitSent(): Locator {
        return this.page.locator("//td[contains(text(), 'Date confirm kit sent')]/following-sibling::td//div/input");
    }

    public getDateOfConfirmReport(): Locator {
        return this.page.locator("//td[contains(text(), 'Date of confirm report')]/following-sibling::td//div/input");
    }

    public async inputRorStatusNotes(notes: string): Promise<void> {
        await this.page.getByPlaceholder('ROR Status/Notes').fill(`${notes}`);
    }

    public async inputPostDisclosureNotes(notes: string): Promise<void> {
        await this.page.getByPlaceholder('Post-disclosure notes').fill(`${notes}`);
    }

    public getCollaboration(): Locator {
        return this.page.locator("//td[contains(text(), 'Collaboration?')]/following-sibling::td/mat-select");
    }

    public getMTA(): Locator {
        return this.page.locator("//td[contains(text(), 'MTA')]/following-sibling::td/mat-select");
    }

    public getPublication(): Locator {
        return this.page.locator("//td[contains(text(), 'Publication')]/following-sibling::td/mat-select");
    }

    public async inputPublicationInfo(notes: string): Promise<void> {
        await this.page.getByPlaceholder('Publication Info').fill(`${notes}`);
    }

    public getSurveySection(): Locator {
        return this.page.locator("//button[contains(text(), 'Survey')]");
    }

    public getRedCapSurveyTaker(): Locator {
        return this.page.locator("//td[contains(text(), 'RedCap Survey Taker')]/following-sibling::td/mat-select");
    }

    public getRedCapSurveyCompletedDate(): Locator {
        return this.page.locator("//td[contains(text(), 'RedCap Survey Completed Date')]/following-sibling::td//div/input");
    }
}
