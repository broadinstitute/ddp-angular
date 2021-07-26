import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsDashboardComponent } from './results-dashboard.component';

describe('ResultsDashboardComponent', () => {
  let component: ResultsDashboardComponent;
  let fixture: ComponentFixture<ResultsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
