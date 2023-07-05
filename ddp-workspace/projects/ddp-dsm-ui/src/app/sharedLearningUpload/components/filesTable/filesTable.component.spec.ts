import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FilesTableComponent} from './filesTable.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {RoleService} from '../../../services/role.service';
import {DebugElement} from '@angular/core';
import {MaterialHarnesses} from '../../../test-helpers/MaterialHarnesses';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {expect} from '@angular/flex-layout/_private-utils/testing';
import {ConfigurationService} from 'ddp-sdk';
import {By} from '@angular/platform-browser';
import {HttpRequestStatusEnum} from '../../enums/httpRequestStatus-enum';
import {SomaticResultsFileVirusStatusEnum} from '../../enums/somaticResultsFileVirusStatus-enum';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {DatePipe} from '@angular/common';
import { cloneDeep } from 'lodash';
import {SomaticResultsFileWithStatus} from '../../interfaces/somaticResultsFile';

const testDocuments: any = [
  // Clean, Sent File
  {
    somaticDocumentId: 111,
    fileName: 'testFileSuccessSent.pdf',
    createdAt: 1688476158,
    sentAt: 1688476500,
    virusStatus: SomaticResultsFileVirusStatusEnum.CLEAN,
    sendToParticipantStatus: {
      status: HttpRequestStatusEnum.NONE,
      message: null
    },
    deleteStatus: {
      status: HttpRequestStatusEnum.NONE,
      message: null
    }
  }
];

enum DocumentIconsEnum {
  CLEAN = 'check_circle_outline',
  INFECTED = 'bug_report',
  SPINNING = 'SPINNING',
  UNABLE_TO_SCAN = 'error_outline',
  RETRY = 'replay',
  FAIL = 'error',
  SUCCESS = 'check_circle',
  SEND = 'send',
  DELETE = 'delete_forever'
}

enum ColumnNameEnum {
  STATUS = 'VirusStatus',
  FILE = 'Name',
  DATE_UPLOADED = 'UploadDate',
  SEND_TO_PARTICIPANT = 'SendToParticipant',
  DATE_SENT = 'SentDate',
  DELETE = 'Delete'
}

describe('FilesTableComponent', () => {
  let fixture: ComponentFixture<FilesTableComponent>;
  let component: FilesTableComponent;
  let componentHTML: DebugElement;
  let materialHarnessLoader: MaterialHarnesses;

  const dateFormat = 'MM/dd/YYYY h:mm:ss aa';
  const datePipe: DatePipe = new DatePipe('en-US');

  beforeEach(waitForAsync(() => {
    const sdkConfig = new ConfigurationService();

    TestBed.configureTestingModule({
      declarations: [FilesTableComponent, DatePipe],
      imports: [MatIconModule, MatTableModule, MatTooltipModule, MatProgressSpinnerModule],
      providers: [{
        provide: 'ddp.config',
        useValue: sdkConfig
      }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesTableComponent);
    component = fixture.debugElement.componentInstance;
    componentHTML = fixture.debugElement;
    materialHarnessLoader = new MaterialHarnesses(TestbedHarnessEnvironment.loader(fixture));
  });

  it('should create component', () => {
    expect(component).toBeTruthy('Component has not been instantiated');
  });

  it('should display No files found', () => {
    fixture.detectChanges();
    const noFilesNote = componentHTML.query(By.css('.noFilesNote p'));
    expect(noFilesNote.nativeElement.textContent)
      .toEqual('No files found', 'No files found note is not displayed');
  });

  /* Text data */

  it('should display correct file name',async () => {
    component.somaticResultsFiles = testDocuments;
    fixture.detectChanges();
    const fileName = await getDocumentCellData(0, ColumnNameEnum.FILE);
    expect(fileName).toEqual('testFileSuccessSent.pdf', 'Wrong file name');
  });

  it('should display uploaded date in correct format', async () => {
    component.somaticResultsFiles = testDocuments;
    fixture.detectChanges();
    const dateUploaded = await getDocumentCellData(0, ColumnNameEnum.DATE_UPLOADED);
    expect(dateUploaded).toEqual(formatDate(1688476158), 'Wrong created at date format');
  });

  it('should display sent date in correct format', async () => {
    component.somaticResultsFiles = testDocuments;
    fixture.detectChanges();
    const sentDate = await getDocumentCellData(0, ColumnNameEnum.DATE_SENT);
    expect(sentDate).toEqual(formatDate(1688476500), 'Wrong sent date format');
  });

  /* Status icons */

  it('should display clean status file', async () => {
    component.somaticResultsFiles = testDocuments;
    fixture.detectChanges();
    const status = await getDocumentCellData(0, ColumnNameEnum.STATUS);
    expect(status).toEqual(DocumentIconsEnum.CLEAN, 'Wrong file status');
  });

  it('should display send icon',async () => {
    component.somaticResultsFiles = testDocuments;
    fixture.detectChanges();
    const sendToParticipant = await getDocumentCellData(0, ColumnNameEnum.SEND_TO_PARTICIPANT);
    expect(sendToParticipant).toEqual(DocumentIconsEnum.SEND, 'Wrong send to participant icon');
  });

  it('should display delete icon',async () => {
    component.somaticResultsFiles = testDocuments;
    fixture.detectChanges();
    const deleteIcon = await getDocumentCellData(0, ColumnNameEnum.DELETE);
    expect(deleteIcon).toEqual(DocumentIconsEnum.DELETE, 'Wrong delete icon');
  });

  it('should display infected status',async () => {
    const infectedDocument: SomaticResultsFileWithStatus = cloneDeep(testDocuments[0]);
    infectedDocument.virusStatus = SomaticResultsFileVirusStatusEnum.INFECTED;
    component.somaticResultsFiles = [infectedDocument];
    fixture.detectChanges();
    const status = await getDocumentCellData(0, ColumnNameEnum.STATUS);
    expect(status).toEqual(DocumentIconsEnum.INFECTED, 'Wrong virus status');
  });

  it('should display scanning status',async () => {
    const scanningDocument: SomaticResultsFileWithStatus = cloneDeep(testDocuments[0]);
    scanningDocument.virusStatus = SomaticResultsFileVirusStatusEnum.SCANNING;
    component.somaticResultsFiles = [scanningDocument];
    fixture.detectChanges();
    const status = await getDocumentCellData(0, ColumnNameEnum.STATUS);
    expect(status).toEqual(DocumentIconsEnum.SPINNING, 'Wrong virus status');
  });

  it('should display unable to scan status',async () => {
    const unableToScanDocument: SomaticResultsFileWithStatus = cloneDeep(testDocuments[0]);
    unableToScanDocument.virusStatus = SomaticResultsFileVirusStatusEnum.UNABLE_TO_SCAN;
    component.somaticResultsFiles = [unableToScanDocument];
    fixture.detectChanges();
    const status = await getDocumentCellData(0, ColumnNameEnum.STATUS);
    expect(status).toEqual(DocumentIconsEnum.UNABLE_TO_SCAN, 'Wrong virus status');
  });

  it('should display send to participant SUCCESS',async () => {
    const sendToParticipantSuccessDocument: SomaticResultsFileWithStatus = cloneDeep(testDocuments[0]);
    sendToParticipantSuccessDocument.sendToParticipantStatus.status = HttpRequestStatusEnum.SUCCESS;
    component.somaticResultsFiles = [sendToParticipantSuccessDocument];
    fixture.detectChanges();
    const status = await getDocumentCellData(0, ColumnNameEnum.SEND_TO_PARTICIPANT);
    expect(status).toEqual(DocumentIconsEnum.SUCCESS, 'Wrong send to participant status');
  });

  it('should display send to participant FAIL',async () => {
    const sendToParticipantFailDocument: SomaticResultsFileWithStatus = cloneDeep(testDocuments[0]);
    sendToParticipantFailDocument.sendToParticipantStatus.status = HttpRequestStatusEnum.FAIL;
    component.somaticResultsFiles = [sendToParticipantFailDocument];
    fixture.detectChanges();
    const status = await getDocumentCellData(0, ColumnNameEnum.SEND_TO_PARTICIPANT);
    expect(status).toEqual(DocumentIconsEnum.FAIL, 'Wrong send to participant status');
  });

  it('should display send to participant IN PROGRESS',async () => {
    const sendToParticipantInProgressDocument: SomaticResultsFileWithStatus = cloneDeep(testDocuments[0]);
    sendToParticipantInProgressDocument.sendToParticipantStatus.status = HttpRequestStatusEnum.IN_PROGRESS;
    component.somaticResultsFiles = [sendToParticipantInProgressDocument];
    fixture.detectChanges();
    const status = await getDocumentCellData(0, ColumnNameEnum.SEND_TO_PARTICIPANT);
    expect(status).toEqual(DocumentIconsEnum.SPINNING, 'Wrong send to participant status');
  });

  it('should display delete IN PROGRESS',async () => {
    const deleteInProgressDocument: SomaticResultsFileWithStatus = cloneDeep(testDocuments[0]);
    deleteInProgressDocument.deleteStatus.status = HttpRequestStatusEnum.IN_PROGRESS;
    component.somaticResultsFiles = [deleteInProgressDocument];
    fixture.detectChanges();
    const status = await getDocumentCellData(0, ColumnNameEnum.DELETE);
    expect(status).toEqual(DocumentIconsEnum.SPINNING, 'Wrong delete status');
  });


  /* HELPER FUNCTIONS */

  const getDocumentCellData = async (rowIndex: number, columName: ColumnNameEnum): Promise<DocumentIconsEnum> => {
    const matTableHarness = await materialHarnessLoader.getMatTableHarness();
    const rows = await matTableHarness.getRows();
    // the status information cell
    const cells = await rows[rowIndex].getCells();
    // cell data
    let cellData = '';

    // looking for cell data for the provided column
    for(const cell of cells) {
      if(await cell.getColumnName() === columName) {
        cellData = await cell.getText();
        break;
      }
    }

    // returns either matIcon text or SCANNING (matSpinner doesn't have text)
    return (cellData  || 'SPINNING') as DocumentIconsEnum;
  };

  const formatDate = (milliseconds: number): string =>
    datePipe.transform(milliseconds, dateFormat);
});
