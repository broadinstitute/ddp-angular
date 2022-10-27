import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild
} from '@angular/core';
import {CountsModel} from '../../models/Counts.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-cards-table',
  templateUrl: 'counts-table.component.html',
  styleUrls: ['counts-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CountsTableComponent  implements AfterViewInit {
  CountsArray: MatTableDataSource<CountsModel>;
  readonly columnNames: string[] = ['title', 'count'];

  @Input('counts') set setCounts(counts: CountsModel[]) {
    this.CountsArray = new MatTableDataSource<CountsModel>(counts);
  }

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit(): void {
    this.CountsArray.sort = this.sort;
  }

  public applyFilter(event: Event): void {
    const filterValue: string = (event.target as HTMLInputElement).value;
    this.CountsArray.filter = filterValue.trim().toLowerCase();
  }


}
