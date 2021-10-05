import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserActivitiesComponent } from './user-activities.component';


@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

describe('UserActivitiesComponent', () => {
  let component: UserActivitiesComponent;
  let fixture: ComponentFixture<UserActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserActivitiesComponent, MockTranslatePipe ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
