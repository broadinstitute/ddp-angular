import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicianComponent } from './physician.component';

describe('PhysicianComponent', () => {
  let component: PhysicianComponent;
  let fixture: ComponentFixture<PhysicianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
