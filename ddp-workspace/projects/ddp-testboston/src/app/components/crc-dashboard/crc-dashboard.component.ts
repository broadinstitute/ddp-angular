import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CompositeDisposable, SubjectInvitationServiceAgent, DdpError, ErrorType, StudySubject, SessionMementoService } from 'ddp-sdk';
import { filter, tap, mergeMap, map, delay, debounceTime, finalize } from 'rxjs/operators';
import { AppRoutes } from '../../app-routes';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-crc-dashboard',
  templateUrl: './crc-dashboard.component.html',
  styleUrls: ['./crc-dashboard.component.scss']
})
export class CrcDashboardComponent implements OnInit, OnDestroy {
  public searchForm: FormGroup;
  public error: DdpError | null = null;
  public errorType = ErrorType;
  public subject: StudySubject | null = null;
  public appRoutes = AppRoutes;
  public isLoading = false;
  private notesSubject: Subject<string> = new Subject<string>();
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
    this.subject = null;
  }

  public get showSearchButton(): boolean {
    return !!this.searchForm.controls.invitationId.value;
  }

  public hasError(errorType: ErrorType): boolean {
    return this.error && this.error.errorType === errorType;
  }

  public setSelectedSubject(): void {
    this.sessionService.setParticipant(this.subject.userGuid);
  }

  public saveNotes(notes: string): void {
    this.notesSubject.next(notes);
  }

  public enrollSubject(): void {
    // TBD
  }

  private initForm(): void {
    this.searchForm = new FormGroup({
      invitationId: new FormControl(null)
    });
  }

  private initSearchListener(): void {
    const form = this.searchForm.valueChanges.pipe(
      tap(() => {
        this.error = null;
        this.subject = null;
      }),
      filter(form => this.searchForm.valid && !!form.invitationId),
      tap(() => this.isLoading = true),
      map(form => form.invitationId),
      // todo: remove delay
      delay(3000),
      mergeMap(invitationId => this.subjectInvitation.lookupInvitation(invitationId)),
      tap(() => this.isLoading = false),
      finalize(() => this.isLoading = false)
    ).subscribe(
      (subject) => this.subject = subject,
      (error) => this.error = error
    );
    this.anchor.addNew(form);
  }

  private initNotesListener(): void {
    const notes = this.notesSubject.asObservable().pipe(
      debounceTime(1000),
      mergeMap((notes) => this.subjectInvitation.updateInvitationDetails(this.subject.invitationId, notes))
    ).subscribe(
      (response) => {
        this.error = response ? null : new DdpError('', ErrorType.NotesError);
      }
    );
    this.anchor.addNew(notes);
  }
}
