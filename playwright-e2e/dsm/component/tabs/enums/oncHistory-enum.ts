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
}

export enum GeneralAnswer {
    YES = 'Yes',
    NO = 'No',
    UNKNOWN = 'Unknown',
}
