import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';

import { CohortTagComponent } from './cohort-tag.component';
import { ComponentService } from '../../services/component.service';
import { DSMService } from '../../services/dsm.service';

describe('CohortTagComponent', () => {
  let component: CohortTagComponent;
  let fixture: ComponentFixture<CohortTagComponent>;
  let componentServiceSpy: jasmine.SpyObj<ComponentService>;
  let dsmServiceSpy: jasmine.SpyObj<DSMService>;

  beforeEach(async () => {
    componentServiceSpy = jasmine.createSpyObj('ComponentService', ['getRealm']);
    dsmServiceSpy = jasmine.createSpyObj('DSMService', ['createCohortTag', 'deleteCohortTag']);

    await TestBed.configureTestingModule({
      declarations: [ CohortTagComponent ],
      imports: [
        MatChipsModule,
        MatFormFieldModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ComponentService, useValue: componentServiceSpy},
        { provide: DSMService, useValue: componentServiceSpy}
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CohortTagComponent);
    component = fixture.componentInstance;
    component.dsm = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
