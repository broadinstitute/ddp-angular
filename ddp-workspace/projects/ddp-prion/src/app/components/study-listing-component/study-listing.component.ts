import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatTable } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { PrionToolkitConfigurationService } from "toolkit-prion";
import { Column } from "../../models/study-listing/column";
import { StudyListingDataSource } from "./study-listing-data-source";

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
                <table mat-table [dataSource]="dataSource"  class="table dataTable table-bordered study-listing-table">
                  <ng-container [matColumnDef]="column" *ngFor="let column of displayedColumns; index as i">
                    <th mat-header-cell *matHeaderCellDef (click)="sortByCol(i)">
                      <span translate [innerHTML]="columns[i].columnTitleKey"></span>
                      <i class="pull-right fa fa-chevron-up" *ngIf="sortArrows[i] === 1"></i>
                      <i class="pull-right fa fa-chevron-down" *ngIf="sortArrows[i] === 2"></i>
                    </th>
                    <td mat-cell *matCellDef="let element" [innerHTML]="element[column]"></td>
                  </ng-container>
                  <ng-container [matColumnDef]="column" *ngFor="let column of filterColumns; index as i">
                    <th mat-header-cell *matHeaderCellDef class="filter-cell">
                      <input *ngIf="columns[i].filterInfo.canFilter" class="form-control study-listing-filter study-listing-filter-col" 
                             matInput (keyup)="applyColumnFilter(i, $event)" [placeholder]="columns[i].filterInfo.filterPlaceholder | translate">
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
  //TODO: Add ability to sort by column

  public dataSource: StudyListingDataSource;
  public displayedColumns: string[] = ['studyName', 'description', 'nameOfPI',
    'site', 'eligibilityRequirements', 'moreInfo'];
  public filterColumns: string[] = ['studyNameFilter', 'descriptionFilter', 'nameOfPIFilter',
    'siteFilter', 'eligibilityRequirementsFilter', 'moreInfoFilter'];
  public columns: Column[];
  public sortArrows: number[];

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

    this.sortArrows = [0, 0, 0, 0, 0];

    this.dataSource = new StudyListingDataSource(this.translator, this.toolkitConfiguration.assetsBucketUrl,
      this.columns.map(x => x.filterInfo));
  }

  public applyFilter(event): void {
    let generalFilterString: string = (event.target as HTMLInputElement).value;
    this.dataSource.addFilter(generalFilterString);
  }

  public applyColumnFilter(column: number, event: Event): void {
    if (this.columns[column].filterInfo.canFilter) {
      let filterString: string = (event.target as HTMLInputElement).value;
      this.columns[column].filterInfo.addFilter(filterString);
      this.dataSource.addColumnFilters(this.columns.map(x => x.filterInfo));
    }
  }

  public sortByCol(colIndex: number) {
    if ([0,2,3,4].includes(colIndex)) {
      //First clear existing sorts if necessary
      if (this.dataSource.shouldSort && this.dataSource.sortIndex !== colIndex) {
        this.sortArrows[this.dataSource.sortIndex] = 0;
      }

      if (this.dataSource.shouldSort && this.dataSource.sortIndex === colIndex ) {
        if ('asc' === this.dataSource.sortDir) {
          this.dataSource.addSort(true, colIndex, 'desc');
        }
        else {
          this.dataSource.addSort(false, -1, null);
        }
      }
      else {
        this.dataSource.addSort(true, colIndex, 'asc');
      }

      this.sortArrows[colIndex] = (this.sortArrows[colIndex] + 1) % 3;
    }
  }
}
