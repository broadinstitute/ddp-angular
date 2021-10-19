import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { ComponentService } from '../services/component.service';
import { RoleService } from '../services/role.service';
import { MailingListComponent } from './mailing-list.component';
import { of } from 'rxjs';

describe('Component: MailingListComponent', () => {
  let component: MailingListComponent;
  let fixture: ComponentFixture<MailingListComponent>;
  let DSMServiceSpy: jasmine.SpyObj<DSMService>;
  let authSpy: jasmine.SpyObj<Auth>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('authSpy', ['authenticated', 'logout']);
    DSMServiceSpy = jasmine.createSpyObj('DSMServiceSpy', ['getRealmsAllowed', 'getMailingList']);
    DSMServiceSpy.getRealmsAllowed.and.returnValue(of([]));

    await TestBed.configureTestingModule({
        declarations: [
          MailingListComponent
        ],
        imports: [],
        providers: [
          { provide: DSMService, useValue: DSMServiceSpy},
          { provide: Auth, useValue: authSpy},
          { provide: RoleService, useValue: {}},
          { provide: ComponentService, useValue: {}},
          { provide: ActivatedRoute, useValue: { queryParams: of([]) } }
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
