import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PicklistOptionDef } from '../../model/core/picklistOptionDef';
import { PicklistGroupDef } from '../../model/core/picklistGroupDef';
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
    @Input() groupsAllowed: boolean;

    public groups: Array<PicklistGroupDef>;
    public options: PicklistOptionDef[] = [];
    public touched = false;
    public disabled = false;

    private factory: StudyConfigObjectFactory;

    constructor(private fb: FormBuilder, private config: ConfigurationService) {
        this.factory = new StudyConfigObjectFactory(config);
    }

    onChange = (event: {options: Array<PicklistOptionDef>; groups: Array<PicklistGroupDef>}) => {};
    onTouched = () => {};

    writeValue({ options, groups }: { options: Array<PicklistOptionDef>; groups: Array<PicklistGroupDef> }): void {
        this.groups = [...groups];
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
            const newOption = {
                stableId: '',
                optionLabelTemplate: new SimpleTemplate(this.factory.createBlankTemplate()),
            };
            this.options = [...this.options, newOption];
            this.onChange({options: this.options, groups: this.groups});
        }
    }

    addEmptyGroup(): void {
        this.markAsTouched();
        if (!this.disabled) {
            const newOptionGroup: PicklistGroupDef = {
                stableId: '',
                nameTemplate: new SimpleTemplate(this.factory.createBlankTemplate()),
                options: [],
            };
            this.groups.push(newOptionGroup);
            this.onChange({options: this.options, groups: this.groups});
        }
    }

    removeGroupByIndex(index: number): void {
        this.markAsTouched();
        if (!this.disabled) {
            this.groups.splice(index, 1);
            this.onChange({options: this.options, groups: this.groups});
        }
    }

    updateOptions(options: PicklistOptionDef[]): void {
        this.markAsTouched();
        if (!this.disabled) {
            this.options = [...options];
            this.onChange({options: this.options, groups: this.groups});
        }
    }

    updateGroup(group: PicklistGroupDef, groupIndex: number): void {
        this.markAsTouched();
        if (!this.disabled) {
            this.groups[groupIndex].stableId = group.stableId;
            this.groups[groupIndex].nameTemplate = group.nameTemplate;
            this.groups[groupIndex].options = [...group.options];
            this.onChange({options: this.options, groups: this.groups});
        }
    }
}
