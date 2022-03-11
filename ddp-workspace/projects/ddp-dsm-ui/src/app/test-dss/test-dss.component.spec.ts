import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDssComponent } from './test-dss.component';

describe('TestDssComponent', () => {
  let component: TestDssComponent;
  let fixture: ComponentFixture<TestDssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestDssComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
