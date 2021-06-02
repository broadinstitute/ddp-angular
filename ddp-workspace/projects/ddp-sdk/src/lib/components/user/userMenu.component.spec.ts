import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserMenuComponent } from './userMenu.component';
import { Auth0AdapterService, mockComponent, SessionMementoService } from 'ddp-sdk';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('UserMenuComponent', () => {
    let fixture: ComponentFixture<UserMenuComponent>;
    let component: UserMenuComponent;
    let sessionSpy: jasmine.SpyObj<SessionMementoService>;
    let router: Router;

    const dashboardLinkSelector = '.dashboard-link';
    const prismLinkSelector = '.prism-link';
    const menuTriggerSelector = '.mat-menu-trigger';

    beforeEach(async() => {
        const signInOut = mockComponent({ selector: 'ddp-sign-in-out', inputs: ['isScrolled'] });
        sessionSpy = jasmine.createSpyObj('SessionMementoService', {
            isAuthenticatedSession: true,
            isAuthenticatedAdminSession: true,
        });
        await TestBed.configureTestingModule({
            imports: [MatMenuModule, MatButtonModule, MatIconModule, RouterTestingModule, NoopAnimationsModule],
            providers: [
                { provide: SessionMementoService , useValue: sessionSpy },
                { provide: Auth0AdapterService , useValue: { } },
            ],
            declarations: [UserMenuComponent, signInOut],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserMenuComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        router = TestBed.inject(Router);
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('has link to the dashboard if the user is not admin', () => {
        sessionSpy.isAuthenticatedAdminSession.and.returnValue(false);
        fixture.detectChanges();
        spyOn(router, 'navigateByUrl');
        fixture.debugElement.query(By.css(menuTriggerSelector)).nativeElement.click();

        const dashboardLink = fixture.debugElement.query(By.css(dashboardLinkSelector));
        const prismLink = fixture.debugElement.query(By.css(prismLinkSelector));

        expect(dashboardLink).toBeTruthy();
        expect(prismLink).toBeFalsy();

        dashboardLink.nativeElement.click();

        expect(router.navigateByUrl).toHaveBeenCalledWith('dashboard');
    });

    it('has link to the prism if the user is admin', () => {
        spyOn(router, 'navigateByUrl');
        fixture.debugElement.query(By.css(menuTriggerSelector)).nativeElement.click();

        const dashboardLink = fixture.debugElement.query(By.css(dashboardLinkSelector));
        const prismLink = fixture.debugElement.query(By.css(prismLinkSelector));

        expect(dashboardLink).toBeFalsy();
        expect(prismLink).toBeTruthy();

        prismLink.nativeElement.click();

        expect(router.navigateByUrl).toHaveBeenCalledWith('prism');
    });
});
