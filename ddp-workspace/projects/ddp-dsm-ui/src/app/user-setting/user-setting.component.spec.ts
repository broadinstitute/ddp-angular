import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { ComponentService } from '../services/component.service';
import { RoleService } from '../services/role.service';
import { UserSettingComponent } from './user-setting.component';
import { Utils } from '../utils/utils';

describe('Component: UserSettingComponent', () => {
  let component: UserSettingComponent;
  let fixture: ComponentFixture<UserSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [
          UserSettingComponent
        ],
        imports: [],
        providers: [
          { provide: ActivatedRoute, useValue: {}},
          { provide: RoleService, useValue: {}},
          { provide: DSMService, useValue: {}},
          { provide: Router, useValue: {}},
          { provide: Auth, useValue: {}},
          { provide: Utils, useValue: {}},
          { provide: ComponentService, useValue: {}}
        ],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
