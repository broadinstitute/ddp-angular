import {AdministrationUser} from "./interfaces/administrationUser";

export const testData: AdministrationUser[] = [
  {
    name: 'First User',
    email: 'firstUser@gmail.com',
    phone: '12-2313-31231',
    roles: [
      {
        roleGuid: 'upload_onc_history',
        name: 'Upload onc history',
        isSelected: true
      },
      {
        roleGuid: 'upload_ror_file',
        name: 'Upload return of results file',
        isSelected: true
      },
      {
        roleGuid: 'view_shared_learnings',
        name: 'View shared learnings',
        isSelected: false
      }
    ]
  },
  {
    name: 'Second User',
    email: 'secondUser@gmail.com',
    phone: '12-2313-31231',
    roles: [
      {
        roleGuid: 'mercury_order_sequencing',
        name: 'Mercury order sequencing',
        isSelected: false
      },
      {
        roleGuid: 'survey_creation',
        name: 'Create surveys',
        isSelected: false
      }
    ]
  },
  {
    name: 'Third User',
    email: 'thirdUser@gmail.com',
    phone: '12-2313-31231',
    roles: [
      {
        roleGuid: 'upload_ror_file',
        name: 'Upload return of results file',
        isSelected: true
      },
      {
        roleGuid: 'view_shared_learnings',
        name: 'View shared learnings',
        isSelected: true
      },
      {
        roleGuid: 'survey_creation',
        name: 'Create surveys',
        isSelected: false
      }
    ]
  },
  {
    name: 'Giorgi Charkviani',
    email: 'gcharkvi@broadinstitute.org',
    phone: '12-31321-31231',
    roles: [
      {
        roleGuid: 'upload_onc_history',
        name: 'Upload onc history',
        isSelected: false
      },
      {
        roleGuid: 'upload_ror_file',
        name: 'Upload return of results file',
        isSelected: false
      },
      {
        roleGuid: 'view_shared_learnings',
        name: 'View shared learnings',
        isSelected: false
      },
      {
        roleGuid: 'mercury_order_sequencing',
        name: 'Mercury order sequencing',
        isSelected: true
      },
      {
        roleGuid: 'survey_creation',
        name: 'Create surveys',
        isSelected: true
      }
    ]
  }
]
