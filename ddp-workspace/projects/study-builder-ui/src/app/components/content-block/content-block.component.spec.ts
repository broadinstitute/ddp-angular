import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentBlockComponent } from './content-block.component';
import { EditorComponent } from '@tinymce/tinymce-angular';

describe('ContentBlockComponent', () => {
  let component: ContentBlockComponent;
  let fixture: ComponentFixture<ContentBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentBlockComponent, EditorComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentBlockComponent);
    component = fixture.componentInstance;
    component.block = {
        bodyTemplate: {
            variables: [{
                translations: [{
                    text: ''
                }]
            }]
        }
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
