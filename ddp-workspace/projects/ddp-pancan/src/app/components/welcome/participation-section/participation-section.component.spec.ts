import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationSectionComponent } from './participation-section.component';

describe('ParticipationSectionComponent', () => {
  let component: ParticipationSectionComponent;
  let fixture: ComponentFixture<ParticipationSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipationSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
