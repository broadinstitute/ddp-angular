import {Component, Directive, HostListener, Input, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ComponentType} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';

const DIRECTIVE_NAME = 'openInModal';

@Directive({
  selector: `[${DIRECTIVE_NAME}]`
})
export class openInModalDirective implements OnDestroy {
  private modalComponent:  ComponentType<any>;

  private dialogRef: Subscription;

  constructor(private matDialog: MatDialog) {
  }

  @Input(DIRECTIVE_NAME) set setModalComponent(component: ComponentType<any>) {
    if(this.validateComponent(component)) {
      this.modalComponent = component;
    } else {
      console.error(new Error('Please provide a valid component'));
    }
  }

  @HostListener('click') openAddPatientsModal(): void {
    const component = this.modalComponent;
    if(component) {
      const dialogRef = this.matDialog.open(this.modalComponent);

      this.dialogRef = dialogRef.afterClosed()
        .subscribe((result) => {
          console.log(result, 'from dialog close observer');
        });
    }
  }

  ngOnDestroy(): void {
    this.dialogRef?.unsubscribe();
  }

  private validateComponent(component: ComponentType<any>): boolean {
    return component && component instanceof Object;
  }
}
