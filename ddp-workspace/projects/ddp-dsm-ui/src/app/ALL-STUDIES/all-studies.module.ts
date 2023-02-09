import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ConditionalFormDataComponent} from '../conditional-form-data/conditional-form-data.component';
import {FileDownloadComponent} from '../file-download/file-download.component';
import {AllStudiesRoutingModule} from './all-studies.routing.module';
import {HomeComponent} from '../home/home.component';
import {KitLabelComponent} from '../kit-label/kit-label.component';
import {AddressComponent} from '../address/address.component';
import {ScanComponent} from '../scan/scan.component';
import {ScanPairComponent} from '../scan-pair/scan-pair.component';
import {MedicalRecordComponent} from '../medical-record/medical-record.component';
import {ModalComponent} from '../modal/modal.component';
import {AssigneesComponent} from '../assignee/assignee.component';
import {ParticipantPageComponent} from '../participant-page/participant-page.component';
import {PermalinkComponent} from '../permalink/permalink.component';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {MailingListComponent} from '../mailing-list/mailing-list.component';
import {ErrorLabelComponent} from '../error-label/error-label.component';
import {ShippingComponent} from '../shipping/shipping.component';
import {UploadComponent} from '../upload/upload.component';
import {ParticipantExitComponent} from '../participant-exit/participant-exit.component';
import {UserSettingComponent} from '../user-setting/user-setting.component';
import {ScanValueComponent} from '../scan-value/scan-value.component';
import {BannerComponent} from '../banner/banner.component';
import {FieldDatepickerComponent} from '../field-datepicker/field-datepicker.component';
import {OncHistoryDetailComponent} from '../onc-history-detail/onc-history-detail.component';
import {TissuePageComponent} from '../tissue-page/tissue-page.component';
import {TissueComponent} from '../tissue/tissue.component';
import {LookupComponent} from '../lookup/lookup.component';
import {SurveyComponent} from '../survey/survey.component';
import {ShippingReportComponent} from '../shipping-report/shipping-report.component';
import {DiscardSampleComponent} from '../discard-sample/discard-sample.component';
import {DiscardSamplePageComponent} from '../discard-sample-page/discard-sample-page.component';
import {FieldSettingsComponent} from '../field-settings/field-settings.component';
import {MedicalRecordLogSortPipe} from '../pipe/medical-record-log-sort.pipe';
import {DashboardDateSortPipe} from '../pipe/dashboard-date-sort.pipe';
import {KitRequestSortPipe} from '../pipe/kit-request-sort.pipe';
import {KitRequestFilterPipe} from '../pipe/kit-request-filter.pipe';
import {ParticipantExitSortPipe} from '../pipe/participant-exit-sort.pipe';
import {OncHistoryDetailSortPipe} from '../pipe/onc-history-detail-sort.pipe';
import {ButtonSelectTitleCasePipe} from '../pipe/button-select-title-case.pipe';
import {OrdinalPipe} from '../pipe/ordinal.pipe';
import {LabelSettingsComponent} from '../label-settings/label-settings.component';
import {DrugListComponent} from '../drug-list/drug-list.component';
import {ParticipantEventComponent} from '../participant-event/participant-event.component';
import {ShippingSearchComponent} from '../shipping-search/shipping-search.component';
import {FieldFilepickerComponent} from '../field-filepicker/field-filepicker.component';
import {SurveySortPipe} from '../pipe/survey-sort.pipe';
import {SurveyFilterPipe} from '../pipe/survey-filter.pipe';
import {DrugFilterPipe} from '../pipe/drug-filter.pipe';
import {PdfDownloadComponent} from '../pdf-download/pdf-download.component';
import {DateFormatPipe} from '../pipe/custom-date.pipe';
import {NDIUploadComponent} from '../ndiupload/ndiupload.component';
import {MedicalRecordAbstractionComponent} from '../medical-record-abstraction/medical-record-abstraction.component';
import {AbstractionGroupComponent} from '../abstraction-group/abstraction-group.component';
import {AbstractionSettingsComponent} from '../abstraction-settings/abstraction-settings.component';
import {AbstractionFieldComponent} from '../abstraction-field/abstraction-field.component';
import {DataReleaseComponent} from '../data-release/data-release.component';
import {FieldTypeaheadComponent} from '../field-typeahead/field-typeahead.component';
import {FieldQuestionComponent} from '../field-question/field-question.component';
import {FieldQuestionArrayComponent} from '../field-question-array/field-question-array.component';
import {FieldMultiTypeComponent} from '../field-multi-type/field-multi-type.component';
import {FieldMultiTypeArrayComponent} from '../field-multi-type-array/field-multi-type-array.component';
import {TissueListComponent} from '../tissue-list/tissue-list.component';
import {FilterColumnComponent} from '../filter-column/filter-column.component';
import {ParticipantListComponent} from '../participant-list/participant-list.component';
import {ActivityDataComponent} from '../activity-data/activity-data.component';
import {SearchBarComponent} from '../search-bar/search-bar.component';
import {InvitationDataComponent} from '../invitation-data/invitation-data.component';
import {ParticipantUpdateResultDialogComponent} from '../dialogs/participant-update-result-dialog.component';
import {FormDataComponent} from '../form-data/form-data.component';
import {AddFamilyMemberComponent} from '../popups/add-family-member/add-family-member.component';
import {FieldTableComponent} from '../field-table/field-table.component';
import {dynamicFormTypeAndStudyRGP} from '../participant-page/pipes/dynamicFormTypeForRgp.pipe';
import {TestDssComponent} from '../test-dss/test-dss.component';
import {DssErrorPageComponent} from '../test-dss/dss-error-page/dss-error-page.component';
import {LoadingModalComponent} from '../modals/loading-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {NgxPageScrollModule} from 'ngx-page-scroll';
import {DataTableModule} from '@pascalhonegger/ng-datatable';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {DatepickerModule} from 'ngx-bootstrap/datepicker';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {CookieModule} from 'ngx-cookie';
import {ModalModule} from 'ngx-bootstrap/modal';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {SortableModule} from 'ngx-bootstrap/sortable';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {DragulaModule} from 'ng2-dragula';
import {AuthGuard} from '../auth0/auth.guard';
import {Utils} from '../utils/utils';
import {Statics} from '../utils/statics';
import {Language} from '../utils/language';
import {NavigationComponent} from '../navigation/navigation.component';
import {AllStudiesComponent} from './all-studies.component';
import {BuildingFactoryService} from '../activity-data/services/buildingFactory.service';
import { CohortTagComponent } from '../tags/cohort-tag/cohort-tag.component';
import {MatChipsModule} from '@angular/material/chips';
import { BulkCohortTagModalComponent } from '../tags/cohort-tag/bulk-cohort-tag-modal/bulk-cohort-tag-modal.component';
import { OpenDialogDirective } from '../directive/open-loading-modal.directive';
import {SequencingOrderComponent} from '../sequencing-order/sequencing-order.component';
import {ClinicalPageComponent} from '../clinical-page/clinical-page.component';
import {StoolUploadComponent} from '../stool-upload/stool-upload.component';
import {DashboardStatisticsComponent} from '../dashboard-statistics/dashboard-statistics.component';
import {DashboardStatisticsService} from '../services/dashboard-statistics.service';
import {QrCodeComponent} from '../qr-code/qr-code.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';

import { MatFormFieldModule } from '@angular/material/form-field';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import {RadioButtonDirective} from '../form-data/directives/radio-button.directive';
import {PlotlyChartsComponent} from '../dashboard-statistics/components/plotly-charts/plotly-charts.component';
import {
  MatrixAnswerTableComponent
} from '../activity-data/components/matrix-answer-table.component';
import {NoDataPipe} from '../participant-list/pipes/noData.pipe';
import {CountsTableComponent} from '../dashboard-statistics/components/counts-table/counts-table.component';
import {MatSortModule} from '@angular/material/sort';
import {DateRangeComponent} from '../dashboard-statistics/components/date-range/date-range.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {DateRangeErrorPipe} from '../dashboard-statistics/pipes/dateRangeError.pipe';
import {KeyValuePairPipe} from '../dashboard-statistics/pipes/KeyValuePair.pipe';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ScannerComponent} from '../scanner/scanner.component';


PlotlyModule.plotlyjs = PlotlyJS;


@NgModule({
  declarations: [
    HomeComponent,
    NavigationComponent,
    AllStudiesComponent,
    KitLabelComponent,
    AddressComponent,
    ScanComponent,
    ScanPairComponent,
    MedicalRecordComponent,
    ModalComponent,
    AssigneesComponent,
    ParticipantPageComponent,
    PermalinkComponent,
    DashboardComponent,
    MailingListComponent,
    ErrorLabelComponent,
    ShippingComponent,
    UploadComponent,
    ParticipantExitComponent,
    UserSettingComponent,
    ScanValueComponent,
    BannerComponent,
    QrCodeComponent,
    FieldDatepickerComponent,
    OncHistoryDetailComponent,
    TissuePageComponent,
    TissueComponent,
    LookupComponent,
    SurveyComponent,
    ShippingReportComponent,
    DiscardSampleComponent,
    DiscardSamplePageComponent,
    FieldSettingsComponent,
    MedicalRecordLogSortPipe,
    DashboardDateSortPipe,
    KitRequestSortPipe,
    KitRequestFilterPipe,
    ParticipantExitSortPipe,
    OncHistoryDetailSortPipe,
    ButtonSelectTitleCasePipe,
    OrdinalPipe,
    LabelSettingsComponent,
    DrugListComponent,
    ParticipantEventComponent,
    ShippingSearchComponent,
    FieldFilepickerComponent,
    SurveySortPipe,
    SurveyFilterPipe,
    DrugFilterPipe,
    PdfDownloadComponent,
    DateFormatPipe,
    NDIUploadComponent,
    MedicalRecordAbstractionComponent,
    AbstractionGroupComponent,
    AbstractionSettingsComponent,
    AbstractionFieldComponent,
    DataReleaseComponent,
    FieldTypeaheadComponent,
    FieldQuestionComponent,
    FieldQuestionArrayComponent,
    FieldMultiTypeComponent,
    FieldMultiTypeArrayComponent,
    TissueListComponent,
    FilterColumnComponent,
    ParticipantListComponent,
    ActivityDataComponent,
    SearchBarComponent,
    InvitationDataComponent,
    ParticipantUpdateResultDialogComponent,
    FormDataComponent,
    AddFamilyMemberComponent,
    FieldTableComponent,
    dynamicFormTypeAndStudyRGP,
    TestDssComponent,
    DssErrorPageComponent,
    LoadingModalComponent,
    CohortTagComponent,
    StoolUploadComponent,
    BulkCohortTagModalComponent,
    OpenDialogDirective,
    SequencingOrderComponent,
    ClinicalPageComponent,
    FileDownloadComponent,
    DashboardStatisticsComponent,
    PlotlyChartsComponent,
    MatrixAnswerTableComponent,
    ConditionalFormDataComponent,
    RadioButtonDirective,
    NoDataPipe,
    CountsTableComponent,
    DateRangeComponent,
    DateRangeErrorPipe,
    KeyValuePairPipe,
    ScannerComponent
  ],
  imports: [
    CommonModule,
    AllStudiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatIconModule,
    NgxPageScrollModule,
    DataTableModule,
    NgxPaginationModule,
    MatProgressBarModule,
    MatChipsModule,
    TabsModule.forRoot(),
    DatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    CookieModule.forRoot(),
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    SortableModule.forRoot(),
    CookieModule.forRoot(),
    AccordionModule.forRoot(),
    TypeaheadModule.forRoot(),
    DragulaModule.forRoot(),
    PlotlyModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule
  ],
  providers: [
    Utils,
    BuildingFactoryService,
    AuthGuard,
    Statics,
    Language,
    DashboardStatisticsService
  ],
  exports: [RouterModule, MatFormFieldModule, MatInputModule]
})

export class AllStudiesModule {
}
