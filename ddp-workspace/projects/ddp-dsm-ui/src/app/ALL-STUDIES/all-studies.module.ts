import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {RouterModule} from '@angular/router';
import {DataTableModule} from '@pascalhonegger/ng-datatable';
import {DragulaModule} from 'ng2-dragula';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {DatepickerModule} from 'ngx-bootstrap/datepicker';
import {ModalModule} from 'ngx-bootstrap/modal';
import {SortableModule} from 'ngx-bootstrap/sortable';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {CookieModule} from 'ngx-cookie';
import {NgxPageScrollModule} from 'ngx-page-scroll';
import {NgxPaginationModule} from 'ngx-pagination';
import {AbstractionFieldComponent} from '../abstraction-field/abstraction-field.component';
import {AbstractionGroupComponent} from '../abstraction-group/abstraction-group.component';
import {AbstractionSettingsComponent} from '../abstraction-settings/abstraction-settings.component';
import {ActivityDataComponent} from '../activity-data/activity-data.component';
import {BuildingFactoryService} from '../activity-data/services/buildingFactory.service';
import {AddEditDeleteUserComponent} from '../add-edit-delete-user/add-edit-delete-user.component';
import {AddressComponent} from '../address/address.component';
import {AssigneesComponent} from '../assignee/assignee.component';
import {AuthGuard} from '../auth0/auth.guard';
import {BannerComponent} from '../banner/banner.component';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {DataReleaseComponent} from '../data-release/data-release.component';
import {ParticipantUpdateResultDialogComponent} from '../dialogs/participant-update-result-dialog.component';
import {DiscardSamplePageComponent} from '../discard-sample-page/discard-sample-page.component';
import {DiscardSampleComponent} from '../discard-sample/discard-sample.component';
import {DrugListComponent} from '../drug-list/drug-list.component';
import {ErrorLabelComponent} from '../error-label/error-label.component';
import {FieldDatepickerComponent} from '../field-datepicker/field-datepicker.component';
import {FieldFilepickerComponent} from '../field-filepicker/field-filepicker.component';
import {FieldMultiTypeArrayComponent} from '../field-multi-type-array/field-multi-type-array.component';
import {FieldMultiTypeComponent} from '../field-multi-type/field-multi-type.component';
import {FieldQuestionArrayComponent} from '../field-question-array/field-question-array.component';
import {FieldQuestionComponent} from '../field-question/field-question.component';
import {FieldSettingsComponent} from '../field-settings/field-settings.component';
import {FieldTableComponent} from '../field-table/field-table.component';
import {FieldTypeaheadComponent} from '../field-typeahead/field-typeahead.component';
import {FilterColumnComponent} from '../filter-column/filter-column.component';
import {FormDataComponent} from '../form-data/form-data.component';
import {HomeComponent} from '../home/home.component';
import {InvitationDataComponent} from '../invitation-data/invitation-data.component';
import {KitLabelComponent} from '../kit-label/kit-label.component';
import {LabelSettingsComponent} from '../label-settings/label-settings.component';
import {LookupComponent} from '../lookup/lookup.component';
import {MailingListComponent} from '../mailing-list/mailing-list.component';
import {MedicalRecordAbstractionComponent} from '../medical-record-abstraction/medical-record-abstraction.component';
import {MedicalRecordComponent} from '../medical-record/medical-record.component';
import {ModalComponent} from '../modal/modal.component';
import {LoadingModalComponent} from '../modals/loading-modal.component';
import {NavigationComponent} from '../navigation/navigation.component';
import {NDIUploadComponent} from '../ndiupload/ndiupload.component';
import {OncHistoryDetailComponent} from '../onc-history-detail/onc-history-detail.component';
import {ParticipantEventComponent} from '../participant-event/participant-event.component';
import {ParticipantExitComponent} from '../participant-exit/participant-exit.component';
import {ParticipantListComponent} from '../participant-list/participant-list.component';
import {ParticipantPageComponent} from '../participant-page/participant-page.component';
import {dynamicFormTypeAndStudyRGP} from '../participant-page/pipes/dynamicFormTypeForRgp.pipe';
import {PdfDownloadComponent} from '../pdf-download/pdf-download.component';
import {PermalinkComponent} from '../permalink/permalink.component';
import {ButtonSelectTitleCasePipe} from '../pipe/button-select-title-case.pipe';
import {DateFormatPipe} from '../pipe/custom-date.pipe';
import {DashboardDateSortPipe} from '../pipe/dashboard-date-sort.pipe';
import {DrugFilterPipe} from '../pipe/drug-filter.pipe';
import {KitRequestFilterPipe} from '../pipe/kit-request-filter.pipe';
import {KitRequestSortPipe} from '../pipe/kit-request-sort.pipe';
import {MedicalRecordLogSortPipe} from '../pipe/medical-record-log-sort.pipe';
import {OncHistoryDetailSortPipe} from '../pipe/onc-history-detail-sort.pipe';
import {OrdinalPipe} from '../pipe/ordinal.pipe';
import {ParticipantExitSortPipe} from '../pipe/participant-exit-sort.pipe';
import {SurveyFilterPipe} from '../pipe/survey-filter.pipe';
import {SurveySortPipe} from '../pipe/survey-sort.pipe';
import {AddFamilyMemberComponent} from '../popups/add-family-member/add-family-member.component';
import {ScanPairComponent} from '../scan-pair/scan-pair.component';
import {ScanValueComponent} from '../scan-value/scan-value.component';
import {ScanComponent} from '../scan/scan.component';
import {SearchBarComponent} from '../search-bar/search-bar.component';
import {ShippingReportComponent} from '../shipping-report/shipping-report.component';
import {ShippingSearchComponent} from '../shipping-search/shipping-search.component';
import {ShippingComponent} from '../shipping/shipping.component';
import {SurveyComponent} from '../survey/survey.component';
import {CohortTagComponent} from '../tags/cohort-tag/cohort-tag.component';
import {DssErrorPageComponent} from '../test-dss/dss-error-page/dss-error-page.component';
import {TestDssComponent} from '../test-dss/test-dss.component';
import {TissueListComponent} from '../tissue-list/tissue-list.component';
import {TissuePageComponent} from '../tissue-page/tissue-page.component';
import {TissueComponent} from '../tissue/tissue.component';
import {UploadComponent} from '../upload/upload.component';
import {UserSettingComponent} from '../user-setting/user-setting.component';
import {Language} from '../utils/language';
import {Statics} from '../utils/statics';
import {Utils} from '../utils/utils';
import {AllStudiesComponent} from './all-studies.component';
import {BuildingFactoryService} from '../activity-data/services/buildingFactory.service';
import { CohortTagComponent } from '../tags/cohort-tag/cohort-tag.component';
import {MatChipsModule} from '@angular/material/chips';
import { BulkCohortTagModalComponent } from '../tags/cohort-tag/bulk-cohort-tag-modal/bulk-cohort-tag-modal.component';
import { OpenDialogDirective } from '../directive/open-loading-modal.directive';
import {AllStudiesRoutingModule} from './all-studies.routing.module';



@NgModule( {
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
    BulkCohortTagModalComponent,
    OpenDialogDirective,
    AddEditDeleteUserComponent
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
    DragulaModule.forRoot()
  ],
  providers: [
    Utils,
    BuildingFactoryService,
    AuthGuard,
    Statics,
    Language,
  ],
  exports: [RouterModule]
})

export class AllStudiesModule {
}
