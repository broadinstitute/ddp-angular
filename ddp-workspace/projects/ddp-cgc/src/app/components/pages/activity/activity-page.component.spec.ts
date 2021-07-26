import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { WorkflowBuilderService } from 'toolkit';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityPageComponent } from './activity-page.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/overlay';
import { AnnouncementsServiceAgent } from 'ddp-sdk';


describe('ActivityComponent', () => {
  let component: ActivityPageComponent;
  let fixture: ComponentFixture<ActivityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityPageComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'id' })
          }
        },
        { provide: 'ddp.config', useValue: {} },
        {
          provide: WorkflowBuilderService,
          useValue: {
            getActivities: (response) => ({ execute: () => {} })
          }
        },
        {
          provide: MatDialog, 
          useValue: {
            open: (component: ComponentType<unknown>, config?: MatDialogConfig<unknown>) => {}
          }
        },
        {
          provide: AnnouncementsServiceAgent,
          useValue: {
            getMessages: (id: string) => of([])
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
