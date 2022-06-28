import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ClinicalPageComponent} from './clinical-page.component';

describe( 'ClinicalPageComponent', () => {
  let component: ClinicalPageComponent;
  let fixture: ComponentFixture<ClinicalPageComponent>;

  beforeEach( async () => {
    await TestBed.configureTestingModule( {
      declarations: [ ClinicalPageComponent ]
    } )
      .compileComponents();
  } );

  beforeEach( () => {
    fixture = TestBed.createComponent( ClinicalPageComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  } );

  it( 'should create', () => {
    expect( component ).toBeTruthy();
  } );
} );
