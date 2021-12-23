import { AfterViewInit, Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap, map, takeUntil } from 'rxjs/operators';
import { SearchParticipant } from '../../models/searchParticipant';
import { ParticipantsSearchServiceAgent } from '../../services/serviceAgents/participantsSearchServiceAgent.service';
import { ConfigurationService } from '../../services/configuration.service';
import { SessionMementoService } from '../../services/sessionMemento.service';
import { enrollmentStatusTypeToLabel } from '../../models/enrollmentStatusType';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, of } from 'rxjs';
import { SessionStorageService } from '../../services/sessionStorage.service';
import { StickyScrollDirective } from '../../directives/sticky-scroll.directive';

@Component({
    selector: 'ddp-prism',
    templateUrl: './prism.component.html',
    styleUrls: ['./prism.component.scss'],
})
export class PrismComponent implements OnDestroy, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(StickyScrollDirective, { static: true }) stickyScroll: StickyScrollDirective;

    public searchField = new FormControl();
    public displayedColumns: string[] = [];
    public dataSource = new MatTableDataSource<SearchParticipant>([]);
    public totalCount = 0;
    public isSearchLoading = false;
    public isSearchDebounce = false;
    public MIN_SEARCH_LENGTH = 4;
    private ngUnsubscribe = new Subject<void>();
    public readonly enrollmentStatusTypeToLabel = enrollmentStatusTypeToLabel;
    public readonly initialPageIndex: number;
    public readonly initialPageSize: number;
    private readonly searchParticipantsStorageName: string;
    private readonly searchCountStorageName: string;
    private readonly searchQueryStorageName: string;
    private readonly paginationSizeStorageName: string;
    private readonly paginationIndexStorageName: string;
    readonly paginationSizes = [10, 25, 100];

    constructor(
        private participantsSearch: ParticipantsSearchServiceAgent,
        private router: Router,
        private storageService: SessionStorageService,
        private sessionService: SessionMementoService,
        @Inject('ddp.config') private config: ConfigurationService,
    ) {
        this.displayedColumns = this.config.prismColumns;
        this.searchParticipantsStorageName = `${this.config.studyGuid}_prism_search_participants`;
        this.searchCountStorageName = `${this.config.studyGuid}_prism_search_participants_count`;
        this.searchQueryStorageName = `${this.config.studyGuid}_prism_search_query`;
        this.paginationSizeStorageName = `${this.config.studyGuid}_prism_search_pagination_size`;
        this.paginationIndexStorageName = `${this.config.studyGuid}_prism_search_pagination_index`;

        this.initialPageIndex = Number(this.storageService.get(this.paginationIndexStorageName)) || 1;
        this.initialPageSize = Number(this.storageService.get(this.paginationSizeStorageName)) || this.paginationSizes[0];
        const savedSearchQuery = this.storageService.get(this.searchQueryStorageName);
        const savedSearchCount = this.storageService.get(this.searchCountStorageName);
        const savedSearchParticipants = JSON.parse(this.storageService.get(this.searchParticipantsStorageName));
        if (savedSearchQuery) {
            this.searchField.patchValue(savedSearchQuery);
        }
        if (savedSearchParticipants) {
            this.dataSource.data = savedSearchParticipants;
        }
        if (savedSearchCount) {
            this.totalCount = Number(savedSearchCount);
        }

        this.sessionService.setParticipant();
        this.initSearchListener();
    }

    public ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (item: SearchParticipant, property: string) => {
            switch (property) {
                case 'userName': return item.firstName || item.lastName ? `${item.firstName } ${ item.lastName }` : '';
                case 'proxyUserName': return item.proxy?.firstName || item.proxy?.lastName ? `${item.proxy.firstName } ${ item.proxy.lastName }` : '';
                case 'legacyShortId': return Number(item.legacyShortId);
                default: return item[property];
            }
        };
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public clearSearch(): void {
        this.searchField.reset('');
    }

    public hasValidUserSearchQuery(): boolean {
        const value = this.searchField.value?.trim();
        return value && value.length >= this.MIN_SEARCH_LENGTH;
    }

    private initSearchListener(): void {
        this.searchField.valueChanges.pipe(
            map(query => query.trim()),
            distinctUntilChanged(),
            tap(() => { this.isSearchDebounce = true; }),
            debounceTime(300),
            tap(() => {
                this.isSearchLoading = true;
                this.isSearchDebounce = false;
            }),
            switchMap((query) => {
                if (query.length >= this.MIN_SEARCH_LENGTH) {
                    return this.participantsSearch.search(query);
                } else {
                    return of({ results: [], totalCount: 0 });
                }
            }),
            tap(() => { this.isSearchLoading = false; }),
            takeUntil(this.ngUnsubscribe),
        ).subscribe(response => {
            this.dataSource.data = response?.results || [];
            this.totalCount = response?.totalCount || 0;

            this.stickyScroll.refresh();

            this.storageService.set(this.searchParticipantsStorageName, JSON.stringify(this.dataSource.data));
            this.storageService.set(this.searchCountStorageName, String(this.totalCount));
            this.storageService.set(this.searchQueryStorageName, this.searchField.value);
        });
    }

    public getUserLabel(user: SearchParticipant): string {
        return user.firstName || user.lastName ? `${user.firstName} ${user.lastName}` : user.guid;
    }

    public updatePageDataInStorage($event: PageEvent): void {
        this.storageService.set(this.paginationSizeStorageName, String($event.pageSize));
        this.storageService.set(this.paginationIndexStorageName, String($event.pageIndex));
    }

    public syncPaginators(event: PageEvent): void {
        this.paginator.pageIndex = event.pageIndex;
        this.paginator.pageSize = event.pageSize;
        this.paginator.page.emit(event);
    }

    get isPaginationHidden(): boolean {
        return this.isSearchLoading || this.dataSource.data.length <= this.paginationSizes[0];
    }

    public clickOnUser(user: SearchParticipant): void {
        this.sessionService.setParticipant(user.guid);
        this.router.navigateByUrl(`/${this.config.prismDashboardRoute}`);
    }
}
