import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SimpleTemplate } from '../../model/core-extended/simpleTemplate';
import { ConfigurationService } from '../../configuration.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StudyConfigObjectFactory } from '../../model/core-extended/studyConfigObjectFactory';
import { PicklistGroupDef } from '../../model/core/picklistGroupDef';

@Component({
    selector: 'app-picklist-group-editor',
    templateUrl: 'picklist-group-editor.component.html',
    styleUrls: ['picklist-group-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PicklistGroupEditorComponent implements OnDestroy {
    @Input()
    set group(group: PicklistGroupDef) {
        const simplifiedNameTemplate = new SimpleTemplate(group.nameTemplate);
        const optionValue = {
            stableId: group.stableId,
            name: simplifiedNameTemplate?.getTranslationText(this.config.defaultLanguageCode),
            options: group.options
        };
        this.groupForm.patchValue(optionValue);
    }
    @Input()
    set disabled(disabled: boolean) {
        if (disabled) {
            this.groupForm.disable();
        } else {
            this.groupForm.enable();
        }
    }
    @Input()
    set notUniqueStableId(stableIdIsNotUnique: boolean) {
        const error = stableIdIsNotUnique ? {stableIdIsNotUnique: true} : null;
        this.groupForm.get('stableId').setErrors(error);
    }
    @Input() notUniqueOptionsStableIds: string[];
    @Output() groupChanged = new EventEmitter<PicklistGroupDef>();

    public groupForm = this.fb.group({
        stableId: ['', Validators.required],
        name: ['', Validators.required],
        options: [[], Validators.required],
    });

    public get options(): FormControl {
        return this.groupForm.get('options') as FormControl;
    }

    private ngUnsubscribe = new Subject<void>();
    private factory: StudyConfigObjectFactory;

    constructor(private fb: FormBuilder, private config: ConfigurationService) {
        this.factory = new StudyConfigObjectFactory(config);
        this.groupForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            const formData = this.groupForm.getRawValue();
            const simplifiedNameTemplate = new SimpleTemplate(this.factory.createBlankTemplate());
            simplifiedNameTemplate.setTranslationText(this.config.defaultLanguageCode, formData.name);
            const option: PicklistGroupDef = {
                stableId: formData.stableId,
                nameTemplate: simplifiedNameTemplate.toTemplate(),
                options: formData.options,
            };
            this.groupChanged.emit(option);
        });
    }

    updateGroupOptions(options): void {
        this.options.setValue([...options]);
    }

    addEmptyOptionToGroup(): void {
        const updatedOptions = [...this.options.value];
        const newOption = {
            stableId: '',
            optionLabelTemplate: new SimpleTemplate(this.factory.createBlankTemplate()),
        };
        updatedOptions.push(newOption);
        this.options.setValue([...updatedOptions]);
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
