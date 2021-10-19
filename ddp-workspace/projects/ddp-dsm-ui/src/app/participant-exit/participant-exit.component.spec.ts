import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { ComponentService } from '../services/component.service';
import { RoleService } from '../services/role.service';
import { ParticipantExitComponent } from './participant-exit.component';

describe('Component: ParticipantExitComponent', () => {
  let component: ParticipantExitComponent;
  let fixture: ComponentFixture<ParticipantExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [
          ParticipantExitComponent
        ],
        imports: [],
        providers: [
          { provide: DSMService, useValue: {}},
          { provide: Auth, useValue: {}},
          { provide: Router, useValue: {}},
          { provide: RoleService, useValue: {}},
          { provide: ComponentService, useValue: {}},
          { provide: ActivatedRoute, useValue: {}}
        ],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
