import { Decalcification, GeneralAnswer, OncHistoryRequestStatus } from '../enums/oncHistory-enum'

export interface OncHistoryDetail {
    _oncHistoryID?: number,
    requestOncHistoryDetail(): Promise<void>,
    accessTissueRequestPage(): Promise<void>,
    dateOfPX?: string | Date,
    typeOfPX?: string,
    locationOfPX?: string,
    histology?: string,
    accessionNumber?: string,
    facility?: string,
    phone?: string,
    fax?: string,
    destructionPolicy?: string | number,
    setOncHistoryRequestStatus(status: OncHistoryRequestStatus): Promise<void>,
}

export interface Osteo2OncHistoryDetail extends OncHistoryDetail{
    localControl?: GeneralAnswer,
    decalcification?: Decalcification,
    ffpe?: GeneralAnswer,
    blocksWithTumor?: string,
    tumorSize?: string,
    blockToRequest?: string,
    necrosis?: string,
    viableTumor?: string,
}

export interface LMSOncHistoryDetail extends OncHistoryDetail{
    tumorSize?: string,
    slidesToRequest?: string,
    facilityWhereSampleWasReviewed?: string,
    slidesTotal?: string,
    blocksToRequest?: string,
    treatmentEffect?: string,
    viableTumor?: string,
    necrosis?: string,
}
