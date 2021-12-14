import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header.component';
import { SessionMementoService, WindowRef } from 'ddp-sdk';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { CommunicationService, HeaderConfigurationService } from 'toolkit';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { AppRoutes } from '../../app-routes';

class TranslateLoaderMock implements TranslateLoader {
  getTranslation(code = ''): Observable<object> {
    const TRANSLATIONS = {
      en: {}
    };
    return of(TRANSLATIONS[code]);
  }
}

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let sessionSpy: jasmine.SpyObj<SessionMementoService>;

  const dashboardPrismLinkSelector = '.header-link_dashboard-prism';

  beforeEach(async () => {
    sessionSpy = jasmine.createSpyObj('SessionMementoService', {
      isAuthenticatedSession: true,
      isAuthenticatedAdminSession: true,
    });
    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatIconModule,
        RouterTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateLoaderMock } }),
        NoopAnimationsModule],
      providers: [
        { provide: SessionMementoService , useValue: sessionSpy },
        { provide: CommunicationService , useValue: {} },
        { provide: HeaderConfigurationService, useValue: {} },
        { provide: WindowRef, useValue: {} },
      ],
      declarations: [HeaderComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('has link to the dashboard if the user is not admin', () => {
    sessionSpy.isAuthenticatedAdminSession.and.returnValue(false);
    fixture.detectChanges();

    const dashboardLink = fixture.debugElement.query(By.css(dashboardPrismLinkSelector));
    expect(dashboardLink.nativeElement.href).toContain(`/${AppRoutes.Dashboard}`);
  });

  it('has link to the prism if the user is admin', () => {
    const prismLink = fixture.debugElement.query(By.css(dashboardPrismLinkSelector));
    expect(prismLink.nativeElement.href).toContain(`/${AppRoutes.Prism}`);
  });
});
