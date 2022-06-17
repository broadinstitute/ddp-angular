import {Directive, HostListener} from "@angular/core";
import {AddPatientsModalComponent} from "../components/add-patients-modal/add-patients-modal.component";
import {MatDialog} from "@angular/material/dialog";

@Directive({
  selector: '[enrollPatient]'
})

export class enrollPatientDirective {

  constructor(private matDialog: MatDialog) {
  }

  @HostListener('click') openAddPatientsModal() {
    const dialogRef = this.matDialog.open(AddPatientsModalComponent, {
      panelClass: 'matDialog'
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result, 'from dialog close observer');
    });
  }
}
