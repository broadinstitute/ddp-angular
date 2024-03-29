import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FieldMultiTypeArrayComponent } from './field-multi-type-array.component';

describe('FieldMultiTypeArrayComponent', () => {
  let component: FieldMultiTypeArrayComponent;
  let fixture: ComponentFixture<FieldMultiTypeArrayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldMultiTypeArrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldMultiTypeArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
