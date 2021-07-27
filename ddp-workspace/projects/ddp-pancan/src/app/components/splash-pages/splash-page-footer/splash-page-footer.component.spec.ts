import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplashPageFooterComponent } from './splash-page-footer.component';

describe('SplashPageFooterComponent', () => {
  let component: SplashPageFooterComponent;
  let fixture: ComponentFixture<SplashPageFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SplashPageFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SplashPageFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
