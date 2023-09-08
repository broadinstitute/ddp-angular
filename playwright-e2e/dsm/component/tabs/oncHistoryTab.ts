import {Locator, Page} from '@playwright/test';
import OncHistoryDetailRow from './oncHistoryDetailRow';
import { Decalcification, GeneralAnswer } from './enums/oncHistory-enum';
import { StudyEnum } from '../navigation/enums/selectStudyNav-enum';

export default class OncHistoryTab {
    constructor(private readonly page: Page) {}

    public get addOncHistory() {
        const page = this.page;
        let oncHistoryDetails: OncHistoryDetailRow[];

        return new class {
            async createOncHistoryDetail(opts: {
                study: StudyEnum,
                dateOfPX: string,
                accessionNumber: string,
                facility: string,
                phone: string,
                fax: string,
                typeOfPX?: string,
                locationOfPX?: string,
                histology?: string,
                destructionPolicy?: string,
                localControl?: GeneralAnswer,
                decalcification?: Decalcification,
                ffpe?: GeneralAnswer,
                blocksWithTumor?: string,
                tumorSize?: string,
                blocksToRequest?: string,
                necrosis?: string,
                viableTumor?: string,
                slidesToRequest?: string,
                facilityWhereSampleWasReviewed?: string,
                slidesTotal?: string,
                treatmentEffect?: string
            }): Promise<void> {
                const {
                    study,
                    dateOfPX,
                    accessionNumber,
                    facility,
                    phone,
                    fax,
                    typeOfPX = '',
                    locationOfPX = '',
                    histology = '',
                    destructionPolicy = '',
                    localControl = GeneralAnswer.BLANK,
                    decalcification = Decalcification.BLANK,
                    ffpe = GeneralAnswer.BLANK,
                    blocksWithTumor = '',
                    tumorSize = '',
                    blocksToRequest = '',
                    necrosis = '',
                    viableTumor = '',
                    slidesToRequest = '',
                    facilityWhereSampleWasReviewed = '',
                    slidesTotal = '',
                    treatmentEffect = ''
                } = opts;
                const row = new OncHistoryDetailRow(page);
                switch (study) {
                    case StudyEnum.OSTEO2:
                        //Handle OS2 (CMI Clinical Study)
                        await row.inputOncHistoryOsteo({
                            dateOfPX,
                            accessionNumber,
                            facility,
                            phone,
                            fax,
                            typeOfPX,
                            locationOfPX,
                            histology,
                            destructionPolicy,
                            blocksWithTumor,
                            tumorSize,
                            localControl,
                            necrosis,
                            viableTumor,
                            ffpe,
                            decalcification,
                            blocksToRequest
                        });
                        break;
                    case StudyEnum.LMS:
                        //Handle LMS (CMI Clinical Study)
                        await row.inputOncHistoryLMS({
                            dateOfPX,
                            accessionNumber,
                            facility,
                            phone,
                            fax,
                            typeOfPX,
                            locationOfPX,
                            histology,
                            destructionPolicy,
                            tumorSize,
                            slidesToRequest,
                            facilityWhereSampleWasReviewed,
                            slidesTotal,
                            blocksToRequest,
                            treatmentEffect,
                            viableTumor,
                            necrosis
                        });
                        break;
                    default:
                        //Handle CMI Research studies
                        await row.inputOncHistory({
                            dateOfPX,
                            accessionNumber,
                            facility,
                            phone,
                            fax,
                            typeOfPX,
                            locationOfPX,
                            histology,
                            destructionPolicy,
                        });
                        break;
                }
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
