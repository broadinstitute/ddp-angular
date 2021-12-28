import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { StaticContentBlockComponent } from './static-content-block.component';
import { ActivityContentComponent } from 'ddp-sdk';

describe('StaticContentBlockComponent', () => {
  let component: StaticContentBlockComponent;
  let fixture: ComponentFixture<StaticContentBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaticContentBlockComponent, ActivityContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticContentBlockComponent);
    component = fixture.componentInstance;
    component.definitionBlock$ = of({}) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
