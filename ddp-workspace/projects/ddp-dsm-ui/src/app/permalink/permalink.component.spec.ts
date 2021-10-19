import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { ComponentService } from '../services/component.service';
import { PermalinkComponent } from './permalink.component';

describe('Component: PermalinkComponent', () => {
  let component: PermalinkComponent;
  let fixture: ComponentFixture<PermalinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [
          PermalinkComponent
        ],
        imports: [],
        providers: [
          { provide: Router, useValue: {}},
          { provide: ActivatedRoute, useValue: {}},
          { provide: DSMService, useValue: {}},
          { provide: Auth, useValue: {}},
          { provide: ComponentService, useValue: {}}
        ],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermalinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
