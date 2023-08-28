import {Locator, Page} from '@playwright/test';
import { LMSOncHistoryDetail, OncHistoryDetail, Osteo2OncHistoryDetail } from 'dsm/component/tabs/model/oncHistoryDetailModel';
import { GeneralAnswer, Decalcification } from './enums/oncHistory-enum';
import { StudyEnum } from '../navigation/enums/selectStudyNav-enum';

export default class OncHistoryTab {
    constructor(private readonly page: Page) {}

    public get addOncHistory() {
        const page = this.page;

        return new class implements OncHistoryDetail, Osteo2OncHistoryDetail, LMSOncHistoryDetail {
            async createOncHistoryDetail(opts: {
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
                const { dateOfPX, accessionNumber, facility, phone, fax, typeOfPX, locationOfPX, histology, destructionPolicy } = opts;
            }

            async createOsteoOncHistoryDetail(opts: {
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
                const { dateOfPX, accessionNumber, facility, phone, fax, typeOfPX, locationOfPX, histology, destructionPolicy } = opts;
            }

            async createLMSOncHistoryDetail(opts: {
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
                const { dateOfPX, accessionNumber, facility, phone, fax, typeOfPX, locationOfPX, histology, destructionPolicy } = opts;
            }
        }
    }

    public async clickDownloadRequestDocuments(): Promise<void> {
        const documentsButton = this.getDownloadRequestDocumentsButton();
        await documentsButton.click();
    }

    public async clickDownloadPDFBundle(): Promise<void> {
        const bundleButton = this.getDownloadPDFBundleButton();
        await bundleButton.click();
    }

    /* Locators */

    public getDownloadRequestDocumentsButton(): Locator {
        return this.page.getByRole('button', { name: 'Download Request Documents' });
    }

    public getDownloadPDFBundleButton(): Locator {
        return this.page.getByRole('button', { name: 'Download PDF Bundle' });
    }
}
