import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { TranslateTestingModule } from '../../../../testsupport/translateTestingModule';
import { ActivityFileAnswer } from './activityFileAnswer.component';
import { FileUploadService } from '../../../../services/fileUpload.service';
import { LoggingService } from '../../../../services/logging.service';
import { ModalDialogService } from '../../../../services/modal-dialog.service';
import { ActivityFileQuestionBlock } from '../../../../models/activity/activityFileQuestionBlock';
import { QuestionPromptComponent } from '../question-prompt/questionPrompt.component';
import { ValidationMessageComponent } from '../../../validationMessage.component';
import { ActivityFileValidationRule } from '../../../../services/activity/validators/activityFileValidationRule';
import { FileSizeFormatterPipe } from '../../../../pipes/fileSizeFormatter.pipe';
import { ActivityFileAnswerSuccess } from '../activity-file-answer-success/activityFileAnswerSuccess.component';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {
                SDK: {
                    FileUpload: {
                        CancelBtnText: 'Cancel',
                        Size: '(size: {{size}})',
                    }
                }
            }
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('ActivityFileAnswer', () => {
    let component: ActivityFileAnswer;
    let fixture: ComponentFixture<ActivityFileAnswer>;
    let fileUploadServiceSpy: jasmine.SpyObj<FileUploadService>;
    let loggingServiceSpy: jasmine.SpyObj<LoggingService>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;
    let modalDialogServiceSpy: jasmine.SpyObj<ModalDialogService>;

    beforeEach(async () => {
        fileUploadServiceSpy = jasmine.createSpyObj('FileUploadService', ['getUploadUrl', 'uploadFile']);
        loggingServiceSpy = jasmine.createSpyObj('LoggingService', ['logDebug']);
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        modalDialogServiceSpy = jasmine.createSpyObj('ModalService', ['getDialogConfig']);

        await TestBed.configureTestingModule({
            declarations: [
                ActivityFileAnswer,
                ActivityFileAnswerSuccess,
                QuestionPromptComponent,
                ValidationMessageComponent,
                FileSizeFormatterPipe
            ],
            imports: [
                FormsModule,
                NoopAnimationsModule,
                MatIconModule,
                MatIconTestingModule,
                MatChipsModule,
                TranslateTestingModule,
                TranslateModule.forRoot({
                    loader: {provide: TranslateLoader, useClass: TranslateLoaderMock},
                }),
            ],
            providers: [
                {provide: FileUploadService, useValue: fileUploadServiceSpy},
                {provide: LoggingService, useValue: loggingServiceSpy},
                {provide: MatDialog, useValue: matDialogSpy},
                {provide: ModalDialogService, useValue: modalDialogServiceSpy},
                {provide: MatDialogRef, useValue: {}},
                {provide: MAT_DIALOG_DATA, useValue: {}}
            ],
        }).compileComponents();

        const translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivityFileAnswer);
        component = fixture.componentInstance;
        component.block = new ActivityFileQuestionBlock();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('There is already uploaded file', () => {
        beforeEach(() => {
            component.block.answer = [{
                fileName: '1.png',
                fileSize: 5000000
            }];
            component.ngOnInit();
            fixture.detectChanges();
        });

        it('should init previously uploaded file if any', () => {
            expect(component.uploadedFiles[0]).toEqual({
                fileName: '1.png',
                fileSize: 5000000
            });
        });

        it('should display an uploaded file data', () => {
            const uploadedFile = fixture.debugElement.query(By.css('.uploaded-file-chip')).nativeElement;
            expect(uploadedFile.textContent.trim()).toContain('1.png(size: 4.77 MB)');
        });

        it('should call undoUploadedFile by click on remove uploaded file button', () => {
            spyOn(component, 'undoUploadedFile');
            const removeUploadedFileBtn = fixture.debugElement.query(By.css('.uploaded-file mat-icon')).nativeElement;
            removeUploadedFileBtn.click();
            expect(component.undoUploadedFile).toHaveBeenCalled();
        });

        it('should set uploaded file as null on undoUploadedFile', () => {
            matDialogSpy.open.and.returnValue({
                afterClosed: () => of(true)
            } as any);
            modalDialogServiceSpy.getDialogConfig.and.returnValue({});
            component.undoUploadedFile(0);
            expect(component.uploadedFiles[0]).toBeFalsy();
        });

        it('should patch null on undoUploadedFile', () => {
            spyOn(component.valueChanged, 'emit');
            matDialogSpy.open.and.returnValue({
                afterClosed: () => of(true)
            } as any);
            modalDialogServiceSpy.getDialogConfig.and.returnValue({});
            component.undoUploadedFile(0);
            expect(component.block.answer[0]).toBeFalsy();
            expect(component.valueChanged.emit).toHaveBeenCalledWith([]);
        });

        it('should upload file after confirmation', () => {
            fileUploadServiceSpy.getUploadUrl.and.returnValue(of([{
                uploadGuid: 'uploadGuid',
                uploadUrl: 'uploadUrl'
            }]));
            fileUploadServiceSpy.uploadFile.and.returnValue(of({}));
            matDialogSpy.open.and.returnValue({
                afterClosed: () => of(true)
            } as any);
            modalDialogServiceSpy.getDialogConfig.and.returnValue({});
            component.onFilesSelected({target: {files: [{name: 'fileName', size: 2000000, type: '*.png'}]}} as unknown as Event);
            fixture.detectChanges();

            expect(fileUploadServiceSpy.uploadFile).toHaveBeenCalled();
        });
    });

    describe('There is not any uploaded file', () => {

        it('should patch file answer after upload', () => {
            spyOn(component.valueChanged, 'emit');
            modalDialogServiceSpy.getDialogConfig.and.returnValue({});
            fileUploadServiceSpy.getUploadUrl.and.returnValue(of([{
                uploadGuid: 'uploadGuid',
                uploadUrl: 'uploadUrl'
            }]));
            fileUploadServiceSpy.uploadFile.and.returnValue(of({}));
            component.uploadedFiles = [];
            component.onFilesSelected({target: {files: [{name: 'fileName', size: 5000000, type: '*.png'}]}} as unknown as Event);
            fixture.detectChanges();

            expect(component.block.answer[0])
                .toEqual(jasmine.objectContaining({fileName: 'fileName', fileSize: 5000000, fileMimeType: '*.png'}));
            expect(component.valueChanged.emit).toHaveBeenCalledWith(['uploadGuid']);
            expect(component.errorMessage).toBe('');
        });

        it('should show error message if a local validator failed', () => {
            const errorMessage = 'The file size is too big';
            const localValidator = new ActivityFileValidationRule({} as any);
            localValidator.result = errorMessage;
            localValidator.recalculate = () => false;
            component.block.validators = [localValidator];

            fileUploadServiceSpy.getUploadUrl.and.returnValue(of([{
                uploadGuid: 'uploadGuid',
                uploadUrl: 'uploadUrl'
            }]));

            component.onFilesSelected({target: {files: [{name: 'fileName', size: 5000000, type: '*.png'}]}} as unknown as Event);
            expect(component.errorMessage).toBe(errorMessage);
        });
    });
});
