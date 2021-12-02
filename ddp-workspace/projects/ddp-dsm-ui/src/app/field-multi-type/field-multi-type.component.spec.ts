import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FieldMultiTypeComponent } from './field-multi-type.component';

describe('FieldMultiTypeComponent', () => {
  let component: FieldMultiTypeComponent;
  let fixture: ComponentFixture<FieldMultiTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldMultiTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldMultiTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
