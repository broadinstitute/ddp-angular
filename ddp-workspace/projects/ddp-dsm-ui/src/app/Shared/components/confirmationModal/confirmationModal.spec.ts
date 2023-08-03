import {ConfirmationModalComponent} from './confirmationModal.component';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('ConfirmationModalComponent', () => {
  let fixture: ComponentFixture<ConfirmationModalComponent>;
  let component: ConfirmationModalComponent;
  let componentHTML: DebugElement;

  beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ConfirmationModalComponent],
        providers: [
          {
            provide: MatDialogRef,
            useValue: jasmine.createSpyObj('MatDialogRef', ['close'])
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {fileName: 'testFile.pdf'}
          }
        ]
      }).compileComponents();
   }
  ));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.debugElement.componentInstance;
    componentHTML = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create component',  () => {
    expect(component).toBeTruthy('Component has not been instantiated');
  });

  it('should display file name',  () => {
    const fileName = componentHTML
      .query(By.css('section.confirmationModal-content p'))
      .nativeElement.textContent;

    expect(fileName).toContain('testFile.pdf', 'File name is not displayed');
  });

});
