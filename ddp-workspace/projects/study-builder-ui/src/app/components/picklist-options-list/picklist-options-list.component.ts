import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PicklistOptionDef } from '../../model/core/picklistOptionDef';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-picklist-options-list',
    templateUrl: 'picklist-options-list.component.html',
    styleUrls: ['picklist-options-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PicklistOptionsListComponent {
    @Input() options: PicklistOptionDef[];
    @Input() notUniqueOptionsStableIds: string[] = [];
    @Output() changed = new EventEmitter<PicklistOptionDef[]>();

    optionDrop(event: CdkDragDrop<PicklistOptionDef[]>): void {
        const updatedOptions = [...this.options];
        moveItemInArray(updatedOptions, event.previousIndex, event.currentIndex);
        this.changed.emit(updatedOptions);
    }

    removeOptionByIndex(options: PicklistOptionDef[], index: number): void {
        const updatedOptions = [...this.options];
        updatedOptions.splice(index, 1);
        this.changed.emit(updatedOptions);
    }

    trackByOptions(index: number, item: PicklistOptionDef): string {
        return String(index);
    }

    updateOption(updatedOption: PicklistOptionDef, index: number): void {
        const updatedOptions = [...this.options];
        updatedOptions[index].stableId = updatedOption.stableId;
        updatedOptions[index].optionLabelTemplate = updatedOption.optionLabelTemplate;
        updatedOptions[index].tooltipTemplate = updatedOption.tooltipTemplate;
        updatedOptions[index].detailLabelTemplate = updatedOption.detailLabelTemplate;
        updatedOptions[index].allowDetails = updatedOption.allowDetails;
        updatedOptions[index].exclusive = updatedOption.exclusive;
        this.changed.emit(updatedOptions);
    }
}
