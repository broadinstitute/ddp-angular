export class DataAccessParameters {
  request_date: string; // required. Example: 2017-11-06
  researcher_name: string; // required
  org_name: string; // required
  org_dept: string;
  org_address_1: string; // required
  org_address_2: string;
  org_city: string; // required
  org_state: string;
  org_zip: string; // required
  org_country: string; // required
  researcher_email: string; // required
  researcher_phone: string;
  project_description: string; // required
  collaborators: string;
  research_use: string; // required
  disease_study: boolean;
  methods_development_study: boolean;
  controls_study: boolean;
  variation_study: boolean;
  other_study: boolean;
  other_study_text: string;
  survey_data_requested: boolean;
  genomic_data_requested: boolean;
  a_t_disease_areas: string;
  researcher_signature: string; // required
  signature_date: string; // required
  specific_request: string;
}



