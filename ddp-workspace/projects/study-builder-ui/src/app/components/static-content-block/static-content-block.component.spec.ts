import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticContentBlockComponent } from './static-content-block.component';

describe('StaticContentBlockComponent', () => {
  let component: StaticContentBlockComponent;
  let fixture: ComponentFixture<StaticContentBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaticContentBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticContentBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
