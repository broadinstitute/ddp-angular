import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShippingSearchComponent } from './shipping-search.component';

describe('ShippingSearchComponent', () => {
  let component: ShippingSearchComponent;
  let fixture: ComponentFixture<ShippingSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
