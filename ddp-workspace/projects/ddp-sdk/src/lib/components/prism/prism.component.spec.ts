import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NEVER, Observable, of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { PrismComponent } from './prism.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { SessionStorageService } from '../../services/sessionStorage.service';
import { StickyScrollDirective } from '../../directives/sticky-scroll.directive';
import { Router } from '@angular/router';
import { SessionMementoService, WindowRef, EnrollmentStatusType, ParticipantsSearchServiceAgent } from 'ddp-sdk';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {
                SDK: {
                    Prism: {
                        NoData: 'NoData test',
                        NoUsers: 'NoUsers test',
                        WarningSize: 'WarningSize {{count}} from {{totalCount}} test',
                        MinQueryLengthHint: 'MinQueryLengthHint {{length}} test',
                        ClearSearch: 'ClearSearch test',
                        DashboardButtonLabel: 'DashboardButtonLabel {{user}} test'
                    }
                }
            }
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('PrismComponent', () => {
    let fixture: ComponentFixture<PrismComponent>;
    let component: PrismComponent;
    let debugElement: DebugElement;
    let participantsSearchSpy: jasmine.SpyObj<ParticipantsSearchServiceAgent>;
    let sessionServiceSpy: jasmine.SpyObj<SessionMementoService>;
    let storageServiceSpy: jasmine.SpyObj<SessionStorageService>;
    let router: Router;

    const studyGuid = 'TEST_ANGIO';
    const dashboardRoute = 'test-dashboard-route';
    const data = [{
        guid: '1234',
        hruid: '5678',
        firstName: 'Bob',
        lastName: 'Adams',
        status: EnrollmentStatusType.COMPLETED,
        invitationId: 'TBM398WQ8P6Z',
        legacyShortId: '12',
        proxy: {
            guid: '1235',
            hruid: '5679',
            firstName: 'Tom',
            lastName: 'Adams',
            email: 'proxytest@test.com',
        }
    },
        {
            guid: '567',
            hruid: '5678',
            status: EnrollmentStatusType.REGISTERED,
        },
        {
            guid: '890',
            hruid: '5678',
            firstName: 'Bob',
            lastName: 'Adams',
            status: EnrollmentStatusType.ENROLLED,
            invitationId: 'TBM398WQ8P6Z',
            email: 'test@test.com',
        }
    ];
    const configColumns = ['guid', 'userName', 'email', 'enrollmentStatus', 'dashboardLink'];

    beforeEach(async () => {
        storageServiceSpy = jasmine.createSpyObj('storageServiceSpy', { get: null, set: undefined });
        participantsSearchSpy = jasmine.createSpyObj('participantsSearchSpy', {search: of({results: data, totalCount: data.length})});
        sessionServiceSpy = jasmine.createSpyObj('sessionServiceSpy', ['setParticipant']);
        await TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                MatProgressSpinnerModule,
                MatInputModule,
                ReactiveFormsModule,
                MatTableModule,
                MatIconModule,
                RouterTestingModule.withRoutes([{path: dashboardRoute, component: PrismComponent}]),
                MatPaginatorModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                }),
            ],
            providers: [
                { provide: SessionStorageService , useValue: storageServiceSpy },
                { provide: ParticipantsSearchServiceAgent, useValue: participantsSearchSpy },
                { provide: SessionMementoService, useValue: sessionServiceSpy },
                { provide: 'ddp.config', useValue: { prismColumns: configColumns, prismDashboardRoute: dashboardRoute, studyGuid } },
                WindowRef
            ],
            declarations: [PrismComponent, StickyScrollDirective],
        })
            .compileComponents();

        const translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PrismComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        router = TestBed.inject(Router);
    });

    it('should create component (PrismComponent)', () => {
        expect(component).toBeTruthy();
    });

    it('shows "no data" message and hint when no query was entered', () => {
        const hintElement = fixture.debugElement.query(By.css('.prism-field .mat-hint')).nativeElement;
        const noDataElement = fixture.debugElement.query(By.css('.no-data-message')).nativeElement;

        expect(hintElement.textContent.trim()).toBe('MinQueryLengthHint 4 test');
        expect(noDataElement.textContent.trim()).toBe('NoData test');
    });

    it('shows no data message and hint when entered query was too short', () => {
        component.searchField.patchValue('tes');
        fixture.detectChanges();

        const hintElement = fixture.debugElement.query(By.css('.prism-field .mat-hint')).nativeElement;
        const noDataElement = fixture.debugElement.query(By.css('.no-data-message')).nativeElement;

        expect(hintElement.textContent.trim()).toBe('MinQueryLengthHint 4 test');
        expect(noDataElement.textContent.trim()).toBe('NoData test');
    });

    it('shows no data message and hint when entered query was long enough but contains too much empty spaces on boundaries', () => {
        component.searchField.patchValue('   tes  ');
        fixture.detectChanges();

        const hintElement = fixture.debugElement.query(By.css('.prism-field .mat-hint')).nativeElement;
        const noDataElement = fixture.debugElement.query(By.css('.no-data-message')).nativeElement;

        expect(hintElement.textContent.trim()).toBe('MinQueryLengthHint 4 test');
        expect(noDataElement.textContent.trim()).toBe('NoData test');
    });

    it('hides no data message and hint when entered query was long enough', () => {
        component.searchField.patchValue('test');
        fixture.detectChanges();

        const hintElement = fixture.debugElement.query(By.css('.prism-field .mat-hint'));
        const noDataElement = fixture.debugElement.query(By.css('.no-data-message'));

        expect(hintElement).toBeFalsy();
        expect(noDataElement).toBeFalsy();
    });

    it('hides clear search button when nothing is entered', () => {
        const clearSearchElement = fixture.debugElement.query(By.css('.prism-field__clear'));
        expect(clearSearchElement).toBeFalsy();
    });

    it('shows clear search button when something is entered', () => {
        component.searchField.patchValue('1');
        fixture.detectChanges();

        const clearSearchElement = fixture.debugElement.query(By.css('.prism-field__clear')).nativeElement;
        expect(clearSearchElement.textContent.trim()).toBe('ClearSearch test');
    });

    it('clears input search by click on the button', () => {
        component.searchField.patchValue('1');
        fixture.detectChanges();

        const clearSearchElement = fixture.debugElement.query(By.css('.prism-field__clear')).nativeElement;
        expect(component.searchField.value).toBeTruthy();
        clearSearchElement.click();
        expect(component.searchField.value).toBeFalsy();
    });

    it('hides no users message by default', () => {
        const noUsersElement = fixture.debugElement.query(By.css('.no-users-message'));
        expect(noUsersElement).toBeFalsy();
    });

    it('hides no users message at loading', fakeAsync(() => {
        participantsSearchSpy.search.and.returnValue(NEVER);
        component.searchField.patchValue('test');
        tick(300);
        fixture.detectChanges();

        const noUsersElement = fixture.debugElement.query(By.css('.no-users-message'));
        expect(noUsersElement).toBeFalsy();
    }));

    it('hides no users message when result is not empty', fakeAsync(() => {
        component.searchField.patchValue('test');
        tick(300);
        fixture.detectChanges();

        const noUsersElement = fixture.debugElement.query(By.css('.no-users-message'));
        expect(noUsersElement).toBeFalsy();
    }));

    it('show no users message when result is empty', fakeAsync(() => {
        participantsSearchSpy.search.and.returnValue(of({results: [], totalCount: 0}));
        component.searchField.patchValue('test');
        tick(300);
        fixture.detectChanges();

        const noUsersElement = fixture.debugElement.query(By.css('.no-users-message')).nativeElement;
        expect(noUsersElement.textContent.trim()).toBe('NoUsers test');
    }));

    it('sets initial data correctly', () => {
        expect(component.dataSource.data).toEqual([]);
        expect(component.totalCount).toBe(0);
        expect(component.searchField.value).toBeFalsy();
        expect(component.initialPageIndex).toBe(1);
        expect(component.initialPageSize).toBe(10);
    });

    it('sets table data correctly', fakeAsync(() => {
        component.searchField.patchValue('test');
        tick(300);
        fixture.detectChanges();

        expect(component.dataSource.data).toEqual(data);
        expect(component.totalCount).toBe(data.length);
    }));

    it('saves the result in the storage', fakeAsync(() => {
        const query = 'test';
        component.searchField.patchValue(query);
        tick(300);
        fixture.detectChanges();

        expect(storageServiceSpy.set).toHaveBeenCalledWith(`${studyGuid}_prism_search_query`, query);
        expect(storageServiceSpy.set).toHaveBeenCalledWith(`${studyGuid}_prism_search_participants`, JSON.stringify(data));
        expect(storageServiceSpy.set).toHaveBeenCalledWith(`${studyGuid}_prism_search_participants_count`, String(data.length));
    }));

    it('handles search null result correctly', fakeAsync(() => {
        participantsSearchSpy.search.and.returnValue(of(null));
        component.searchField.patchValue('test');
        tick(300);
        fixture.detectChanges();

        expect(component.dataSource.data).toEqual([]);
        expect(component.totalCount).toBe(0);
    }));

    it('shows warning when server returns not all available results', fakeAsync(() => {
        participantsSearchSpy.search.and.returnValue(of({results: data, totalCount: data.length + 1}));
        component.searchField.patchValue('test');
        tick(300);
        fixture.detectChanges();

        const warningElement = fixture.debugElement.query(By.css('.prism__warning-container')).nativeElement;
        expect(warningElement.textContent.trim()).toContain(`WarningSize ${data.length} from ${data.length + 1} test`);
    }));

    it('sets displayedColumns from configuration', () => {
        expect(component.displayedColumns).toEqual(configColumns);
    });

    it('navigates to the correct url when click on dashboard button', fakeAsync(() => {
        spyOn(router, 'navigateByUrl');
        component.searchField.patchValue('test');
        tick(300);
        fixture.detectChanges();

        const firstUserDashboardButton = fixture.debugElement.query(By.css('.dashboard-link')).nativeElement;
        firstUserDashboardButton.click();
        expect(router.navigateByUrl).toHaveBeenCalledWith(`/${dashboardRoute}`);
    }));

    it('saves selected user when click on dashboard button', fakeAsync(() => {
        component.searchField.patchValue('test');
        tick(300);
        fixture.detectChanges();

        const firstUserDashboardButton = fixture.debugElement.query(By.css('.dashboard-link')).nativeElement;
        firstUserDashboardButton.click();
        expect(sessionServiceSpy.setParticipant).toHaveBeenCalledWith('1234');
    }));

    it('sorts by userName correctly', () => {
        const sortingValue = component.dataSource.sortingDataAccessor({...data[0], firstName: 'Bob', lastName: 'Adams'}, 'userName');
        expect(sortingValue).toBe('Bob Adams');
    });

    it('sorts by userName correctly when no first or last name', () => {
        const sortingValue = component.dataSource.sortingDataAccessor({...data[0], firstName: null, lastName: null}, 'userName');
        expect(sortingValue).toBe('');
    });

    it('sorts by proxyUserName correctly', () => {
        const sortingValue = component.dataSource
            .sortingDataAccessor({...data[0], proxy: {...data[0].proxy, firstName: 'Tom', lastName: 'Adams'}}, 'proxyUserName');
        expect(sortingValue).toBe('Tom Adams');
    });

    it('sorts by proxyUserName correctly when no proxy', () => {
        const sortingValue = component.dataSource.sortingDataAccessor({...data[0], proxy: null}, 'proxyUserName');
        expect(sortingValue).toBe('');
    });

    it('sorts by legacyShortId correctly', () => {
        const sortingValue = component.dataSource.sortingDataAccessor({...data[0], legacyShortId: '10'}, 'legacyShortId');
        expect(sortingValue).toBe(10);
    });

    it('returns correct user label with first and last name', fakeAsync(() => {
        const firstName = 'test firstName';
        const lastName = 'test lastName';
        participantsSearchSpy.search.and.returnValue(of({results: [{...data[0], firstName, lastName}], totalCount: 1}));
        component.searchField.patchValue('test');
        tick(300);
        fixture.detectChanges();

        const firstUserDashboardButton = fixture.debugElement.query(By.css('.dashboard-link')).nativeElement;
        expect(firstUserDashboardButton.getAttribute('aria-label')).toBe(`DashboardButtonLabel ${firstName} ${lastName} test`);
    }));

    it('returns correct user label with guid', fakeAsync(() => {
        const guid = '456';
        participantsSearchSpy.search.and
            .returnValue(of({results: [{...data[0], firstName: null, lastName: null, guid}], totalCount: 1}));
        component.searchField.patchValue('test');
        tick(300);
        fixture.detectChanges();

        const firstUserDashboardButton = fixture.debugElement.query(By.css('.dashboard-link')).nativeElement;
        expect(firstUserDashboardButton.getAttribute('aria-label')).toBe(`DashboardButtonLabel ${guid} test`);
    }));
});

describe('PrismComponent with storage', () => {
    let fixture: ComponentFixture<PrismComponent>;
    let component: PrismComponent;
    let debugElement: DebugElement;
    let storageServiceSpy: jasmine.SpyObj<SessionStorageService>;

    const studyGuid = 'TEST_ANGIO';
    const searchQuery = 'test query';
    const participants = [{
        guid: '1234',
        hruid: '5678',
        firstName: 'Bob',
        lastName: 'Adams',
        status: EnrollmentStatusType.COMPLETED,
        invitationId: 'TBM398WQ8P6Z',
        legacyShortId: '12',
        proxy: {
            guid: '1235',
            hruid: '5679',
            firstName: 'Tom',
            lastName: 'Adams',
            email: 'proxytest@test.com',
        }
    }];
    const count = 12;
    const pageSize = 25;
    const pageIndex = 2;

    beforeEach(async () => {
        const sessionServiceSpy = jasmine.createSpyObj('sessionServiceSpy', ['setParticipant']);
        storageServiceSpy = jasmine.createSpyObj('storageServiceSpy', { get: null, set: undefined });
        storageServiceSpy.get.withArgs(`${studyGuid}_prism_search_query`).and.returnValue(searchQuery);
        storageServiceSpy.get.withArgs(`${studyGuid}_prism_search_participants`).and.returnValue(JSON.stringify(participants));
        storageServiceSpy.get.withArgs(`${studyGuid}_prism_search_participants_count`).and.returnValue(String(count));
        storageServiceSpy.get.withArgs(`${studyGuid}_prism_search_pagination_size`).and.returnValue(String(pageSize));
        storageServiceSpy.get.withArgs(`${studyGuid}_prism_search_pagination_index`).and.returnValue(String(pageIndex));
        await TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                MatInputModule,
                ReactiveFormsModule,
                MatTableModule,
                MatIconModule,
                RouterTestingModule,
                MatPaginatorModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                }),
            ],
            providers: [
                { provide: ParticipantsSearchServiceAgent, useValue: {} },
                { provide: SessionStorageService , useValue: storageServiceSpy },
                { provide: SessionMementoService, useValue: sessionServiceSpy },
                { provide: 'ddp.config', useValue: { prismColumns: ['guid'], studyGuid } },
            ],
            declarations: [PrismComponent],
        })
            .compileComponents();

        const translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PrismComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should create component (PrismComponent with storage)', () => {
        expect(component).toBeTruthy();
    });

    it('sets initial data from storage', () => {
        expect(component.dataSource.data).toEqual(participants);
        expect(component.totalCount).toBe(count);
        expect(component.searchField.value).toBe(searchQuery);
        expect(component.initialPageIndex).toBe(pageIndex);
        expect(component.initialPageSize).toBe(pageSize);
    });
});
