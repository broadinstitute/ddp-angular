import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input, OnChanges,
  Output,
  ViewChild
} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {patientListModel} from '../../models/patient-list.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnChanges, AfterViewInit {
  displayedColumns: string[] =
    ['id', 'firstName', 'lastName', 'birthdate', 'enrollingCenter', 'registered', 'lastUpdated', 'enrollmentStatus'];
  dataSource: MatTableDataSource<patientListModel>;

  @Input('data') tableData: patientListModel[];
  @Output('rowClick') clickedRowData = new EventEmitter<patientListModel>();
  @Input() loading = false;

  @ViewChild(MatSort) sort: MatSort;

  ngOnChanges(_): void {
    this.dataSource = new MatTableDataSource<patientListModel>(this.tableData || []);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
