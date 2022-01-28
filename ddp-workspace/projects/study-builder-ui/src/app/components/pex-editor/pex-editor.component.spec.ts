import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PexEditorComponent } from './pex-editor.component';

describe('PexEditorComponent', () => {
  let component: PexEditorComponent;
  let fixture: ComponentFixture<PexEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PexEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PexEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
