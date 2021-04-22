import { ElementRef, Injectable } from '@angular/core';
import { DialogPosition, MatDialogConfig } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

export const DEFAULT_DIALOG_SETTINGS = {
    hasBackdrop: true,
    autoFocus: false,
    scrollStrategy: new NoopScrollStrategy(),
};

@Injectable()
export class ActivityBlockModalService {

    public getDeleteDialogConfig(deleteButtonRef: ElementRef): MatDialogConfig {
        const dialogWidth = 396;
        const dialogArrowWidth = 20;
        const realDialogWidth = dialogWidth + dialogArrowWidth;
        const dialogHeight = 160;

        const config: MatDialogConfig = {
            ...DEFAULT_DIALOG_SETTINGS,
            panelClass: 'modal-activity-block__delete-dialog',
            height: `${dialogHeight}px`
        };

        config.position = this.calculateDeleteDialogPosition(deleteButtonRef, dialogWidth, dialogHeight);
        config.width = `${realDialogWidth}px`;

        return config;
    }

    private calculateDeleteDialogPosition(root: ElementRef, dialogWidth: number, dialogHeight: number): DialogPosition {
        const box: DOMRect = root.nativeElement.getBoundingClientRect();
        const xCenter = box.left + box.width / 2;
        const verticalGap = 15;

        const left = window.innerWidth > 1260 ? `${xCenter - dialogWidth / 2}px` : undefined;
        return {
            top: `${box.top - dialogHeight - verticalGap}px`,
            left
        };
    }
}
