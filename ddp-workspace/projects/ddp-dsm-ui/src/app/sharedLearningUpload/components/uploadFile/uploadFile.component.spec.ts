import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ConfigurationService, LoggingService} from 'ddp-sdk';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RoleService} from '../../../services/role.service';
import {DebugElement} from '@angular/core';
import {UploadFileComponent} from './uploadFile.component';
import {SharedLearningsHTTPService} from '../../services/sharedLearningsHTTP.service';
import {DSMService} from '../../../services/dsm.service';
import {of} from 'rxjs';
import {SessionService} from '../../../services/session.service';
import {SomaticResultSignedUrlResponse} from '../../interfaces/somaticResultSignedUrlRequest';
import {expect} from '@angular/flex-layout/_private-utils/testing';
import {MatDialogModule} from '@angular/material/dialog';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


const singleTestDocument: any = {
  somaticDocumentId: 429,
  deletedByUserId: 0,
  deletedAt: 0,
  isVirusFree: true,
  sentAt: 0
};

describe('UploadFileComponent', () => {
  let fixture: ComponentFixture<UploadFileComponent>;
  let component: UploadFileComponent;
  let componentHTML: DebugElement;

  const testFileName = 'testDocument.pdf';


  beforeEach(waitForAsync(() => {
    const sessionService = new SessionService();
    const sdkConfig = new ConfigurationService();
    const roleService = new RoleService(sessionService, sdkConfig);


    spyOnProperty(roleService, 'allowUploadRorFile', 'get').and.returnValue(true);

    const httpService = new SharedLearningsHTTPService({} as DSMService, sessionService);
    spyOn(httpService, 'getSignedUrl')
      .and
      .returnValue(
        of(
          {signedUrl: 'test signed URL',
          somaticResultUpload: singleTestDocument} as SomaticResultSignedUrlResponse)
      );

    spyOn(httpService, 'upload').and.returnValue(of({}));

    TestBed.configureTestingModule({
      declarations: [UploadFileComponent],
      imports: [MatDialogModule, MatTooltipModule, BrowserAnimationsModule],
      providers: [{
        provide: SharedLearningsHTTPService,
        useValue: httpService
      }, {
        provide: RoleService,
        useValue: roleService
      }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileComponent);
    component = fixture.componentInstance;
    componentHTML = fixture.debugElement;
  });

  it('should create component',  () => {
    expect(component).toBeTruthy('Component has not been instantiated');
  });

  it('should select file successfully',  () => {
    component.onFileSelection(pdfFileEvent());
    fixture.detectChanges();
    const fileName = component.selectedFileName;
    const uploadButton = componentHTML.query(By.css('button.upload-uploadBtn'));
    const selectedFileName = componentHTML.query(By.css('span.upload-selectedFileName'));
    expect(fileName).toEqual(testFileName);
    expect(selectedFileName.nativeElement.textContent).toEqual(testFileName);
    expect(uploadButton.nativeElement.disabled).toBeFalsy();
  });

  it('should upload successfully',  () => {
    const fileEvent = pdfFileEvent();
    component.onFileSelection(fileEvent);
    fixture.detectChanges();
    const HTMLInputElement = document.createElement('input');
    HTMLInputElement.type = 'file';
    Object.defineProperty(component.inputElement, 'nativeElement', {value: HTMLInputElement});
    component.inputElement.nativeElement.files = (fileEvent.target as HTMLInputElement).files;
    const uploadButton = componentHTML.query(By.css('button.upload-uploadBtn'));
    uploadButton.nativeElement.click();
    fixture.detectChanges();
    expect(uploadButton.nativeElement.textContent).toEqual('Uploaded');
  });

  /* Helper Functions */

  const pdfFileEvent = (): Event => {
    const event = new Event('change');
    const inputElement: HTMLInputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.files = createFilePDFAndGetFileList();
    Object.defineProperty(event, 'target', {value: inputElement});
    return event;
  };

  const createFilePDFAndGetFileList = (): FileList => {
    const file = new File(['PDF content'], testFileName, { type: 'application/pdf' });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
  };

});
