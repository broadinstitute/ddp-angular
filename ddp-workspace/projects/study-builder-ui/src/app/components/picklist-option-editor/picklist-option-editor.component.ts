import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PicklistOptionDef } from '../../model/core/picklistOptionDef';
import { SimpleTemplate } from '../../model/core-extended/simpleTemplate';
import { ConfigurationService } from '../../configuration.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StudyConfigObjectFactory } from '../../model/core-extended/studyConfigObjectFactory';

@Component({
    selector: 'app-picklist-option-editor',
    templateUrl: 'picklist-option-editor.component.html',
    styleUrls: ['picklist-option-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PicklistOptionEditorComponent implements OnDestroy {
    @Input()
    set option(option: PicklistOptionDef) {
        const simplifiedLabelTemplate = new SimpleTemplate(option.optionLabelTemplate);
        const simplifiedTooltipTemplate = option.tooltipTemplate && new SimpleTemplate(option.tooltipTemplate);
        const simplifiedDetailLabelTemplate = option.detailLabelTemplate && new SimpleTemplate(option.detailLabelTemplate);
        const optionValue = {
            stableId: option.stableId,
            label: simplifiedLabelTemplate?.getTranslationText(this.config.defaultLanguageCode),
            tooltip: simplifiedTooltipTemplate?.getTranslationText(this.config.defaultLanguageCode),
            detailLabel: simplifiedDetailLabelTemplate?.getTranslationText(this.config.defaultLanguageCode),
            allowDetails: option.allowDetails,
            exclusive: option.exclusive,
        };
        this.optionForm.patchValue(optionValue);
    }
    @Input()
    set notUniqueStableId(stableIdIsNotUnique: boolean) {
        if (stableIdIsNotUnique) {
            this.optionForm.get('stableId').setErrors({stableIdIsNotUnique: true});
        } else {
            this.optionForm.get('stableId').setErrors(null);
        }
    }
    @Output() optionChanged = new EventEmitter<PicklistOptionDef>();

    public optionForm = this.fb.group({
        stableId: ['', Validators.required],
        label: ['', Validators.required],
        tooltip: [''],
        detailLabel: [{value: '', disabled: true}],
        allowDetails: [false],
        exclusive: [false],
    });

    private ngUnsubscribe = new Subject();
    private factory: StudyConfigObjectFactory;

    constructor(private fb: FormBuilder, private config: ConfigurationService) {
        this.factory = new StudyConfigObjectFactory(config);
        this.optionForm.get('allowDetails').valueChanges
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((allowDetails: boolean) => {
                if (allowDetails) {
                    this.optionForm.get('detailLabel').enable({emitEvent: false});
                } else {
                    this.optionForm.get('detailLabel').disable({emitEvent: false});
                }
            });

        this.optionForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            const formData = this.optionForm.getRawValue();
            const simplifiedLabelTemplate = new SimpleTemplate(this.factory.createBlankTemplate());
            const simplifiedTooltipTemplate = new SimpleTemplate(this.factory.createBlankTemplate());
            const simplifiedDetailLabelTemplate = new SimpleTemplate(this.factory.createBlankTemplate());
            simplifiedLabelTemplate.setTranslationText(this.config.defaultLanguageCode, formData.label);
            simplifiedTooltipTemplate.setTranslationText(this.config.defaultLanguageCode, formData.tooltip);
            simplifiedDetailLabelTemplate.setTranslationText(this.config.defaultLanguageCode, formData.detailLabel);
            const option: PicklistOptionDef = {
                stableId: formData.stableId,
                optionLabelTemplate: simplifiedLabelTemplate.toTemplate(),
                tooltipTemplate: simplifiedTooltipTemplate.toTemplate(),
                detailLabelTemplate: simplifiedDetailLabelTemplate.toTemplate(),
                allowDetails: formData.allowDetails,
                exclusive: formData.exclusive,
            };
            this.optionChanged.emit(option);
        });
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
