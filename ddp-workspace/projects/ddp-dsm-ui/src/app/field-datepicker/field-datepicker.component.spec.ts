import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FieldDatepickerComponent } from './field-datepicker.component';

describe('FieldDatepickerComponent', () => {
  let component: FieldDatepickerComponent;
  let fixture: ComponentFixture<FieldDatepickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
