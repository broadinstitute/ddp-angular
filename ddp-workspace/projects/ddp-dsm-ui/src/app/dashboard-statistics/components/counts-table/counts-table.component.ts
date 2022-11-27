import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild
} from '@angular/core';
import {ICount} from '../../interfaces/ICount';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-counts-table',
  templateUrl: 'counts-table.component.html',
  styleUrls: ['counts-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CountsTableComponent  implements AfterViewInit {
  countsArray: MatTableDataSource<ICount>;
  readonly columnNames: string[] = ['title', 'count'];

  @Input('counts') set setCounts(counts: ICount[]) {
    this.countsArray = new MatTableDataSource<ICount>(counts || []);
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
