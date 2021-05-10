import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticContentBlockEditorComponent } from './static-content-block-editor.component';

describe('StaticContentBlockEditorComponent', () => {
  let component: StaticContentBlockEditorComponent;
  let fixture: ComponentFixture<StaticContentBlockEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaticContentBlockEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticContentBlockEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
