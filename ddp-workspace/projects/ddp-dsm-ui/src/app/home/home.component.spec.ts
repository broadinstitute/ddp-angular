import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Auth } from '../services/auth.service';
import { HomeComponent } from './home.component';

describe('Component: HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [
          HomeComponent
        ],
        imports: [],
        providers: [
          { provide: Auth, useValue: {}}
        ],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
