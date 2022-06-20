import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SequencingOrderComponent} from './sequencing-order.component';

describe( 'SequencingOrderComponent', () => {
  let component: SequencingOrderComponent;
  let fixture: ComponentFixture<SequencingOrderComponent>;

  beforeEach( async () => {
    await TestBed.configureTestingModule( {
      declarations: [ SequencingOrderComponent ]
    } )
      .compileComponents();
  } );

  beforeEach( () => {
    fixture = TestBed.createComponent( SequencingOrderComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  } );

  it( 'should create', () => {
    expect( component ).toBeTruthy();
  } );
} );
