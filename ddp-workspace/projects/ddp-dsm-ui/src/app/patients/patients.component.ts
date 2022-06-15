import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPatientsModalComponent } from '../add-patients-modal/add-patients-modal.component';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements OnInit {
  patientsForm = {};
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openAddPatientsModal() {
    const dialogRef = this.dialog.open(AddPatientsModalComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      this.patientsForm = result;
    });
  }

  addPatient() {}
}
