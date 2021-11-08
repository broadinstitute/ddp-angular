import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TissueListComponent } from './tissue-list.component';

describe('TissueListComponent', () => {
  let component: TissueListComponent;
  let fixture: ComponentFixture<TissueListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TissueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TissueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
