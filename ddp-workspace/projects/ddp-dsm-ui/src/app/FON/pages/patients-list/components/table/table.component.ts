import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {patientListModel} from '../../models/patient-list.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] =
    ['id', 'firstName', 'lastName', 'birthdate', 'enrollingCenter', 'registered', 'lastUpdated', 'enrollmentStatus'];
  dataSource: MatTableDataSource<patientListModel>;

  @Input('data') tableData: patientListModel[];
  @Output('rowClick') clickedRowData = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;

  constructor() {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<patientListModel>(this.tableData);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
