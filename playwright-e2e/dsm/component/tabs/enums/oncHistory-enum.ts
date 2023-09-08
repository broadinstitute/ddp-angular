export enum OncHistoryRequestStatus {
    NEEDS_REVIEW = 'Needs Review',
    DONT_REQUEST = `Don't Request`,
    ON_HOLD = 'On Hold',
    REQUEST = 'Request',
    SENT = 'Sent',
    RECEIVED = 'Received',
    RETURNED = 'Returned',
    UNABLE_TO_OBTAIN = 'Unable To Obtain',
}

export enum Decalcification {
    NITRIC_ACID = `Nitric Acid (includes Perenyi's fluid)`,
    HYDROCHLORIC_ACID = `Hydrochloric Acid (includes Von Ebner's solution)`,
    FORMIC_ACID = `Formic Acid (includes Evans/Kajian, Kristensen/Gooding/Stewart)`,
    ACID_NOS = 'Acid NOS',
    EDTA = 'EDTA',
    SAMPLE_NOT_DECALCIFIED = 'Sample not decalcified',
    OTHER = 'Other',
    UNKNOWN = 'Unknown',
    IMMUNOCAL = 'Immunocal/Soft Decal',
    BLANK = '',
}

export enum GeneralAnswer {
    YES = 'Yes',
    NO = 'No',
    UNKNOWN = 'Unknown',
    BLANK = '',
}

/* Lists the placements of certain columns in the onc history. Note: Number assumes 0-based/counting from zero */
export enum OncHistoryColumn {
    DATE_OF_PX = 2,
    TYPE_OF_PX = 3,
    LOCATION_OF_PX = 4,
    HISTOLOGY = 5,
    ACCESSION_NUMBER = 6,
    FACILITY = 7,
    PHONE = 8,
    FAX = 9,
    DESTRUCTION_POLICY = 10,
    OS2_LOCAL_CONTROL = 11,
    LMS_TUMOR_SIZE = 11,
    LMS_SLIDES_TO_REQUEST = 12,
    OS2_TUMOR_SIZE = 12,
    LMS_FACILITY_WHERE_SAMPLE_REVIEWED = 13,
    OS2_BLOCKS_WITH_TUMOR = 11,
    LMS_SLIDES_TOTAL = 14,
    LMS_BLOCKS_TO_REQUEST = 15,
    OS2_NECROSIS = 14,
    LMS_TREATMENT_EFFECT = 16,
    OS2_FFPE = 16,
    OS2_DECALCIFICATION = 17,
    VIABLE_TUMOR = 17,
    LMS_NECROSIS = 18,
    REQUEST_STATUS = 21,
}
