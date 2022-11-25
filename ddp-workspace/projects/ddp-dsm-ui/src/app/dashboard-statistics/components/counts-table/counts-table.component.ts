import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild
} from '@angular/core';
import {ICounts} from '../../interfaces/ICounts';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-counts-table',
  templateUrl: 'counts-table.component.html',
  styleUrls: ['counts-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CountsTableComponent  implements AfterViewInit {
  countsArray: MatTableDataSource<ICounts>;
  readonly columnNames: string[] = ['title', 'count'];

  @Input('counts') set setCounts(counts: ICounts[]) {
    this.countsArray = new MatTableDataSource<ICounts>(counts || []);
  }

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit(): void {
    this.countsArray.sort = this.sort;
  }

  public applyFilter(event: Event): void {
    const filterValue: string = (event.target as HTMLInputElement).value;
    this.countsArray.filter = filterValue.trim().toLowerCase();
  }


}
