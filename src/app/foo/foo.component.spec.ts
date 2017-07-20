import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooComponent } from './foo.component';
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {OperatorService} from "../operator/operator.service";
import {HttpModule, XHRBackend} from "@angular/http";
import {LoggingErrorHandler} from "../logging-error-handler";
import {GenericErrorHandler} from "../generic-error-handler";
import {MockBackend} from "@angular/http/testing";
import {UmbrellaConfig} from "../umbrella-config/umbrella-config";

describe('FooComponent', () => {
  let component: FooComponent;
  let fixture: ComponentFixture<FooComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const UMBRELLA = 'cmi';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooComponent ],
      providers: [OperatorService,
        { provide:UmbrellaConfig, useValue: new UmbrellaConfig("cmi","v1",null) },
        { provide: XHRBackend, useClass: MockBackend },
        { provide: GenericErrorHandler, useValue: new LoggingErrorHandler()}
      ],
      imports:[HttpModule]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('.foo'));
    el = de.nativeElement;
  });

  it('should create', () => {
    component.umbrellaConfig = new UmbrellaConfig(UMBRELLA,"v2",null);
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(el.textContent).toContain(UMBRELLA);
  });
});
