import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { ComponentService } from '../services/component.service';
import { EelSettingComponent } from './eel-setting.component';

describe('Component: EelSettingComponent', () => {
  let component: EelSettingComponent;
  let fixture: ComponentFixture<EelSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [
          EelSettingComponent
        ],
        imports: [],
        providers: [
          { provide: DSMService, useValue: {}},
          { provide: Auth, useValue: {}},
          { provide: ComponentService, useValue: {}},
          { provide: ActivatedRoute, useValue: {}}
        ],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EelSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

