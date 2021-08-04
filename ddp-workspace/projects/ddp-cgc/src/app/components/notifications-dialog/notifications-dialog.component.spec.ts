import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { NotificationsDialogComponent } from './notifications-dialog.component';


@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

describe('NotificationsDialogComponent', () => {
  let component: NotificationsDialogComponent;
  let fixture: ComponentFixture<NotificationsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationsDialogComponent, MockTranslatePipe ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            messages: []
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
