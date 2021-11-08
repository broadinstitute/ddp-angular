import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvitationDataComponent } from './invitation-data.component';

describe('InvitationDataComponent', () => {
  let component: InvitationDataComponent;
  let fixture: ComponentFixture<InvitationDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
