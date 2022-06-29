import {Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ComponentType} from '@angular/cdk/overlay';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

const DIRECTIVE_NAME = 'openInModal';

interface matDialogSizes {
  height: string;
  width: string;
  top: string;
}

@Directive({
  selector: `[${DIRECTIVE_NAME}]`
})
export class openInModalDirective {
  private modalComponent:  ComponentType<any>;

  constructor(private matDialog: MatDialog) {
  }

  @Input(DIRECTIVE_NAME) set setModalComponent(component: ComponentType<any>) {
    if(this.validateComponent(component)) {
      this.modalComponent = component;
    } else {
      console.error(new Error('Please provide a valid component'));
    }
  }
  @Input() modalSizes: Partial<matDialogSizes>;

  @HostListener('click') openAddPatientsModal(): void {
    this.validateComponent(this.modalComponent) && this.openMatDialog();
  }

  private openMatDialog(): void {
    const modalSizes = this.modalSizes;
    this.matDialog.open(this.modalComponent, {maxWidth: '870px'})
      .updatePosition({ top: modalSizes?.top || '24px'})
      .updateSize( modalSizes?.width || '60%' , modalSizes?.height || '623px');
  }

  private validateComponent(component: ComponentType<any>): boolean {
    return component && component instanceof Object;
  }
}
