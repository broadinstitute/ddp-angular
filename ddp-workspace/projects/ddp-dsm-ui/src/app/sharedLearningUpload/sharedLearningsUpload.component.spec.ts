import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {SharedLearningsUploadComponent} from "./sharedLearningsUpload.component";
import {SharedLearningsStateService} from "./services/sharedLearningsState.service";
import {MatDialogModule} from "@angular/material/dialog";
import {DebugElement} from "@angular/core";
import {expect} from "@angular/flex-layout/_private-utils/testing";
import {MatTooltipModule} from "@angular/material/tooltip";
import {RoleService} from "../services/role.service";
import {DSMService} from "../services/dsm.service";
import {UploadFileComponent} from "./components/uploadFile/uploadFile.component";
import {FilesTableComponent} from "./components/filesTable/filesTable.component";
import {By} from "@angular/platform-browser";
import {Observable, of} from "rxjs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

describe('SharedLearningsUploadComponent', () => {
  let component: SharedLearningsUploadComponent;
  let fixture: ComponentFixture<SharedLearningsUploadComponent>;
  let componentHTML: DebugElement;

  let sharedLearningsStateService;
  let roleService;

  beforeEach(waitForAsync(() => {
    roleService = jasmine.createSpyObj('RoleService', ['allowUploadRorFile']);

    sharedLearningsStateService =
      jasmine.createSpyObj('SharedLearningsStateService', [
        'getAndScanFiles',
        'addFile',
        'sendFileToParticipant',
        'deleteFile',
        'unsubscribe'
      ], ['somaticResultsFiles$']);

    TestBed.configureTestingModule({
      declarations: [SharedLearningsUploadComponent, UploadFileComponent, FilesTableComponent],
      providers: [
        {
          provide: SharedLearningsStateService,
          useValue: sharedLearningsStateService
        },
        {
          provide: RoleService,
          useValue: roleService
        },
        {
          provide: DSMService,
          useValue: {}
        }
      ],
      imports: [MatDialogModule, MatTooltipModule, MatProgressSpinnerModule]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLearningsUploadComponent);
    component = fixture.debugElement.componentInstance;
    componentHTML = fixture.debugElement;

    component.tabActivated$ = of(true) as Observable<any>;
  })

  it('should create component',  () => {
    expect(component).toBeTruthy('Component has not been instantiated');
  });

  it('should display error',  () =>  {
    component.displayedError = 'Test Error';
    fixture.detectChanges();
    const errorNote = componentHTML
      .query(By.css('section.error-note p:last-of-type'))
      .nativeElement
      .textContent;

    expect(errorNote).toContain('Test Error', 'Error message has not been displayed');
  });

})
