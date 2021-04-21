import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextQuestionBlockComponent } from './text-question-block.component';

describe('TextQuestionBlockComponent', () => {
  let component: TextQuestionBlockComponent;
  let fixture: ComponentFixture<TextQuestionBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextQuestionBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextQuestionBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
