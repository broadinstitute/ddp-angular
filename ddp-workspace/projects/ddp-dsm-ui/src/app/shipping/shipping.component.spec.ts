import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { ComponentService } from '../services/component.service';
import { RoleService } from '../services/role.service';
import { ShippingComponent } from './shipping.component';
import { Utils } from '../utils/utils';
import { Language } from '../utils/language';

describe('Component: ShippingComponent', () => {
  let component: ShippingComponent;
  let fixture: ComponentFixture<ShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [
          ShippingComponent
        ],
        imports: [],
        providers: [
          { provide: ActivatedRoute, useValue: {}},
          { provide: Router, useValue: {}},
          { provide: DSMService, useValue: {}},
          { provide: Auth, useValue: {}},
          { provide: RoleService, useValue: {}},
          { provide: ComponentService, useValue: {}},
          { provide: ChangeDetectorRef, useValue: {}},
          { provide: Utils, useValue: {}},
          { provide: Language, useValue: {}}
        ],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
