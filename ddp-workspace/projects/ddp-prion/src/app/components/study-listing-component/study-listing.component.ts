import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'study-listing',
  template: `
    <toolkit-header></toolkit-header>
    <div class="Wrapper">
      <article class="PageContent">
        <div class="PageLayout">
          <div class="row NoMargin">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <section class="PageContent-section">
                <div class="row">
                  <div class="col-md-4">
                    <input *ngIf="translatedConfig.filtering" placeholder="{{'Toolkit.StudyListing.InputPlaceholder' | translate}}"
                           [ngTableFiltering]="translatedConfig.filtering"
                           class="form-control"
                           (tableChanged)="onChangeTable(translatedConfig)"/>
                  </div>
                </div>
                <br>
                <ng-table [config]="translatedConfig"
                          (tableChanged)="onChangeTable(translatedConfig)"
                          (cellClicked)="onCellClick($event)"
                          [rows]="rows" [columns]="translatedColumns">
                </ng-table>
              </section>
            </div>
          </div>
        </div>
      </article>
    </div>
    
  `
})
export class StudyListingComponent implements OnInit {

  public rows:Array<any> = [];
  public untranslatedColumns:Array<any> = [
    {title: 'Toolkit.StudyListing.Columns.0.title', name: 'name', filtering: {filterString: '', placeholder: 'Toolkit.StudyListing.Columns.0.placeholder'}},
    {
      title: 'Toolkit.StudyListing.Columns.1.title',
      name: 'description',
      sort: false,
      filtering: {filterString: '', placeholder: 'Toolkit.StudyListing.Columns.1.placeholder'}
    },
    {title: 'Toolkit.StudyListing.Columns.2.title', name: 'nameOfPI', sort: '',filtering: {filterString: '', placeholder: 'Toolkit.StudyListing.Columns.2.placeholder'}},
    {title: 'Toolkit.StudyListing.Columns.3.title', name: 'studySite', sort: '', filtering: {filterString: '', placeholder: 'Toolkit.StudyListing.Columns.3.placeholder'}},
    {title: 'Toolkit.StudyListing.Columns.4.title', name: 'eligibilityRequirements', sort: '', filtering: {filterString: '', placeholder: 'Toolkit.StudyListing.Columns.4.placeholder'}},
    {title: 'Toolkit.StudyListing.Columns.5.title', name: 'studyInfo', sort: false}
  ];
  public translatedColumns: Array<any> = [
    {title: null, name: this.untranslatedColumns[0].name, filtering: {filterString: '', placeholder: null}},
    {title: null, name: this.untranslatedColumns[1].name, sort: false, filtering: {filterString: '', placeholder: null}},
    {title: null, name: this.untranslatedColumns[2].name, sort: '', filtering: {filterString: '', placeholder: null}},
    {title: null, name: this.untranslatedColumns[3].name, sort: '', filtering: {filterString: '', placeholder: null}},
    {title: null, name: this.untranslatedColumns[4].name, sort: '', filtering: {filterString: '', placeholder: null}},
    {title: null, name: this.untranslatedColumns[5].name, sort: false}
  ];

  public page:number = 1;
  public itemsPerPage:number = 10;
  public maxSize:number = 5;
  public numPages:number = 1;
  public length:number = 0;

  public translatedConfig: any = {sorting: null, filtering: {filterString: ''},
    className: ['table-striped', 'table-bordered']};
  private data:Array<any>;

  public constructor(public translator: TranslateService) {
    this.translateTable();
    this.translator.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translator.use(event.lang);
      this.translateTable();
    });
  }

  private translateTable(){
    this.data = this.translator.instant('Toolkit.StudyListing.Rows');
    this.length = this.data.length;
    for (let i = 0; i < this.translatedColumns.length; i++) {
      this.translatedColumns[i].title = this.translator.instant(this.untranslatedColumns[i].title);
      if (i < 5) //Last column doesn't have filtering specified at all
        this.translatedColumns[i].filtering.placeholder = this.translator.instant(this.untranslatedColumns[i].filtering.placeholder);
    }
    this.translatedConfig.sorting = {columns: this.translatedColumns};
    //Reset filter string just in case
    this.translatedConfig.filtering = {filterString: ''};
  }

  public ngOnInit():void {
    this.onChangeTable(this.translatedConfig);
  }

  public changeSort(data:any, translatedConfig:any):any {
    if (!translatedConfig.sorting) {
      return data;
    }

    let columns = this.translatedConfig.sorting.columns || [];
    let columnName:string = void 0;
    let sort:string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous:any, current:any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  public changeFilter(data:any, translatedConfig:any):any {
    let filteredData:Array<any> = data;
    this.translatedColumns.forEach((column:any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item:any) => {
          return item[column.name].toLocaleLowerCase().match(column.filtering.filterString.toLocaleLowerCase());
        });
      }
    });

    if (!translatedConfig.filtering) {

      return filteredData;
    }

    if (translatedConfig.filtering.columnName) {
      return filteredData.filter((item:any) =>
        item[translatedConfig.filtering.columnName].toLocaleLowerCase().match(this.translatedConfig.filtering.filterString.toLocaleLowerCase()));
    }

    let tempArray:Array<any> = [];
    filteredData.forEach((item:any) => {
      let flag = false;
      this.translatedColumns.forEach((column:any) => {
        if (item[column.name].toString().toLocaleLowerCase().match(this.translatedConfig.filtering.filterString.toLocaleLowerCase())) {
          flag = true;
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;
    return filteredData;
  }

  public onChangeTable(translatedConfig:any, page:any = {page: this.page, itemsPerPage: this.itemsPerPage}):any {
    if (translatedConfig.filtering) {
      Object.assign(this.translatedConfig.filtering, translatedConfig.filtering);
    }

    if (translatedConfig.sorting) {
      Object.assign(this.translatedConfig.sorting, translatedConfig.sorting);
    }

    let filteredData = this.changeFilter(this.data, this.translatedConfig);
    let sortedData = this.changeSort(filteredData, this.translatedConfig);
    this.rows = sortedData;
    this.length = sortedData.length;
  }

  public onCellClick(data: any): any {
    console.log(data);
  }

}
