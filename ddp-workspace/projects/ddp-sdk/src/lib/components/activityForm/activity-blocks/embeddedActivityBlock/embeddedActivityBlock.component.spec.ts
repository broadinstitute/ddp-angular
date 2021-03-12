import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedActivityBlockComponent } from 'ddp-sdk';

describe('EmbeddedActivityBlockComponent', () => {
  let component: EmbeddedActivityBlockComponent;
  let fixture: ComponentFixture<EmbeddedActivityBlockComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ EmbeddedActivityBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedActivityBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
