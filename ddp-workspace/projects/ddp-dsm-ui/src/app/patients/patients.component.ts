import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AddPatientsModalComponent } from "../add-patients-modal/add-patients-modal.component";

@Component({
  selector: "app-patients",
  templateUrl: "./patients.component.html",
  styleUrls: ["./patients.component.scss"],
})
export class PatientsComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openAddPatientsModal() {
    this.dialog.open(AddPatientsModalComponent, {
      width: "600px",
    });
  }
}
