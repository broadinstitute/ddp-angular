import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AbstractionFieldComponent } from './abstraction-field.component';

describe('AbstractionFieldComponent', () => {
  let component: AbstractionFieldComponent;
  let fixture: ComponentFixture<AbstractionFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AbstractionFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractionFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
