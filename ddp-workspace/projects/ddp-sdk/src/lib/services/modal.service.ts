import { ElementRef, Injectable } from '@angular/core';
import { DialogPosition, MatDialogConfig } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

export const DEFAULT_DIALOG_SETTINGS = {
    hasBackdrop: true,
    autoFocus: false,
    scrollStrategy: new NoopScrollStrategy(),
};

const DIALOG_WIDTH = 396;
const DIALOG_ARROW_WIDTH = 20;
const DIALOG_HEIGHT = 160;
const VERTICAL_GAP = 15; // margin between dialog and delete button

@Injectable()
export class ModalService {

    public getDialogConfig(rootButtonRef: ElementRef, panelClass: string): MatDialogConfig {
        const realDialogWidth = DIALOG_WIDTH + DIALOG_ARROW_WIDTH;
        const rootBox: DOMRect = rootButtonRef.nativeElement.getBoundingClientRect();
        const isDialogLocatedAbove = (rootBox.top - DIALOG_HEIGHT - VERTICAL_GAP) > 0;

        return {
            ...DEFAULT_DIALOG_SETTINGS,
            panelClass: [
                panelClass,
                isDialogLocatedAbove ? 'on-top' : 'on-bottom'
            ],
            height: `${DIALOG_HEIGHT}px`,
            width: `${realDialogWidth}px`,
            position: this.calculateDialogPosition(rootBox, isDialogLocatedAbove)
        } as MatDialogConfig;
    }

    private calculateDialogPosition(box: DOMRect, isDialogLocatedAbove: boolean): DialogPosition {
        const xCenter = box.left + box.width / 2;
        const top = isDialogLocatedAbove ? `${box.top - DIALOG_HEIGHT - VERTICAL_GAP}px`
            : `${box.bottom + VERTICAL_GAP}px`;

        let left;
        if (window.innerWidth > 1260) {
          left = isDialogLocatedAbove ? `${xCenter - DIALOG_WIDTH / 2}px`
              : `${xCenter - DIALOG_WIDTH / 2 - box.width / 2}px`;
        }

        return { top, left };
    }
}
