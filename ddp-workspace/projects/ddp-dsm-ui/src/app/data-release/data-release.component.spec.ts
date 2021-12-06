import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataReleaseComponent } from './data-release.component';

describe('DataReleaseComponent', () => {
  let component: DataReleaseComponent;
  let fixture: ComponentFixture<DataReleaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
