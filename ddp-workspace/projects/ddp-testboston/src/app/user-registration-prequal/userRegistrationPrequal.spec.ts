import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegistrationPrequalComponent } from './userRegistrationPrequal.component';

describe('UserRegistrationPrequalComponent', () => {
  let component: UserRegistrationPrequalComponent;
  let fixture: ComponentFixture<UserRegistrationPrequalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRegistrationPrequalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRegistrationPrequalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
