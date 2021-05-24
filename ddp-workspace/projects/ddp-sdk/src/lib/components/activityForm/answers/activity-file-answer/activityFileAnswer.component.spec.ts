import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
    NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';

import { TranslateTestingModule } from '../../../../testsupport/translateTestingModule';
import { ActivityFileAnswer } from './activityFileAnswer.component';
import { MatIconModule } from '@angular/material/icon';
import { FileUploadService } from '../../../../services/fileUpload.service';
import { LoggingService } from '../../../../services/logging.service';
import { ModalService } from '../../../../services/modal.service';

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
            declarations: [ActivityFileAnswer],
            imports: [
                FormsModule,
                NoopAnimationsModule,
                MatIconModule,
                MatChipsModule,
                TranslateTestingModule,
            ],
            providers: [
                {provide: FileUploadService, useValue: fileUploadServiceSpy},
                {provide: LoggingService, useValue: loggingServiceSpy},
                {provide: MatDialog, useValue: matDialogSpy},
                {provide: ModalService, useValue: modalServiceSpy},
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivityFileAnswer);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
