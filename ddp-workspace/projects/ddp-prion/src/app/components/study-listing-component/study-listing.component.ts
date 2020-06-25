import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatTable } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { PrionToolkitConfigurationService } from "toolkit-prion";
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
                    <input class="form-control study-listing-filter-all" matInput (keyup)="applyFilter($event)" [placeholder]="'App.StudyListing.InputPlaceholder' | translate">
                  </div>
                </div>
                <br/>
                <table mat-table [dataSource]="dataSource" class="table dataTable table-striped table-bordered study-listing-table">
                  <ng-container [matColumnDef]="column" *ngFor="let column of displayedColumns; index as i">
                    <th mat-header-cell *matHeaderCellDef translate [innerHTML]="getTitle(i)"></th>
                    <td mat-cell *matCellDef="let element">{{element[column]}}</td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <!-- TODO: Add second header row with column filters -->
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
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
  //TODO: Add filtering of specific columns

  public dataSource: StudyListingDataSource;
  public displayedColumns: string[] = ['studyName', 'description', 'nameOfPI', 'site', 'eligibilityRequirements', 'moreInfo'];
  public columnTitles: string[] = ['App.StudyListing.Columns.0.title', 'App.StudyListing.Columns.1.title', 'App.StudyListing.Columns.2.title', 'App.StudyListing.Columns.3.title', 'App.StudyListing.Columns.4.title', 'App.StudyListing.Columns.5.title'];

  @ViewChild(MatTable, {static:false})
  private table: MatTable<any>;

  public constructor(private translator: TranslateService,
                     @Inject('toolkit.toolkitConfig') private toolkitConfiguration:PrionToolkitConfigurationService) {
  }

  public getTitle(i: number) {
    return this.columnTitles[i];
  }

  public ngOnInit(): void {
    this.dataSource = new StudyListingDataSource(this.translator, this.toolkitConfiguration.assetsBucketUrl, null);
  }

  public applyFilter(event): void {
    let filterString: string = (event.target as HTMLInputElement).value;
    this.dataSource = new StudyListingDataSource(this.translator, this.toolkitConfiguration.assetsBucketUrl,filterString);
  }

  public applyColumnFilter(column, event): void {
    //TODO: Implement applyColumnFilter and use
  }
}
