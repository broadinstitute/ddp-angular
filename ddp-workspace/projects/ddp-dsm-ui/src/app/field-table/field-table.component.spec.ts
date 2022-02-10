import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

import { FieldTableComponent } from './field-table.component';
import { ModalComponent } from '../modal/modal.component';


describe('FieldTableComponent', () => {
  let component: FieldTableComponent;
  let fixture: ComponentFixture<FieldTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatCheckboxModule, FormsModule],
      declarations: [ FieldTableComponent, ModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldTableComponent);
    component = fixture.componentInstance;
    component.field = {
      fieldValue: {}
    } as any;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
