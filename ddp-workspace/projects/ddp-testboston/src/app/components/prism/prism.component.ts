import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CompositeDisposable, SubjectInvitationServiceAgent, DdpError, ErrorType, StudySubject, SessionMementoService } from 'ddp-sdk';
import { Subject } from 'rxjs';
import { filter, tap, map, debounceTime, concatMap, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AppRoutes } from '../../app-routes';

@Component({
  selector: 'app-prism',
  templateUrl: './prism.component.html',
  styleUrls: ['./prism.component.scss']
})
export class PrismComponent implements OnInit, OnDestroy {
  public searchForm: FormGroup;
  public error: DdpError | null = null;
  public errorType = ErrorType;
  public studySubject: StudySubject | null = null;
  public appRoutes = AppRoutes;
  public isLoading = false;
  private notes = new Subject<string>();
  private anchor = new CompositeDisposable();

  constructor(
    private sessionService: SessionMementoService,
    private subjectInvitation: SubjectInvitationServiceAgent) { }

  public ngOnInit(): void {
    this.initForm();
    this.initSearchListener();
    this.initNotesListener();
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  public clearSearchField(): void {
    this.searchForm.reset();
  }

  public get showSearchButton(): boolean {
    return !!this.searchForm.controls.invitationId.value;
  }

  public hasError(errorType: ErrorType): boolean {
    return this.error && this.error.errorType === errorType;
  }

  public isInvitationValid(): boolean {
    return this.searchForm.valid && !!this.searchForm.controls.invitationId.value;
  }

  public areInvitationsEqual(invitationId: string): boolean {
    return invitationId === this.searchForm.controls.invitationId.value;
  }

  public setSelectedSubject(): void {
    this.sessionService.setParticipant(this.studySubject.userGuid);
  }

  public saveNotes(notes: string): void {
    this.notes.next(notes);
  }

  public enrollSubject(): void {
    // TBD
    alert("We are sorry, but the CRC Dashboard doesn't support enrollment yet.");
  }

  private initForm(): void {
    this.searchForm = new FormGroup({
      invitationId: new FormControl(null)
    });
  }

  private initSearchListener(): void {
    const search = this.searchForm.valueChanges.pipe(
      map((form: SearchForm) => form.invitationId),
      distinctUntilChanged(),
      tap(() => {
        this.error = null;
        this.studySubject = null;
        this.isLoading = false;
      }),
      filter(invitationId => this.searchForm.valid && !!invitationId),
      tap(() => this.isLoading = true),
      switchMap(invitationId => this.subjectInvitation.lookupInvitation(invitationId)),
      tap(() => this.isLoading = false)
    ).subscribe(response => {
      if (response && this.areInvitationsEqual(response.invitationId)) {
        this.studySubject = response;
      } else if (response === null && this.isInvitationValid()) {
        this.error = new DdpError('', ErrorType.InvitationNotFound);
      }
    });
    this.anchor.addNew(search);
  }

  private initNotesListener(): void {
    const note = this.notes.asObservable().pipe(
      debounceTime(200),
      distinctUntilChanged(),
      concatMap(notes => this.subjectInvitation.updateInvitationDetails(this.studySubject.invitationId, notes))
    ).subscribe(response => {
      this.error = response ? null : new DdpError('', ErrorType.NotesError);
    });
    this.anchor.addNew(note);
  }
}

interface SearchForm {
  invitationId: string;
}
