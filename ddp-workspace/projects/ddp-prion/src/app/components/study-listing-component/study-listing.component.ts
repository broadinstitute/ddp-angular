import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

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
                    <input *ngIf="config.filtering" placeholder="Filter all columns"
                           [ngTableFiltering]="config.filtering"
                           class="form-control"
                           (tableChanged)="onChangeTable(config)"/>
                  </div>
                </div>
                <br>
                <ng-table [config]="config"
                          (tableChanged)="onChangeTable(config)"
                          (cellClicked)="onCellClick($event)"
                          [rows]="rows" [columns]="columns">
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
  public columns:Array<any> = [
    {title: 'Study Name', name: 'name', filtering: {filterString: '', placeholder: 'Filter by name'}},
    {
      title: 'Study Description',
      name: 'description',
      sort: false,
      filtering: {filterString: '', placeholder: 'Filter by description'}
    },
    {title: 'Principal Investigator', name: 'nameOfPI', sort: '',filtering: {filterString: '', placeholder: 'Filter by PI'}},
    {title: 'Study Site', name: 'studySite', sort: '', filtering: {filterString: '', placeholder: 'Filter by site'}},
    {title: 'Eligibility Requirements', name: 'eligibilityRequirements', sort: '', filtering: {filterString: '', placeholder: 'Filter by eligibility'}},
    {title: 'More Information', name: 'studyInfo', sort: false},

  ];
  public page:number = 1;
  public itemsPerPage:number = 10;
  public maxSize:number = 5;
  public numPages:number = 1;
  public length:number = 0;

  public config:any = {
    sorting: {columns: this.columns},
    filtering: {filterString: ''},
    className: ['table-striped', 'table-bordered']
  };

  private data:Array<any>;

  public constructor(translator:TranslateService) {
    this.data = translator.instant('Toolkit.StudyListing.Rows');
    this.length = this.data.length;
  }

  public ngOnInit():void {
    this.onChangeTable(this.config);
  }

  public changeSort(data:any, config:any):any {
    if (!config.sorting) {
      return data;
    }

    let columns = this.config.sorting.columns || [];
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

  public changeFilter(data:any, config:any):any {
    let filteredData:Array<any> = data;
    this.columns.forEach((column:any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item:any) => {
          console.log(column.filtering.filterString.toLocaleLowerCase()+" >> "+ item[column.name]);
          return item[column.name].toLocaleLowerCase().match(column.filtering.filterString.toLocaleLowerCase());
        });
      }
    });

    if (!config.filtering) {

      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item:any) =>
        item[config.filtering.columnName].toLocaleLowerCase().match(this.config.filtering.filterString.toLocaleLowerCase()));
    }

    let tempArray:Array<any> = [];
    filteredData.forEach((item:any) => {
      let flag = false;
      this.columns.forEach((column:any) => {
        if (item[column.name].toString().toLocaleLowerCase().match(this.config.filtering.filterString.toLocaleLowerCase())) {
          flag = true;
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    console.log( JSON.stringify(filteredData));

    return filteredData;
  }

  public onChangeTable(config:any, page:any = {page: this.page, itemsPerPage: this.itemsPerPage}):any {
    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }

    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    let filteredData = this.changeFilter(this.data, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = sortedData;
    this.length = sortedData.length;
  }

  public onCellClick(data: any): any {
    console.log(data);
  }

}
