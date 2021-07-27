import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorectalPageComponent } from './colorectal-page.component';

describe('ColorectalPageComponent', () => {
  let component: ColorectalPageComponent;
  let fixture: ComponentFixture<ColorectalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorectalPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorectalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
