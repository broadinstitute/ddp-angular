import { AppComponent } from './app.component';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { RenewSessionNotifier } from 'ddp-sdk';
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        MockTranslatePipe
      ],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            closeAll: () => {},
            open: () => {}
          }
        },
        {
          provide: RenewSessionNotifier,
          useValue: {
            openDialogEvents: {
              subscribe: () => {}
            }
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ddp-cgc'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ddp-cgc');
  });
});
