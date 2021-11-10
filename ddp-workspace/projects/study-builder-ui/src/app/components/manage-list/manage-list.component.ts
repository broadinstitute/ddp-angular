import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PicklistOptionDef } from '../../model/core/picklistOptionDef';
import { PicklistGroupDef } from '../../model/core/picklistGroupDef';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SimpleTemplate } from '../../model/core-extended/simpleTemplate';
import { ConfigurationService } from '../../configuration.service';
import { StudyConfigObjectFactory } from '../../model/core-extended/studyConfigObjectFactory';

@Component({
    selector: 'app-manage-list',
    templateUrl: 'manage-list.component.html',
    styleUrls: ['manage-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ManageListComponent
        }
    ]
})
export class ManageListComponent implements ControlValueAccessor {
    // @Input() groupsAllowed: boolean;

    public groups: Array<PicklistGroupDef>;
    public options: PicklistOptionDef[] = [];
    public touched = false;
    public disabled = false;

    private factory: StudyConfigObjectFactory;

    constructor(private fb: FormBuilder, private config: ConfigurationService) {
        this.factory = new StudyConfigObjectFactory(config);
    }

    // onChange = (event: { groups: Array<PicklistGroupDef>; options: Array<PicklistOptionDef> }) => {};
    onChange = (event: Array<PicklistOptionDef>) => {};
    onTouched = () => {};

    // writeValue({ groups, options }: { groups: Array<PicklistGroupDef>; options: Array<PicklistOptionDef> }): void {
    writeValue(options: Array<PicklistOptionDef>): void {
        // this.groups = [...groups];
        this.options = [...options];
    }

    registerOnChange(onChange: any): void {
        this.onChange = onChange;
    }

    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    markAsTouched(): void {
        if (!this.touched) {
            this.onTouched();
            this.touched = true;
        }
    }

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
    }

    addEmptyOption(): void {
        this.markAsTouched();
        if (!this.disabled) {
            const newOptionGroup = {
                stableId: '',
                optionLabelTemplate: new SimpleTemplate(this.factory.createBlankTemplate()),
            };
            this.options.push(newOptionGroup);
            this.onChange(this.options);
        }
    }

    optionDrop(event: CdkDragDrop<PicklistOptionDef[]>): void {
        this.markAsTouched();
        if (!this.disabled) {
            moveItemInArray(this.options, event.previousIndex, event.currentIndex);
            this.onChange(this.options);
        }
    }

    removeOptionByIndex(index: number): void {
        this.markAsTouched();
        if (!this.disabled) {
            this.options.splice(index, 1);
            this.onChange(this.options);
        }
    }

    trackByOptions(index: number, item: PicklistOptionDef): string {
        return String(index);
    }

    updateOption(updatedOption: PicklistOptionDef, index: number): void {
        this.markAsTouched();
        if (!this.disabled) {
            this.options[index].stableId = updatedOption.stableId;
            this.options[index].optionLabelTemplate = updatedOption.optionLabelTemplate;
            this.options[index].tooltipTemplate = updatedOption.tooltipTemplate;
            this.options[index].detailLabelTemplate = updatedOption.detailLabelTemplate;
            this.options[index].allowDetails = updatedOption.allowDetails;
            this.options[index].exclusive = updatedOption.exclusive;
            this.onChange(this.options);
        }
    }
}
