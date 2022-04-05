import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorsBlockComponent } from './validators-block.component';

describe('ValidatorsBlockComponent', () => {
  let component: ValidatorsBlockComponent;
  let fixture: ComponentFixture<ValidatorsBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatorsBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorsBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
