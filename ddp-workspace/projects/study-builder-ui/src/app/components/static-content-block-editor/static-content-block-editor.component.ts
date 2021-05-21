import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, merge, Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ConfigurationService } from '../../configuration.service';
import { filter, map, tap } from 'rxjs/operators';
import { SimpleTemplate } from '../../model/core-extended/simpleTemplate';
import { ContentBlockDef } from '../../model/core/contentBlockDef';
import { Template } from '../../model/core/template';
import { StudyConfigObjectFactory } from '../../model/core-extended/studyConfigObjectFactory';

@Component({
    selector: 'app-static-content-block-editor',
    templateUrl: './static-content-block-editor.component.html',
    styleUrls: ['./static-content-block-editor.component.scss']
})
export class StaticContentBlockEditorComponent implements OnInit, OnDestroy {

    private contentBlockSubject: BehaviorSubject<ContentBlockDef | null> = new BehaviorSubject(null);

    @Input()
    set contentBlock(contentBlock: ContentBlockDef) {
        this.contentBlockSubject.next(contentBlock);
    }

    @Output()
    contentBlockChanged = new EventEmitter<ContentBlockDef>();

    formGroup = this.fb.group({
        title: [''],
        body: [''],
    });

    private sub: Subscription;
    private factory: StudyConfigObjectFactory;

    constructor(private fb: FormBuilder, private config: ConfigurationService) {
        this.factory = new StudyConfigObjectFactory(config);
    }

    ngOnInit(): void {
        const updateFormPipeline = this.contentBlockSubject.pipe(
            filter(block => !!block),
            tap(block => this.updateForm(block))
        );
        const updateBlockPipeline = this.formGroup.valueChanges.pipe(
            map(formData => this.updateBlock(formData)),
            tap(updatedBlock => this.contentBlockChanged.emit(updatedBlock))
        );
        this.sub = merge(updateFormPipeline, updateBlockPipeline).subscribe();
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
    // TODO: Delay in getting data from plugin. What is up with that?
    // TODO: How do we turn on other elements like <li><ol>, etc?
    public editorInit(): object {
        return {
            toolbar:  `undo redo | code | styleselect | bold italic |
                alignleft aligncenter alignright alignjustify |bullist numlist outdent indent | link image | print preview media fullpage |
                forecolor backcolor emoticons | help`,
            plugins: `advlist autolink link image lists charmap hr anchor
            searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media
            table template paste help advcode`,
            setup: editor => {
                editor.ui.registry.addMenuButton('pepper', {
                    text: 'pepper',
                    fetch: callback => {
                        callback([
                            {
                                type: 'menuitem',
                                text: '$pepper.firstName()',
                                onAction: () => {
                                    editor.insertContent('<strong>$pepper.firstName()</strong>');
                                }
                            }
                        ]);
                    }
                });
            }
        };
    }

    initialContent(): string {
        return this.contentBlockSubject.value?.bodyTemplate ?
            new SimpleTemplate(this.contentBlockSubject.value?.bodyTemplate).getTranslationText(this.config.defaultLanguageCode)
            : '';
    }

    private updateForm(contentBlock: ContentBlockDef): void {
        const simpleTitleTemplate: SimpleTemplate | null = contentBlock.titleTemplate && new SimpleTemplate(contentBlock.titleTemplate);
        const simpleBodyTemplate = contentBlock.bodyTemplate && new SimpleTemplate(contentBlock.bodyTemplate);
        this.formGroup.patchValue({
            title: simpleTitleTemplate?.getTranslationText(this.config.defaultLanguageCode),
            body: simpleBodyTemplate?.getTranslationText(this.config.defaultLanguageCode)
        });
    }

    private updateBlock(formData: any): ContentBlockDef {
        const contentBlock = this.contentBlockSubject.value;
        if (!contentBlock) {
            return;
        }
        contentBlock.titleTemplate = this.updatedTemplateTranslation(contentBlock.titleTemplate, formData.title);
        contentBlock.bodyTemplate = this.updatedTemplateTranslation(contentBlock.bodyTemplate, formData.body);
        return contentBlock;
    }
    // TODO Can the template creation an editing be packaged together for reuse?
    private updatedTemplateTranslation(existingTemplate: Template | null, newTransValue: string): Template | null {
        if (newTransValue && newTransValue.trim().length > 0) {
            const baseTemplate: Template = existingTemplate ? existingTemplate : this.factory.createBlankTemplate();
            const simpleTemplate = new SimpleTemplate(baseTemplate);
            simpleTemplate.setTranslationText(this.config.defaultLanguageCode, newTransValue);
            return simpleTemplate.toTemplate();
        } else {
            return null;
        }
    }
}
