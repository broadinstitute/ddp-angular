import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PdfDownloadComponent } from './pdf-download.component';

describe('PdfDownloadComponent', () => {
  let component: PdfDownloadComponent;
  let fixture: ComponentFixture<PdfDownloadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
