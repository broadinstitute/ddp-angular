import {Directive, HostListener} from "@angular/core";
import {RegisterPatientsModalComponent} from "../components/register-patients-modal/register-patients-modal.component";
import {MatDialog} from "@angular/material/dialog";

@Directive({
  selector: '[registerPatient]'
})

export class registerPatientsDirective {

  constructor(private matDialog: MatDialog) {
  }

  @HostListener('click') openAddPatientsModal() {
    const dialogRef = this.matDialog.open(RegisterPatientsModalComponent, {
      panelClass: 'matDialog'
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result, 'from dialog close observer');
    });
  }
}
