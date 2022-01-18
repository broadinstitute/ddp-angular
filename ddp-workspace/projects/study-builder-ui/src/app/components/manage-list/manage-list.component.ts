import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Self } from '@angular/core';
import {
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    NgControl,
    ValidationErrors
} from '@angular/forms';
import { PicklistOptionDef } from '../../model/core/picklistOptionDef';
import { PicklistGroupDef } from '../../model/core/picklistGroupDef';
import { SimpleTemplate } from '../../model/core-extended/simpleTemplate';
import { ConfigurationService } from '../../configuration.service';
import { StudyConfigObjectFactory } from '../../model/core-extended/studyConfigObjectFactory';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FuncType } from 'ddp-sdk';

@Component({
    selector: 'app-manage-list',
    templateUrl: 'manage-list.component.html',
    styleUrls: ['manage-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageListComponent implements OnInit, ControlValueAccessor {
    @Input() groupsAllowed: boolean;

    public groups: Array<PicklistGroupDef>;
    public options: PicklistOptionDef[] = [];
    public touched = false;
    public disabled = false;

    private factory: StudyConfigObjectFactory;

    constructor(
        private fb: FormBuilder,
        private config: ConfigurationService,
        private cdr: ChangeDetectorRef,
        @Self() private controlDirective: NgControl,
        ) {
        this.factory = new StudyConfigObjectFactory(config);
        controlDirective.valueAccessor = this;
    }

    ngOnInit(): void {
        this.controlDirective.control.setValidators([this.validate.bind(this)]);
        this.controlDirective.control.updateValueAndValidity();
    }

    onChange: FuncType<void> = (event: {options: Array<PicklistOptionDef>; groups: Array<PicklistGroupDef>}) => {};
    onTouched: FuncType<void> = () => {};

    writeValue({ options, groups }: { options: Array<PicklistOptionDef>; groups: Array<PicklistGroupDef> }): void {
        this.groups = [...groups];
        this.options = [...options];
        this.cdr.markForCheck();
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

    validate({ value }: FormControl): ValidationErrors | null {
        const allOptions: PicklistOptionDef[] = [...value.options, ...value.groups.flatMap(group => group.options)];
        const notUniqueOptionsStableIds = this.getNotUniqueStableIds(allOptions);
        const notUniqueGroupsStableIds = this.getNotUniqueStableIds(this.groups);
        const isNotValid = !!notUniqueOptionsStableIds.length || !!notUniqueGroupsStableIds.length;
        return isNotValid && {
            ...(notUniqueOptionsStableIds ? {notUniqueOptionsStableIds} : {}),
            ...(notUniqueGroupsStableIds ? {notUniqueGroupsStableIds} : {}),
        };
    }

    private getNotUniqueStableIds(array: PicklistOptionDef[] | PicklistGroupDef[]): string[] {
        const stableIdToCountMap = new Map<string, number>();
        for (const item of array) {
            if (stableIdToCountMap.has(item.stableId)) {
                const currentCount = stableIdToCountMap.get(item.stableId);
                stableIdToCountMap.set(item.stableId, currentCount + 1);
            } else {
                stableIdToCountMap.set(item.stableId, 1);
            }
        }
        return [...stableIdToCountMap.entries()]
            .filter(([_, count]) => count > 1).map(([stableId]) => stableId);
    }

    get invalid(): boolean {
        return this.controlDirective?.invalid || false;
    }

    get errors(): ValidationErrors | null {
        return this.controlDirective?.errors || null;
    }

    groupHasNotUniqueStableId(group: PicklistGroupDef): boolean {
        return this.controlDirective.invalid && this.controlDirective.errors?.notUniqueGroupsStableIds?.includes(group.stableId);
    }

    notUniqueOptionsStableIdsForGroup(group: PicklistGroupDef): string[] {
        return (this.controlDirective.invalid
                && this.controlDirective.errors?.notUniqueOptionsStableIds?.filter(value =>
                    group.options.map(({stableId}) => stableId).includes(value)))
            || [];
    }

    notUniqueOptionsStableIds(): string[] {
        return (this.controlDirective.invalid && this.controlDirective.errors?.notUniqueOptionsStableIds) || [];
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

    groupDrop(event: CdkDragDrop<PicklistGroupDef[]>): void {
        moveItemInArray(this.groups, event.previousIndex, event.currentIndex);
        this.onChange({options: this.options, groups: this.groups});
    }
}
