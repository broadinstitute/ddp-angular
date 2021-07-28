import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFooterComponent } from './base-footer.component';

describe('BaseFooterComponent', () => {
  let component: BaseFooterComponent;
  let fixture: ComponentFixture<BaseFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
