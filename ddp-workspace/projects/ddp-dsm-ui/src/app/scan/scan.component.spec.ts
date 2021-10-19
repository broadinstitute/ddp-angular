import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { ComponentService } from '../services/component.service';
import { ScanComponent } from './scan.component';

describe('Component: ScanComponent', () => {
  let component: ScanComponent;
  let fixture: ComponentFixture<ScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [
          ScanComponent
        ],
        imports: [],
        providers: [
          { provide: ChangeDetectorRef, useValue: {}},
          { provide: DSMService, useValue: {}},
          { provide: Router, useValue: {}},
          { provide: Auth, useValue: {}},
          { provide: ActivatedRoute, useValue: {}},
          { provide: ComponentService, useValue: {}}
        ],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
