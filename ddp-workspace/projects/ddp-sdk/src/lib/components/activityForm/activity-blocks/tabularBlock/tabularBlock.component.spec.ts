import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabularBlockComponent } from './tabularBlock.component';

describe('TabularBlockComponent', () => {
  let component: TabularBlockComponent;
  let fixture: ComponentFixture<TabularBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabularBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabularBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
