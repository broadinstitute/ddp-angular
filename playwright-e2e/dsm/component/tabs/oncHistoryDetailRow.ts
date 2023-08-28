import { OncHistoryDetail } from 'dsm/component/tabs/model/oncHistoryDetailModel';
import { Locator, Page, expect } from '@playwright/test';
import { OncHistoryColumn, OncHistoryRequestStatus } from './enums/oncHistory-enum';

export default class OncHistoryDetailRow {
    private _oncHistoryID!: number;
    private _dateOfPX!: string | Date;
    private _typeOfPX!: string;
    private _locationOfPx!: string;
    private _histology!: string;
    private _accessionNumber!: string;
    private _facility!: string;
    private _phone!: string;
    private _fax!: string;
    private _destructionPolicy!: string;

    constructor(protected readonly page: Page) {
        this._oncHistoryID;
        this._dateOfPX;
        this._typeOfPX;
        this._locationOfPx;
        this._histology;
        this._accessionNumber;
        this._facility;
        this._phone;
        this._fax;
        this._destructionPolicy;
    }

    /* Getters and Setters */

    public set oncHistoryID(id: number) {
        this._oncHistoryID = id;
    }

    public get oncHistoryID(): number {
        return this._oncHistoryID;
    }

    public set dateOfPX(diagnosisDate: string | Date) {
        this._dateOfPX = diagnosisDate;
    }

    public get dateOfPX(): string {
        return this._dateOfPX as string;
    }

    public set typeOfPX(diagnosisType: string) {
        this._typeOfPX = diagnosisType;
    }

    public get typeOfPX(): string {
        return this._typeOfPX;
    }

    public set locationOfPX(location: string) {
        this._locationOfPx = location;
    }

    public get locationOfPX(): string {
        return this._locationOfPx;
    }

    public set histology(histology: string) {
        this._histology = histology;
    }

    public get histology(): string {
        return this._histology;
    }

    public set accessionNumber(accessionNumber: string) {
        this._accessionNumber = accessionNumber;
    }

    public get accessionNumber(): string {
        return this._accessionNumber;
    }

    public set facility(facility: string) {
        this._facility = facility;
    }

    public get facility(): string {
        return this._facility;
    }

    public set phone(phoneNumber: string) {
        this._phone = phoneNumber;
    }

    public get phone(): string {
        return this._phone;
    }

    public set fax(faxNumber: string) {
        this._fax = faxNumber;
    }

    public get fax(): string {
        return this._fax;
    }

    public set destructionPolicy(amountOfYears: number | string) {
        this._destructionPolicy = amountOfYears as string;
    }

    public get destructionPolicy(): string {
        return this._destructionPolicy;
    }

    /* Basic onc history related functions  */
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
        const requestDropdown = this.page.locator(`//tr[@id='${id}']//td[${OncHistoryColumn.REQUEST_STATUS}]//mat-select`);
    }

    

    /* Locators */

    public getDownloadRequestDocumentsButton(): Locator {
        return this.page.getByRole('button', { name: 'Download Request Documents' });
    }

    public async clickDownloadRequestDocuments(): Promise<void> {
        const documentsButton = this.getDownloadRequestDocumentsButton();
        await documentsButton.click();
    }

    public getDownloadPDFBundleButton(): Locator {
        return this.page.getByRole('button', { name: 'Download PDF Bundle' });
    }

    public async clickDownloadPDFBundle(): Promise<void> {
        const bundleButton = this.getDownloadPDFBundleButton();
        await bundleButton.click();
    }

    /* Onc History specific helper methods */

    private async getRequestOncHistoryDetailCheckbox(): Promise<Locator> {
        const id = this.assertOncHistoryIDIsAssigned();

        //Checkbox only appears if the onc history status is set to Request
        const requestStatus = await this.getOncHistoryRequestStatus();
        expect(requestStatus, `ERROR: Onc History id ${id}'s status is ${requestStatus}, not Request - Onc History request checkbox cannot be seen`).
        toBe(OncHistoryRequestStatus.REQUEST);

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
