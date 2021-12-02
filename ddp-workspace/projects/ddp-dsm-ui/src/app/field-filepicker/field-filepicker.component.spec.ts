import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FieldFilepickerComponent } from './field-filepicker.component';

describe('FieldFilepickerComponent', () => {
  let component: FieldFilepickerComponent;
  let fixture: ComponentFixture<FieldFilepickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldFilepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldFilepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
