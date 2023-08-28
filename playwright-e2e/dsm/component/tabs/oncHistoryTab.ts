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
                treatmentEffect?: string,
            }): Promise<void> {
                switch (study) {
                    case StudyEnum.OSTEO2:
                        //Handle inputting onc history for OS2 - do a wait for a patch request and get the onc istory id after that

                        break;
                    case StudyEnum.LMS:
                        //Handle inputting onc history for LMS - do a wait for a patch request and get the onc istory id after that
                        break;
                    default:
                        //Handle inputting onc history for all other CMI research studies - do a wait for a patch request and get the onc istory id after that
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
