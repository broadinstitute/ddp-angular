import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ActivityServiceAgent, UserActivityServiceAgent } from 'ddp-sdk';
import { Pipe, PipeTransform } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';


@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent, MockTranslatePipe ],
      providers: [
        { provide: Router, useValue: {} },
        { provide: 'ddp.config', useValue: {} },
        {
          provide: ActivityServiceAgent,
          useValue: {
            createInstance: () => of(null)
          }
        },
        {
          provide: UserActivityServiceAgent,
          useValue: {
            getActivities: () => of([])
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
