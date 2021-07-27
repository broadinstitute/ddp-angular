import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StayInformedSectionComponent } from './stay-informed-section.component';

describe('StayInformedSectionComponent', () => {
  let component: StayInformedSectionComponent;
  let fixture: ComponentFixture<StayInformedSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StayInformedSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StayInformedSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
