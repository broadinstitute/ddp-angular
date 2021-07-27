import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinCmiSectionComponent } from './join-cmi-section.component';

describe('JoinCmiSectionComponent', () => {
  let component: JoinCmiSectionComponent;
  let fixture: ComponentFixture<JoinCmiSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinCmiSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinCmiSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
