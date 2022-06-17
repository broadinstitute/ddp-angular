import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCohortTagModalComponent } from './bulk-cohort-tag-modal.component';

describe('BulkCohortTagModalComponent', () => {
  let component: BulkCohortTagModalComponent;
  let fixture: ComponentFixture<BulkCohortTagModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkCohortTagModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkCohortTagModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
