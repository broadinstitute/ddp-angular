import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { ComponentService } from '../services/component.service';
import { RoleService } from '../services/role.service';

describe('Component: Dashboard', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [
          DashboardComponent
        ],
        imports: [],
        providers: [
          { provide: DSMService, useValue: {}},
          { provide: Auth, useValue: {}},
          { provide: Router, useValue: {}},
          { provide: ComponentService, useValue: {}},
          { provide: ActivatedRoute, useValue: {}},
          { provide: RoleService, useValue: {}}
        ],
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
