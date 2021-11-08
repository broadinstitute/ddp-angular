import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OncHistoryDetailComponent } from './onc-history-detail.component';

describe('OncHistoryComponent', () => {
  let component: OncHistoryDetailComponent;
  let fixture: ComponentFixture<OncHistoryDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OncHistoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OncHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
