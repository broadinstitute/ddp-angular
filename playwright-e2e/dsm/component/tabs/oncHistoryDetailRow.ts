import { OncHistoryDetail } from 'dsm/component/tabs/model/oncHistoryDetailModel';
import { Locator, Page, expect } from '@playwright/test';
import { Decalcification, GeneralAnswer, OncHistoryColumn, OncHistoryRequestStatus } from './enums/oncHistory-enum';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';

export default class OncHistoryDetailRow implements OncHistoryDetail {
    private _oncHistoryID!: number;
    private _dateOfPX!: string;
    private _typeOfPX!: string;
    private _locationOfPX!: string;
    private _histology!: string;
    private _accessionNumber!: string;
    private _facility!: string;
    private _phone!: string;
    private _fax!: string;
    private _destructionPolicy!: string;
    private _localControl!: GeneralAnswer;
    private _decalcification!: Decalcification;
    private _ffpe!: GeneralAnswer;
    private _blocksWithTumor!: string;
    private _tumorSize!: string;
    private _necrosis!: string;
    private _viableTumor!: string;
    private _slidesToRequest!: string;
    private _facilityWhereSampleWasReviewed!: string;
    private _slidesTotal!: string;
    private _blocksToRequest!: string;
    private _treatmentEffect!: string;

    constructor(protected readonly page: Page) {
        this._oncHistoryID;
        this._dateOfPX;
        this._typeOfPX;
        this._locationOfPX;
        this._histology;
        this._accessionNumber;
        this._facility;
        this._phone;
        this._fax;
        this._destructionPolicy;
        this._localControl;
        this._decalcification;
        this._ffpe;
        this._blocksWithTumor;
        this._tumorSize;
        this._necrosis;
        this._viableTumor;
        this._slidesToRequest;
        this._facilityWhereSampleWasReviewed;
        this._slidesTotal;
    }

    /* Getters and Setters */

    private set oncHistoryID(id: number) {
        this._oncHistoryID = id;
    }

    public get oncHistoryID(): number {
        return this._oncHistoryID;
    }

    private async setOncHistoryDetailID(currentRow: Locator): Promise<void> {
        const oncHistoryDetailID = parseInt(await currentRow.getAttribute('id') as string);
        this.oncHistoryID = oncHistoryDetailID;
    }

    public set dateOfPX(diagnosisDate: string) {
        this._dateOfPX = diagnosisDate;
    }

    public get dateOfPX(): string {
        return this._dateOfPX as string;
    }

    public async fillDateOfPXField(currentRow: Locator, dateOfPX: string): Promise<void> {
        this._dateOfPX = dateOfPX;
        const dateOfPXField = currentRow.locator(`//td[${OncHistoryColumn.DATE_OF_PX}]//mat-form-field//input`);
        await dateOfPXField.fill(this._dateOfPX);
        await dateOfPXField.blur();
    }

    public set typeOfPX(diagnosisType: string) {
        this._typeOfPX = diagnosisType;
    }

    public get typeOfPX(): string {
        return this._typeOfPX;
    }

    public async fillTypeOfPXField(currentRow: Locator, typeOfPX: string): Promise<void> {
        this._typeOfPX = typeOfPX;
        const typeOfPXField = currentRow.locator(`//td[${OncHistoryColumn.TYPE_OF_PX}]//mat-form-field//textarea`);
        await typeOfPXField.fill(this._typeOfPX);
    }

    public set locationOfPX(location: string) {
        this._locationOfPX = location;
    }

    public get locationOfPX(): string {
        return this._locationOfPX;
    }

    public async fillLocationOfPXField(currentRow: Locator, locationOfPX: string): Promise<void> {
        this._locationOfPX = locationOfPX;
        const locationOfPXField = currentRow.locator(`//td[${OncHistoryColumn.LOCATION_OF_PX}]//mat-form-field//input`);
        await locationOfPXField.fill(this._locationOfPX);
    }

    public set histology(histology: string) {
        this._histology = histology;
    }

    public get histology(): string {
        return this._histology;
    }

    public async fillHistologyField(currentRow: Locator, histology: string): Promise<void> {
        this._histology = histology;
        const histologyField = currentRow.locator(`//td[${OncHistoryColumn.HISTOLOGY}]//mat-form-field//textarea`);
        await histologyField.fill(this._histology);
    }

    public set accessionNumber(accessionNumber: string) {
        this._accessionNumber = accessionNumber;
    }

    public get accessionNumber(): string {
        return this._accessionNumber;
    }

    public async fillAccessionNumberField(currentRow: Locator, accessionNumber: string): Promise<void> {
        this._accessionNumber = accessionNumber;
        const accessionNumberField = currentRow.locator(`//td[${OncHistoryColumn.ACCESSION_NUMBER}]//mat-form-field//input`);
        await accessionNumberField.fill(this._accessionNumber);
    }

    public set facility(facility: string) {
        this._facility = facility;
    }

    public get facility(): string {
        return this._facility;
    }

    public async fillFacilityNameField(currentRow: Locator, facilityName: string): Promise<void> {
        this._facility = facilityName;
        const facilityNameField = currentRow.locator(`//td[${OncHistoryColumn.FACILITY}]//mat-form-field//input`);
        await facilityNameField.fill(this._facility);
    }

    public set phone(phoneNumber: string) {
        this._phone = phoneNumber;
    }

    public get phone(): string {
        return this._phone;
    }

    public async fillFacilityPhoneNumberField(currentRow: Locator, phone: string): Promise<void> {
        this._phone = phone;
        const facilityPhoneNumberField = currentRow.locator(`//td[${OncHistoryColumn.PHONE}]//mat-form-field//input`);
        await facilityPhoneNumberField.fill(this._phone);
    }

    public set fax(faxNumber: string) {
        this._fax = faxNumber;
    }

    public get fax(): string {
        return this._fax;
    }

    public async fillFacilityFaxNumberField(currentRow: Locator, fax: string): Promise<void> {
        this._fax = fax;
        const facilityfaxNumberField = currentRow.locator(`//td[${OncHistoryColumn.FAX}]//mat-form-field//input`);
        await facilityfaxNumberField.fill(this._fax);
    }

    public set destructionPolicy(amountOfYears: number | string) {
        this._destructionPolicy = amountOfYears as string;
    }

    public get destructionPolicy(): string {
        return this._destructionPolicy;
    }

    public async fillDestructionPolicyField(currentRow: Locator, destructionPolicy: string): Promise<void> {
        this._destructionPolicy = destructionPolicy;
        const destructionPolicyField = currentRow.locator(`//td[${OncHistoryColumn.DESTRUCTION_POLICY}]//mat-form-field//input`);
        await destructionPolicyField.fill(this._destructionPolicy);
    }

    public set localControl(answer: GeneralAnswer) {
        this._localControl = answer;
    }

    public get localControl(): GeneralAnswer {
        return this._localControl;
    }

    public async fillLocalControlDropdown(currentRow: Locator, sampleIsFromLocalControl: GeneralAnswer): Promise<void> {
        this._localControl = sampleIsFromLocalControl;
        const localcontrolDropdown = currentRow.locator(`//td[${OncHistoryColumn.OS2_LOCAL_CONTROL}]//mat-select`);
        await localcontrolDropdown.click();
        const answer = this._localControl as string;
        await localcontrolDropdown.filter({ hasText: answer }).click();
    }

    public set decalcification(answer: Decalcification) {
        this._decalcification = answer;
    }

    public get decalcification(): Decalcification {
        return this._decalcification;
    }

    public async fillDecalcificationDropdown(currentRow: Locator, decalcification: Decalcification): Promise<void> {
        this._decalcification = decalcification;
        const decalcificationDropdown = currentRow.locator(`//td[${OncHistoryColumn.OS2_DECALCIFICATION}]//mat-select`);
        await decalcificationDropdown.click();
        const answer = this._decalcification as string;
        await decalcificationDropdown.filter({ hasText: answer }).click();
    }

    public set ffpe(answer: GeneralAnswer) {
        this._ffpe = answer;
    }

    public get ffpe(): GeneralAnswer {
        return this.ffpe;
    }

    public async fillFFPEDropdown(currentRow: Locator, ffpe: GeneralAnswer): Promise<void> {
        this._ffpe = ffpe;
        const ffpeDropdown = currentRow.locator(`//td[${OncHistoryColumn.OS2_FFPE}]//mat-select`);
        await ffpeDropdown.click();
        const answer = this._ffpe as string;
        await ffpeDropdown.filter({ hasText: answer }).click();
    }

    public set blocksWithTumor(answer: string) {
        this._blocksWithTumor = answer;
    }

    public get blocksWithTumor(): string {
        return this._blocksWithTumor;
    }

    public async fillBlocksWithTumorField(currentRow: Locator, tumorDescription: string): Promise<void> {
        this._blocksWithTumor = tumorDescription;
        const blocksWithTumorField = currentRow.locator(`//td[${OncHistoryColumn.OS2_BLOCKS_WITH_TUMOR}]//mat-form-field//input`);
        await blocksWithTumorField.fill(this._blocksWithTumor);
    }

    public set tumorSize(sizeDescription: string) {
        this._tumorSize = sizeDescription;
    }

    public get tumorSize(): string {
        return this._tumorSize;
    }

    public async fillTumorSizeField(currentRow: Locator, studyName: StudyEnum, tumorDescription: string): Promise<void> {
        let tumorSizeField;
        this._tumorSize = tumorDescription;
        switch (studyName) {
            case StudyEnum.OSTEO2:
                tumorSizeField = currentRow.locator(`//td[${OncHistoryColumn.OS2_TUMOR_SIZE}]//textarea`);
                break;
            case StudyEnum.LMS:
                tumorSizeField = currentRow.locator(`//td[${OncHistoryColumn.LMS_TUMOR_SIZE}]//textarea`);
                break;
            default:
                //Throw error since only OS2 and LMS have a tumor size field
                throw new Error(`Study name ${studyName} was used in fillTumorSizeField(). Only OS2 or LMS should be used!`);
        }
        await tumorSizeField.fill(this._tumorSize);
    }

    public set blockToRequest(blockDescription: string) {
        this._blocksToRequest = blockDescription;
    }

    public get blockToRequest(): string {
        return this._blocksToRequest;
    }

    public async fillBlockToRequestField(currentRow: Locator, requestDescription: string): Promise<void> {
        this._blocksToRequest = requestDescription;
        const blockToRequestField = currentRow.locator(`//td[${OncHistoryColumn.LMS_BLOCKS_TO_REQUEST}]//mat-form-field//input`);
        await blockToRequestField.fill(this._blocksToRequest);
    }

    public set necrosis(necrosisDescription: string) {
        this._necrosis = necrosisDescription;
    }

    public get necrosis(): string {
        return this.necrosis;
    }

    public async fillNecrosisField(currentRow: Locator, studyName: StudyEnum, necrosisDescription: string): Promise<void> {
        let necrosisField;
        this._necrosis = necrosisDescription;
        switch (studyName) {
            case StudyEnum.OSTEO2:
                necrosisField = currentRow.locator(`//td[${OncHistoryColumn.OS2_NECROSIS}]//mat-form-field//input`);
                break;
            case StudyEnum.LMS:
                necrosisField = currentRow.locator(`//td[${OncHistoryColumn.LMS_NECROSIS}]//mat-form-field//input`);
                break;
            default:
                //Throw error since only OS2 and LMS have a tumor size field
                throw new Error(`Study name ${studyName} was used in fillNecrosisField(). Only OS2 or LMS should be used!`);
        }
        await necrosisField.fill(this._necrosis);
    }

    public set viableTumor(tumorDescription: string) {
        this._viableTumor = tumorDescription;
    }

    public get viableTumor(): string {
        return this._viableTumor;
    }

    public async fillViableTumorField(currentRow: Locator, viableTumorDescription: string): Promise<void> {
        this._viableTumor = viableTumorDescription;
        const viableTumorField = currentRow.locator(`//td[${OncHistoryColumn.VIABLE_TUMOR}]//mat-form-field//input`);
        await viableTumorField.fill(this._viableTumor);
    }

    public set slidesToRequest(requestDescription: string) {
        this._slidesToRequest = requestDescription;
    }

    public get slidesToRequest(): string {
        return this._slidesToRequest;
    }

    public async fillSlidesToRequestField(currentRow: Locator, slides: string): Promise<void> {
        this._slidesToRequest = slides;
        const slidesToRequestField = currentRow.locator(`//td[${OncHistoryColumn.LMS_SLIDES_TO_REQUEST}]//mat-form-field//input`);
        await slidesToRequestField.fill(this._slidesToRequest);
    }

    public set facilityWhereSampleWasReviewed(facilityName: string) {
        this._facilityWhereSampleWasReviewed = facilityName;
    }

    public get facilityWhereSampleWasReceived(): string {
        return this._facilityWhereSampleWasReviewed;
    }

    public async fillFacilityWhereSampleWasReceivedField(currentRow: Locator, facility: string): Promise<void> {
        this._facilityWhereSampleWasReviewed = facility;
        const facilityField = currentRow.locator(`//td[${OncHistoryColumn.LMS_FACILITY_WHERE_SAMPLE_REVIEWED}]//mat-form-field//input`);
        await facilityField.fill(this._facilityWhereSampleWasReviewed);
    }

    public set slidesTotal(slideDescription: string) {
        this._slidesTotal = slideDescription;
    }

    public get slidesTotal(): string {
        return this._slidesTotal;
    }

    public async fillSlidesTotalField(currentRow: Locator, slidesDescription: string): Promise<void> {
        this._slidesTotal = slidesDescription;
        const slidesTotalField = currentRow.locator(`//td[${OncHistoryColumn.LMS_SLIDES_TOTAL}]//mat-form-field//input`);
        await slidesTotalField.fill(this._slidesToRequest);
    }

    public set treatmentEffect(effectOfTreatment: string) {
        this._treatmentEffect = effectOfTreatment;
    }

    public get treatmentEffect(): string {
        return this._treatmentEffect;
    }

    public async fillTreatmentEffectField(currentRow: Locator, treatmentEffect: string): Promise<void> {
        this._treatmentEffect = treatmentEffect;
        const treatmentEffecrField = currentRow.locator(`//td[${OncHistoryColumn.LMS_TREATMENT_EFFECT}]//mat-form-field//input`);
        await treatmentEffecrField.fill(this._treatmentEffect);
    }

    public async inputOncHistory(opts: {
        dateOfPX: string,
        accessionNumber: string,
        facility: string,
        phone: string,
        fax: string,
        typeOfPX?: string,
        locationOfPX?: string,
        histology?: string,
        destructionPolicy?: string
    }): Promise<void> {
        const { dateOfPX, accessionNumber, facility, phone, fax, typeOfPX = '', locationOfPX = '', histology = '', destructionPolicy = '' } = opts;
        const row = await this.getNextAvailableRow();
        await this.fillDateOfPXField(row, dateOfPX);
        await this.fillAccessionNumberField(row, accessionNumber);
        await this.fillFacilityNameField(row, facility);
        await this.fillFacilityPhoneNumberField(row, phone);
        await this.fillFacilityFaxNumberField(row, fax);
        await this.fillTypeOfPXField(row, typeOfPX);
        await this.fillLocationOfPXField(row, locationOfPX);
        await this.fillHistologyField(row, histology);
        await this.fillDestructionPolicyField(row, destructionPolicy);
        await this.setOncHistoryDetailID(row); //Ids are given to each row afer at least 1 input in any field in that row
    }

    public async inputOncHistoryOsteo(opts: {
        dateOfPX: string,
        accessionNumber: string,
        facility: string,
        phone: string,
        fax: string,
        typeOfPX?: string,
        locationOfPX?: string,
        histology?: string,
        destructionPolicy?: string,
        blocksWithTumor?: string,
        tumorSize?: string,
        localControl?: GeneralAnswer,
        necrosis?: string,
        viableTumor?: string,
        ffpe?: GeneralAnswer,
        decalcification?: Decalcification,
        blocksToRequest?: string
    }): Promise<void> {
        const row = await this.getNextAvailableRow();
        const {
            dateOfPX,
            accessionNumber,
            facility,
            phone,
            fax,
            typeOfPX = '',
            locationOfPX = '',
            histology = '',
            destructionPolicy = '',
            blocksWithTumor = '',
            tumorSize = '',
            localControl = GeneralAnswer.BLANK,
            necrosis = '',
            viableTumor = '',
            ffpe = GeneralAnswer.BLANK,
            decalcification = Decalcification.BLANK,
            blocksToRequest = ''
        } = opts;
        await this.fillDateOfPXField(row, dateOfPX);
        await this.fillAccessionNumberField(row, accessionNumber);
        await this.fillFacilityNameField(row, facility);
        await this.fillFacilityPhoneNumberField(row, phone);
        await this.fillFacilityFaxNumberField(row, fax);
        await this.fillTypeOfPXField(row, typeOfPX);
        await this.fillLocationOfPXField(row, locationOfPX);
        await this.fillHistologyField(row, histology);
        await this.fillDestructionPolicyField(row, destructionPolicy);
        await this.fillBlocksWithTumorField(row, blocksWithTumor);
        await this.fillTumorSizeField(row, StudyEnum.OSTEO2, tumorSize);
        await this.fillLocalControlDropdown(row, localControl);
        await this.fillNecrosisField(row, StudyEnum.OSTEO2, necrosis);
        await this.fillViableTumorField(row, viableTumor);
        await this.fillFFPEDropdown(row, ffpe);
        await this.fillDecalcificationDropdown(row, decalcification);
        await this.fillBlockToRequestField(row, blocksToRequest);
        await this.setOncHistoryDetailID(row); //Ids are given to each row afer at least 1 input in any field in that row
    }

    public async inputOncHistoryLMS(opts: {
        dateOfPX: string,
        accessionNumber: string,
        facility: string,
        phone: string,
        fax: string,
        typeOfPX?: string,
        locationOfPX?: string,
        histology?: string,
        destructionPolicy?: string,
        tumorSize?: string,
        slidesToRequest?: string,
        facilityWhereSampleWasReviewed?: string,
        slidesTotal?: string,
        blocksToRequest?: string,
        treatmentEffect?: string,
        viableTumor?: string,
        necrosis?: string
    }): Promise<void> {
        const row = await this.getNextAvailableRow();
        const {
            dateOfPX,
            accessionNumber,
            facility,
            phone,
            fax,
            typeOfPX = '',
            locationOfPX = '',
            histology = '',
            destructionPolicy = '',
            tumorSize = '',
            slidesToRequest = '',
            facilityWhereSampleWasReviewed = '',
            slidesTotal = '',
            blocksToRequest = '',
            treatmentEffect = '',
            viableTumor = '',
            necrosis = ''
        } = opts;
        await this.fillDateOfPXField(row, dateOfPX);
        await this.fillAccessionNumberField(row, accessionNumber);
        await this.fillFacilityNameField(row, facility);
        await this.fillFacilityPhoneNumberField(row, phone);
        await this.fillFacilityFaxNumberField(row, fax);
        await this.fillTypeOfPXField(row, typeOfPX);
        await this.fillLocationOfPXField(row, locationOfPX);
        await this.fillHistologyField(row, histology);
        await this.fillDestructionPolicyField(row, destructionPolicy);
        await this.fillTumorSizeField(row, StudyEnum.LMS, tumorSize);
        await this.fillSlidesToRequestField(row, slidesToRequest);
        await this.fillFacilityWhereSampleWasReceivedField(row, facilityWhereSampleWasReviewed);
        await this.fillSlidesTotalField(row, slidesTotal);
        await this.fillBlockToRequestField(row, blocksToRequest);
        await this.fillTreatmentEffectField(row, treatmentEffect);
        await this.fillViableTumorField(row, viableTumor);
        await this.fillNecrosisField(row, StudyEnum.LMS, necrosis);
        await this.setOncHistoryDetailID(row); //Ids are given to each row afer at least 1 input in any field in that row
    }

    /* Basic onc history related functions  */
    /**
     * Clicks the checkbox that appears in an onc history row as soon as the row is set to Request status
     */
    public async requestOncHistoryDetail(): Promise<void> {
        const checkbox = await this.getRequestOncHistoryDetailCheckbox();
        await checkbox.check();
    }

    public async accessTissueRequestPage(): Promise<void> {
        const button = await this.getTissueRequestPageButton();
        await button.click();
    }

    public async setOncHistoryRequestStatus(status: OncHistoryRequestStatus): Promise<void> {
        const id = this.assertOncHistoryIDIsAssigned();
        const statusDropdownOptions = this.page.locator(`//tr[@id=${id}]//td[contains(@class, 'request-td')]//mat-select`);
        await statusDropdownOptions.filter({ hasText: status }).click();
    }

    public async getOncHistoryRequestStatus(): Promise<string> {
        const id = this.assertOncHistoryIDIsAssigned();
        const statusDropdownOptions = this.page.locator(`//tr[@id=${id}]//td[contains(@class, 'request-td')]//mat-select`);
        const status = await statusDropdownOptions.innerText();
        return status;
    }

    /* Locators */


    /* Onc History specific helper methods */
    private async getNextAvailableRow(): Promise<Locator> {
        const availableRows = this.page.locator('//app-onc-history-detail//tbody//tr').all();
        const amountOfRows = (await availableRows).length;
        const row = this.page.locator(`//app-onc-history-detail//tbody//tr[${amountOfRows}]`); //Gets the latest row that is likely empty & ready to go
        return row;
    }

    private async getRequestOncHistoryDetailCheckbox(): Promise<Locator> {
        const id = this.assertOncHistoryIDIsAssigned();

        //Checkbox only appears if the onc history status is set to Request
        const requestStatus = await this.getOncHistoryRequestStatus();
        expect(requestStatus, `ERROR: Onc History id ${id}'s status is ${requestStatus}, not Request; Onc History request checkbox cannot be seen`).
        toBe(OncHistoryRequestStatus.REQUEST as string);

        const checkbox = this.page.locator(`//tr[@id='${id}']//button[@tooltip='Tissue information']/preceding-sibling::mat-checkbox`);
        return checkbox;
    }

    private async getTissueRequestPageButton(): Promise<Locator> {
        const id = this.assertOncHistoryIDIsAssigned();
        const button = this.page.locator(`//tr[@id='${id}']//button[@tooltip='Tissue information']`);
        return button;
    }

    private assertOncHistoryIDIsAssigned(): number {
        //First check to make sure that the onc history deatil has an assigned id
        const id = this._oncHistoryID;
        expect(id, 'ERROR: Onc History id is null').not.toBeNull();
        return id;
    }
}
