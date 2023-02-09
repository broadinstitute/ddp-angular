import {ClinicalPageComponent} from '../clinical-page/clinical-page.component';
import {Statics} from '../utils/statics';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {ShippingReportComponent} from '../shipping-report/shipping-report.component';
import {AuthGuard} from '../auth0/auth.guard';
import {ShippingComponent} from '../shipping/shipping.component';
import {ScanComponent} from '../scan/scan.component';
import {ShippingSearchComponent} from '../shipping-search/shipping-search.component';
import {UploadComponent} from '../upload/upload.component';
import {DiscardSampleComponent} from '../discard-sample/discard-sample.component';
import {PermalinkComponent} from '../permalink/permalink.component';
import {DiscardSamplePageComponent} from '../discard-sample-page/discard-sample-page.component';
import {LabelSettingsComponent} from '../label-settings/label-settings.component';
import {DrugListComponent} from '../drug-list/drug-list.component';
import {ParticipantListComponent} from '../participant-list/participant-list.component';
import {TissueListComponent} from '../tissue-list/tissue-list.component';
import {ParticipantPageComponent} from '../participant-page/participant-page.component';
import {ParticipantEventComponent} from '../participant-event/participant-event.component';
import {MedicalRecordComponent} from '../medical-record/medical-record.component';
import {TissuePageComponent} from '../tissue-page/tissue-page.component';
import {FieldSettingsComponent} from '../field-settings/field-settings.component';
import {DataReleaseComponent} from '../data-release/data-release.component';
import {MailingListComponent} from '../mailing-list/mailing-list.component';
import {AbstractionSettingsComponent} from '../abstraction-settings/abstraction-settings.component';
import {SurveyComponent} from '../survey/survey.component';
import {NDIUploadComponent} from '../ndiupload/ndiupload.component';
import {UserSettingComponent} from '../user-setting/user-setting.component';
import {TestDssComponent} from '../test-dss/test-dss.component';
import {PdfDownloadComponent} from '../pdf-download/pdf-download.component';
import {DssErrorPageComponent} from '../test-dss/dss-error-page/dss-error-page.component';
import {ParticipantExitComponent} from '../participant-exit/participant-exit.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllStudiesComponent} from './all-studies.component';
import {HomeComponent} from '../home/home.component';
import {StoolUploadComponent} from '../stool-upload/stool-upload.component';
import {ExportHelpComponent} from '../help/help.component';
import {DashboardStatisticsComponent} from '../dashboard-statistics/dashboard-statistics.component';
import {ScannerComponent} from "../scanner/scanner.component";




export const AppRoutes: Routes = [
  {path: '', component: AllStudiesComponent, children: [
      // Samples
      {path: '', component: HomeComponent},
      {path: Statics.UNSENT_OVERVIEW, component: DashboardComponent, canActivate: [AuthGuard]},
      {path: Statics.SHIPPING_DASHBOARD, component: DashboardComponent, canActivate: [AuthGuard]},
      {path: 'shippingReport', component: ShippingReportComponent, canActivate: [AuthGuard]},

      {path: Statics.SHIPPING_QUEUE, component: ShippingComponent, canActivate: [AuthGuard]},
      {path: Statics.SHIPPING_ERROR, component: ShippingComponent, canActivate: [AuthGuard]},
      {path: Statics.SHIPPING_SENT, component: ShippingComponent, canActivate: [AuthGuard]},
      {path: Statics.SHIPPING_RECEIVED, component: ShippingComponent, canActivate: [AuthGuard]},
      {path: Statics.SHIPPING_OVERVIEW, component: ShippingComponent, canActivate: [AuthGuard]},
      {path: Statics.SHIPPING_DEACTIVATED, component: ShippingComponent, canActivate: [AuthGuard]},
      {path: Statics.SHIPPING_UPLOADED, component: ShippingComponent, canActivate: [AuthGuard]},
      {path: Statics.SHIPPING_TRIGGERED, component: ShippingComponent, canActivate: [AuthGuard]},

      {path: 'scan', component: ScannerComponent, canActivate: [AuthGuard]},
      {path: 'shippingSearch', component: ShippingSearchComponent, canActivate: [AuthGuard]},
      {path: 'upload', component: UploadComponent, canActivate: [AuthGuard]},
      {path: 'discardList', component: DiscardSampleComponent, canActivate: [AuthGuard]},
      {path: 'discardSample', component: DiscardSamplePageComponent, canActivate: [AuthGuard]},
      {path: 'labelSettings', component: LabelSettingsComponent, canActivate: [AuthGuard]},
      {path: 'drugList', component: DrugListComponent, canActivate: [AuthGuard]},
      {path: 'clinicalOrders', component: ClinicalPageComponent, canActivate: [ AuthGuard ]},

      // Study
      {path: Statics.MEDICALRECORD_DASHBOARD, component: DashboardComponent, canActivate: [AuthGuard]},
      {path: 'participantList', component: ParticipantListComponent, canActivate: [AuthGuard]},
      {path: 'tissueList', component: TissueListComponent, canActivate: [AuthGuard]},

//  { path: Statics.PARTICIPANT, component: ParticipantComponent, canActivate: [AuthGuard] },
      {path: 'participantPage', component: ParticipantPageComponent, canActivate: [AuthGuard]},
      {path: Statics.MEDICALRECORD, component: MedicalRecordComponent, canActivate: [AuthGuard]},
      {path: 'tissue', component: TissuePageComponent, canActivate: [AuthGuard]},

      {path: 'fieldSettings', component: FieldSettingsComponent, canActivate: [AuthGuard]},
      {path: 'dataRelease', component: DataReleaseComponent, canActivate: [AuthGuard]},
      {path: 'medicalRecordAbstractionSettings', component: AbstractionSettingsComponent, canActivate: [AuthGuard]},
      // { path: 'dataRelease', component: DataReleaseComponent, canActivate: [AuthGuard] },

      {path: 'mailingList', component: MailingListComponent, canActivate: [AuthGuard]},
      {path: 'participantExit', component: ParticipantExitComponent, canActivate: [AuthGuard]},
      {path: 'survey', component: SurveyComponent, canActivate: [AuthGuard]},
      {path: 'participantEvent', component: ParticipantEventComponent, canActivate: [AuthGuard]},
      {path: 'downloadPDF', component: PdfDownloadComponent, canActivate: [AuthGuard]},
      {path: 'customizeView', component: ShippingSearchComponent, canActivate: [AuthGuard]},
      {path: 'ndi', component: NDIUploadComponent, canActivate: [AuthGuard]},
      {path: 'stoolUpload', component: StoolUploadComponent, canActivate: [AuthGuard]},


      {path: 'userSettings', component: UserSettingComponent, canActivate: [AuthGuard]},

      // Permalink
      {
        path: Statics.PERMALINK + Statics.MEDICALRECORD_URL + '/:participantid/:medicalrecordid',
        component: PermalinkComponent,
        canActivate: [AuthGuard]
      },
      {path: Statics.PERMALINK + Statics.SHIPPING_URL, component: ShippingComponent, canActivate: [AuthGuard]},
      {path: Statics.PERMALINK + Statics.UNSENT_OVERVIEW_URL, component: DashboardComponent, canActivate: [AuthGuard]},
      {path: 'statisticsDashboard', component: DashboardStatisticsComponent, canActivate: [AuthGuard]},

      {path: 'test-dss', component: TestDssComponent},
      {path: 'dss-error', component: DssErrorPageComponent},
      {path: 'help', component: ExportHelpComponent}
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(AppRoutes)],
  exports: [RouterModule]
})

export class AllStudiesRoutingModule {}
