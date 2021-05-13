import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap, map, takeUntil } from 'rxjs/operators';
import { SearchParticipant } from '../../models/searchParticipant';
import { ParticipantsSearchServiceAgent } from '../../services/serviceAgents/participantsSearchServiceAgent.service';
import { SessionMementoService } from '../../services/sessionMemento.service';
import { enrollmentStatusTypeToLabel } from '../../models/enrollmentStatusType';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, of } from 'rxjs';

const BASE_COLUMNS = ['guid', 'shortId', 'userName', 'email', 'enrollmentStatus', 'dashboardLink'];
const INVITATION_COLUMNS = ['invitationId'];
const PROXY_COLUMNS = ['proxyGuid', 'proxyShortId', 'proxyUserName'];
const LEGACY_COLUMNS = ['legacyAltPid', 'legacyShortId'];

@Component({
  selector: 'ddp-prism',
  templateUrl: './prism.component.html',
  styleUrls: ['./prism.component.scss'],
})
export class PrismComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() dashboardRoute: string;
  @Input() withProxy = false;
  @Input() withInvitationId = false;
  @Input() withLegacyId = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public searchField = new FormControl();
  public displayedColumns = BASE_COLUMNS;
  public dataSource = new MatTableDataSource<SearchParticipant>([]);
  public totalCount = 0;
  public isSearchLoading = false;
  public isSearchDebounce = false;
  public MIN_SEARCH_LENGTH = 4;
  private ngUnsubscribe = new Subject();
  public readonly enrollmentStatusTypeToLabel = enrollmentStatusTypeToLabel;

  constructor(
    private sessionService: SessionMementoService,
    private participantsSearch: ParticipantsSearchServiceAgent,
    private router: Router) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['withProxy'] || changes['withInvitationId'] || changes['withLegacyId']) {
      this.displayedColumns = [
          ...BASE_COLUMNS,
          ...(changes['withInvitationId']?.currentValue ? INVITATION_COLUMNS : []),
          ...(changes['withProxy']?.currentValue ? PROXY_COLUMNS : []),
          ...(changes['withLegacyId']?.currentValue ? LEGACY_COLUMNS : []),
      ];
    }
  }

  public ngOnInit(): void {
    this.setSubject();
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

  private setSubject(user?: SearchParticipant): void {
    this.sessionService.setInvitationId(user?.invitationId);
    this.sessionService.setParticipant(user?.guid);
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
    });
  }

  public clickOnUser(user: SearchParticipant): void {
    this.setSubject(user);
    this.router.navigateByUrl(`/${this.dashboardRoute}`);
  }

  public getUserLabel(user: SearchParticipant): string {
    return user.firstName || user.lastName ? `${user.firstName} ${user.lastName}` : user.guid;
  }
}
