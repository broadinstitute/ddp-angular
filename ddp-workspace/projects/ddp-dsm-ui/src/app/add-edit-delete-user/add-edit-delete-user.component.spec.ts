import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDeleteUserComponent } from './add-edit-delete-user.component';

describe('AddEditDeleteUserComponent', () => {
  let component: AddEditDeleteUserComponent;
  let fixture: ComponentFixture<AddEditDeleteUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditDeleteUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDeleteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
