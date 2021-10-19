import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { ComponentService } from '../services/component.service';
import { RoleService } from '../services/role.service';
import { ParticipantPageComponent } from './participant-page.component';
import { Utils } from '../utils/utils';

describe('Component: ParticipantPageComponent', () => {
  let component: ParticipantPageComponent;
  let fixture: ComponentFixture<ParticipantPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [
          ParticipantPageComponent
        ],
        imports: [],
        providers: [
          { provide: Auth, useValue: {}},
          { provide: ComponentService, useValue: {}},
          { provide: DSMService, useValue: {}},
          { provide: Router, useValue: {}},
          { provide: RoleService, useValue: {}},
          { provide: Utils, useValue: {}},
          { provide: ActivatedRoute, useValue: {}},
          { provide: MatDialog, useValue: {}}
        ],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
