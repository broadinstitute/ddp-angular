import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { PrionToolkitConfigurationService } from "toolkit-prion";
import { DataSource } from "@angular/cdk/table";
import { StudyInfo } from "./study-info";
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
                <table mat-table [dataSource]="dataSource" class="dataTable table-striped table-bordered study-listing-table">
                  <ng-container [matColumnDef]="column" *ngFor="let column of displayedColumns">
                    <th mat-header-cell *matHeaderCellDef translate>{{column}}</th>
                    <td mat-cell *matCellDef="let element">{{element[column]}}</td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
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
  public dataSource: DataSource<StudyInfo>;

  //TODO: Make columns translated
  public displayedColumns: string[] = ['studyName', 'description', 'nameOfPI', 'site', 'eligibilityRequirements', 'moreInfo'];

  public constructor(private translator: TranslateService,
                     @Inject('toolkit.toolkitConfig') private toolkitConfiguration:PrionToolkitConfigurationService) {
  }

  public ngOnInit(): void {
    this.dataSource = new StudyListingDataSource(this.translator, this.toolkitConfiguration.assetsBucketUrl);
  }
}
