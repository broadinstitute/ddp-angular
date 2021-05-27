import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/index';

import { TranslateTestingModule } from '../../../../testsupport/translateTestingModule';
import { ActivityFileAnswer } from './activityFileAnswer.component';
import { FileUploadService } from '../../../../services/fileUpload.service';
import { LoggingService } from '../../../../services/logging.service';
import { ModalService } from '../../../../services/modal.service';
import { ActivityFileQuestionBlock } from '../../../../models/activity/activityFileQuestionBlock';
import { QuestionPromptComponent } from '../question-prompt/questionPrompt.component';
import { ValidationMessage } from '../../../validationMessage.component';
import { ActivityFileValidationRule } from '../../../../services/activity/validators/activityFileValidationRule';

describe('ActivityFileAnswer', () => {
    let component: ActivityFileAnswer;
    let fixture: ComponentFixture<ActivityFileAnswer>;
    let fileUploadServiceSpy: jasmine.SpyObj<FileUploadService>;
    let loggingServiceSpy: jasmine.SpyObj<LoggingService>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;
    let modalServiceSpy: jasmine.SpyObj<ModalService>;

    beforeEach(async() => {
        fileUploadServiceSpy = jasmine.createSpyObj('FileUploadService', ['getUploadUrl', 'uploadFile']);
        loggingServiceSpy = jasmine.createSpyObj('LoggingService', ['logDebug']);
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        modalServiceSpy = jasmine.createSpyObj('ModalService', ['getDialogConfig']);

        await TestBed.configureTestingModule({
            declarations: [
                ActivityFileAnswer,
                QuestionPromptComponent,
                ValidationMessage
            ],
            imports: [
                FormsModule,
                NoopAnimationsModule,
                MatIconModule,
                MatIconTestingModule,
                MatChipsModule,
                TranslateTestingModule,
            ],
            providers: [
                {provide: FileUploadService, useValue: fileUploadServiceSpy},
                {provide: LoggingService, useValue: loggingServiceSpy},
                {provide: MatDialog, useValue: matDialogSpy},
                {provide: ModalService, useValue: modalServiceSpy},
                {provide: MatDialogRef, useValue: {}},
                {provide: MAT_DIALOG_DATA, useValue: {}}
            ],
        }).compileComponents();
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

    it('should init file requirements', () => {
        component.block.maxFileSize = 1000;
        component.block.mimeTypes = ['.jpeg', '.png'];
        component.ngOnInit();

        expect(component.fileMaxSize).toEqual(1000);
        expect(component.fileMimeTypes).toEqual(['.jpeg', '.png']);
    });

    describe('There is already uploaded file', () => {
        beforeEach(() => {
            component.block.answer = {
                fileName: '1.png',
                fileSize: 1000
            };
            component.ngOnInit();
            fixture.detectChanges();
        });

        it('should init previously uploaded file if any', () => {
            expect(component.uploadedFile).toEqual({
                uploadGuid: '',
                uploadUrl: '',
                name: '1.png',
                size: 1000,
                isUploaded: true
            });
        });

        it('should display an uploaded file data', () => {
            const uploadedFile = fixture.debugElement.query(By.css('.uploaded-file-chip')).nativeElement;
            expect(uploadedFile.textContent.trim()).toContain('1.png (size: 1000)');
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
            modalServiceSpy.getDialogConfig.and.returnValue({});
            component.undoUploadedFile();
            expect(component.uploadedFile).toBeNull();
        });

        it('should patch null on undoUploadedFile', () => {
            spyOn(component.valueChanged, 'emit');
            matDialogSpy.open.and.returnValue({
                afterClosed: () => of(true)
            } as any);
            modalServiceSpy.getDialogConfig.and.returnValue({});
            component.undoUploadedFile();
            expect(component.block.answer).toBeNull();
            expect(component.valueChanged.emit).toHaveBeenCalledWith(null);
        });

        it('submit button should have `Reupload` text', () => {
            const submitBtn = fixture.debugElement.query(By.css('.submit-btn')).nativeElement;
            expect(submitBtn.textContent.trim()).toBe('Reupload');
        });

        it('should call openConfirmDialog on click Reupload button', () => {
            spyOn(component, 'openReuploadConfirmDialog');
            component.isFileSelected = true;
            fixture.detectChanges();
            const submitBtn = fixture.debugElement.query(By.css('.submit-btn')).nativeElement;
            submitBtn.click();
            expect(component.openReuploadConfirmDialog).toHaveBeenCalled();
        });

        it('should upload file after confirmation', () => {
            fileUploadServiceSpy.getUploadUrl.and.returnValue(of({
                uploadGuid: 'uploadGuid',
                uploadUrl: 'uploadUrl'
            }));
            fileUploadServiceSpy.uploadFile.and.returnValue(of({}));
            matDialogSpy.open.and.returnValue({
                afterClosed: () => of(true)
            } as any);
            modalServiceSpy.getDialogConfig.and.returnValue({});
            component.onFilesSelected([{name: 'fileName', size: 1000} as File]);
            fixture.detectChanges();

            component.openReuploadConfirmDialog();
            expect(fileUploadServiceSpy.uploadFile).toHaveBeenCalled();
        });
    });

    describe('There is not any uploaded file', () => {
        it('submit button should have `Submit` text', () => {
            const submitBtn = fixture.debugElement.query(By.css('.submit-btn')).nativeElement;
            expect(submitBtn.textContent.trim()).toBe('Submit');
        });

        it('should patch file answer after upload', () => {
            spyOn(component.valueChanged, 'emit');
            fileUploadServiceSpy.getUploadUrl.and.returnValue(of({
                uploadGuid: 'uploadGuid',
                uploadUrl: 'uploadUrl'
            }));
            fileUploadServiceSpy.uploadFile.and.returnValue(of({}));
            component.onFilesSelected([{name: 'fileName', size: 1000} as File]);
            fixture.detectChanges();

            component.submitFileUpload();
            expect(component.block.answer).toEqual({fileName: 'fileName', fileSize: 1000});
            expect(component.valueChanged.emit).toHaveBeenCalledWith('uploadGuid');

            expect(component.selectedFile).toBeNull();
            expect(component.isFileSelected).toBeFalse();
        });

        it('should show error message if a local validator failed', () => {
            const errorMessage = 'The file size is too big';
            const localValidator = new ActivityFileValidationRule({} as any);
            localValidator.result = errorMessage;
            localValidator.recalculate = () => false;
            component.block.validators = [localValidator];

            component.submitFileUpload();
            expect(component.errorMessage).toBe(errorMessage);
        });
    });
});
