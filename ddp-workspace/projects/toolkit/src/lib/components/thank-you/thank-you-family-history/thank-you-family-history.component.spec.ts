import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankYouFamilyHistoryComponent } from './thank-you-family-history.component';

describe('ThankYouFamilyHistoryComponent', () => {
  let component: ThankYouFamilyHistoryComponent;
  let fixture: ComponentFixture<ThankYouFamilyHistoryComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ ThankYouFamilyHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankYouFamilyHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
