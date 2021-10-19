import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { EmailEventComponent } from './email-event.component';
import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { RoleService } from '../services/role.service';
import { ComponentService } from '../services/component.service';

describe('Component: EmailEventComponent', () => {
  let component: EmailEventComponent;
  let fixture: ComponentFixture<EmailEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [
          EmailEventComponent
        ],
        imports: [],
        providers: [
          { provide: DSMService, useValue: {}},
          { provide: Auth, useValue: {}},
          { provide: RoleService, useValue: {}},
          { provide: ActivatedRoute, useValue: {}},
          { provide: Router, useValue: {}},
          { provide: ComponentService, useValue: {}}
        ],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
