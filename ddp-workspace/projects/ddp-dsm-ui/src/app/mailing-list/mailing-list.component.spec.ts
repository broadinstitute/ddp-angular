import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { ComponentService } from '../services/component.service';
import { RoleService } from '../services/role.service';
import { MailingListComponent } from './mailing-list.component';

describe('Component: MailingListComponent', () => {
  let component: MailingListComponent;
  let fixture: ComponentFixture<MailingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [
          MailingListComponent
        ],
        imports: [],
        providers: [
          { provide: DSMService, useValue: {}},
          { provide: Auth, useValue: {}},
          { provide: RoleService, useValue: {}},
          { provide: ComponentService, useValue: {}},
          { provide: ActivatedRoute, useValue: {}}
        ],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
