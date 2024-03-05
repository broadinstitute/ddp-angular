export interface OsteoOncHistoryUpload {
  RECORD_ID: string,
  REQUEST_STATUS: string;
  DATE_PX?: string,
  TYPE_PX?: string,
  LOCATION_PX?: string,
  HISTOLOGY?: string,
  ACCESSION?: string,
  FACILITY?: string,
  PHONE?: string;
  FAX?: string;
  DESTRUCTION?: string;
  BLOCKS_WITH_TUMOR?: string;
  TUMOR_SIZE?: string;
  LOCAL_CONTROL?: string;
  NECROSIS?: string;
  VIABLE_TUMOR?: string;
  FFPE?: string;
  DECALCIFICATION?: string;
  BLOCK_TO_REQUEST?: string;
}

export interface LmsOncHistoryUpload {
  RECORD_ID: string,
  FACILITY_PATH_REVIEW?: string,
  FACILITY_PX?: string;
  ACCESSION?: string,
  DATE_PX?: string,
  TYPE_PX?: string,
  LOCATION_PX?: string,
  HISTOLOGY?: string,
  REQUEST_STATUS: string;
  TUMOR_SIZE?: string;
  VIABLE_TUMOR?: string;
  NECROSIS?: string;
  TX_EFFECT?: string;
  BLOCKS_TO_REQUEST?: string;
  SLIDES_TO_REQUEST?: string;
  SLIDES_TOTAL?: string;
}

export interface PanCanOncHistoryUpload {
  RECORD_ID: string,
  REQUEST_STATUS: string;
  DATE_PX?: string,
  TYPE_PX?: string,
  LOCATION_PX?: string,
  HISTOLOGY?: string,
  ACCESSION?: string,
  FACILITY?: string,
  PHONE?: string;
  FAX?: string;
  DESTRUCTION?: string;
}

export interface BrainOncHistoryUpload {
  RECORD_ID: string,
  FACILITY?: string,
  PHONE?: string;
  FAX?: string;
  ACCESSION?: string,
  DATE_PX?: string,
  TYPE_PX?: string,
  LOCATION_PX?: string,
  HISTOLOGY?: string,
  REQUEST_STATUS: string;
  DESTRUCTION?: string;
}
