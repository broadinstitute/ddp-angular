import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatTable } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { PrionToolkitConfigurationService } from "toolkit-prion";
import { StudyListingDataSource } from "./study-listing-data-source";
import { Column } from "../../models/study-listing/column";

@Component({
  selector: 'study-listing',
  template: `
    <prion-header></prion-header>
    <div class="Container">
      <article class="PageContent">
        <div class="PageLayout">
          <div class="row NoMargin">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <section class="PageContent-section">
                <div class="row">
                  <div class="col-md-4">
                    <input class="form-control study-listing-filter study-listing-filter-all" matInput 
                           (keyup)="applyFilter($event)" [placeholder]="'App.StudyListing.InputPlaceholder' | translate">
                  </div>
                </div>
                <br/>
                <table mat-table [dataSource]="dataSource" class="table dataTable table-bordered study-listing-table">
                  <ng-container [matColumnDef]="column" *ngFor="let column of displayedColumns; index as i">
                    <th mat-header-cell *matHeaderCellDef translate [innerHTML]="columns[i].columnTitleKey">
                    </th>
                    <td mat-cell *matCellDef="let element">{{element[column]}}</td>
                  </ng-container>
                  <ng-container [matColumnDef]="column" *ngFor="let column of filterColumns; index as i">
                    <th mat-header-cell *matHeaderCellDef class="filter-cell">
                      <input *ngIf="columns[i].filterInfo.canFilter" class="form-control study-listing-filter study-listing-filter-col" 
                             matInput (keyup)="applyColumnFilter(i, $event)" [placeholder]="columns[i].filterPlaceholder | translate">
                    </th>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-header-row *matHeaderRowDef="filterColumns" class="filter-row"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
                </table>
              </section>
            </div>
          </div>
        </div>
      </article>
    </div>
    
  `
})
export class StudyListingComponent implements OnInit {
  //TODO: Fix literal rendering of HTML in data
  //TODO: Fix display of table
  //TODO: Add ablity to sort by column

  public dataSource: StudyListingDataSource;
  public displayedColumns: string[] = ['studyName', 'description', 'nameOfPI',
    'site', 'eligibilityRequirements', 'moreInfo'];
  public filterColumns: string[] = ['studyNameFilter', 'descriptionFilter', 'nameOfPIFilter',
    'siteFilter', 'eligibilityRequirementsFilter', 'moreInfoFilter'];
  public columns: Column[];
  private generalFilterString: string = null;

  @ViewChild(MatTable, {static:false})
  private table: MatTable<any>;

  public constructor(private translator: TranslateService,
                     @Inject('toolkit.toolkitConfig') private toolkitConfiguration:PrionToolkitConfigurationService) {
  }

  public ngOnInit(): void {
    this.columns = [
      new Column(0, true),
      new Column(1, true),
      new Column(2, true),
      new Column(3, true),
      new Column(4, true),
      new Column(5, false)
    ];

    this.updateDataSource();
  }

  public applyFilter(event): void {
    this.generalFilterString = (event.target as HTMLInputElement).value;
    this.updateDataSource();
  }

  public applyColumnFilter(column: number, event: Event): void {
    if (this.columns[column].filterInfo.canFilter) {
      let filterString: string = (event.target as HTMLInputElement).value;
      this.columns[column].filterInfo.addFilter(filterString);
      this.updateDataSource();
    }
  }

  private updateDataSource() {
    this.dataSource = new StudyListingDataSource(this.translator, this.toolkitConfiguration.assetsBucketUrl, this.generalFilterString, this.columns.map(x => x.filterInfo));
  }
}
