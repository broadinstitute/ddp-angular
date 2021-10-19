import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { ComponentService } from '../services/component.service';
import { RoleService } from '../services/role.service';
import { MedicalRecordComponent } from './medical-record.component';
import { Utils } from '../utils/utils';

describe('Component: MedicalRecordComponent', () => {
  let component: MedicalRecordComponent;
  let fixture: ComponentFixture<MedicalRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [
          MedicalRecordComponent
        ],
        imports: [],
        providers: [
          { provide: ChangeDetectorRef, useValue: {}},
          { provide: Auth, useValue: {}},
          { provide: ComponentService, useValue: {}},
          { provide: DSMService, useValue: {}},
          { provide: RoleService, useValue: {}},
          { provide: Utils, useValue: {}},
          { provide: ActivatedRoute, useValue: {}}
        ],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
