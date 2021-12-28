import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PicklistQuestionEditorComponent } from './picklist-question-editor.component';
import { ManageListComponent } from '../manage-list/manage-list.component';
import { PicklistOptionsListComponent } from '../picklist-options-list/picklist-options-list.component';

describe('PicklistQuestionEditorComponent', () => {
  let component: PicklistQuestionEditorComponent;
  let fixture: ComponentFixture<PicklistQuestionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule
      ],
      declarations: [
        PicklistQuestionEditorComponent,
        ManageListComponent,
        PicklistOptionsListComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PicklistQuestionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
