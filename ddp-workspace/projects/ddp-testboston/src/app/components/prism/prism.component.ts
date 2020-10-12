import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  CompositeDisposable,
  SubjectInvitationServiceAgent,
  DdpError,
  ErrorType,
  StudySubject,
  SessionMementoService,
  LanguageService
} from 'ddp-sdk';
import { filter, tap, debounceTime, concatMap, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AppRoutes } from '../../app-routes';

@Component({
  selector: 'app-prism',
  templateUrl: './prism.component.html',
  styleUrls: ['./prism.component.scss']
})
export class PrismComponent implements OnInit, OnDestroy {
  public prismForm: FormGroup;
  public error: DdpError | null = null;
  public errorType = ErrorType;
  public studySubject: StudySubject | null = null;
  public appRoutes = AppRoutes;
  public isInvitationLoading = false;
  public isZipLoading = false;
  public zipVerified = false;
  private anchor = new CompositeDisposable();

  constructor(
    private languageService: LanguageService,
    private sessionService: SessionMementoService,
    private subjectInvitation: SubjectInvitationServiceAgent) { }

  public ngOnInit(): void {
    this.initPrismForm();
    this.initSearchListener();
    this.initZipListener();
    this.initNotesListener();
    this.setInvitationIdInitialValue();
    this.languageService.changeLanguage('en');
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  public clearField(field: string): void {
    this.prismForm.controls[field].reset();
  }

  public showClearButton(field: string): boolean {
    return !!this.prismForm.controls[field].value;
  }

  public hasError(errorType: ErrorType): boolean {
    return this.error && this.error.errorType === errorType;
  }

  public setSubject(invitationId: string | null = null, userGuid: string | null = null): void {
    this.sessionService.setInvitationId(invitationId);
    this.sessionService.setParticipant(userGuid);
  }

  private initPrismForm(): void {
    this.prismForm = new FormGroup({
      invitationId: new FormControl(null),
      zip: new FormControl(null),
      notes: new FormControl(null)
    });
  }

  private setNotesInitialValue(notes: string): void {
    this.prismForm.controls.notes.patchValue(notes);
  }

  private setInvitationIdInitialValue(): void {
    const invitationId = this.sessionService.session.invitationId;
    if (invitationId) {
      this.prismForm.controls.invitationId.patchValue(invitationId);
    }
  }

  private resetAdditionalFields(): void {
    this.prismForm.controls.zip.reset();
    this.prismForm.controls.notes.reset();
    this.zipVerified = false;
    this.isZipLoading = false;
  }

  private initSearchListener(): void {
    const search = this.prismForm.controls.invitationId.valueChanges.pipe(
      distinctUntilChanged(),
      tap(() => {
        this.error = null;
        this.studySubject = null;
        this.isInvitationLoading = false;
        this.resetAdditionalFields();
        this.setSubject();
      }),
      filter(invitationId => this.prismForm.controls.invitationId.valid && !!invitationId),
      tap(() => this.isInvitationLoading = true),
      switchMap(invitationId => this.subjectInvitation.lookupInvitation(invitationId)),
      tap(() => this.isInvitationLoading = false)
    ).subscribe(response => {
      if (response && this.prismForm.controls.invitationId.valid) {
        this.studySubject = response;
        this.setNotesInitialValue(response.notes);
        this.setSubject(response.invitationId, response.userGuid);
      } else if (response === null && this.prismForm.controls.invitationId.valid) {
        this.error = new DdpError('', ErrorType.InvitationNotFound);
      }
    });
    this.anchor.addNew(search);
  }

  private initNotesListener(): void {
    const note = this.prismForm.controls.notes.valueChanges.pipe(
      filter((notes) => this.studySubject !== null && this.studySubject.notes !== notes),
      debounceTime(200),
      distinctUntilChanged(),
      concatMap(notes => this.subjectInvitation.updateInvitationDetails(this.studySubject.invitationId, notes))
    ).subscribe(response => {
      this.error = response ? null : new DdpError('', ErrorType.NotesError);
    });
    this.anchor.addNew(note);
  }

  private initZipListener(): void {
    const zip = this.prismForm.controls.zip.valueChanges.pipe(
      filter(() => this.studySubject !== null && !this.studySubject.userGuid),
      distinctUntilChanged(),
      tap(() => {
        this.error = null;
        this.isZipLoading = false;
        this.zipVerified = false;
      }),
      filter(zip => this.prismForm.controls.zip.valid && !!zip),
      tap(() => this.isZipLoading = true),
      switchMap(zip => this.subjectInvitation.verifyZipCode(this.studySubject.invitationId, zip)),
      tap(() => this.isZipLoading = false)
    ).subscribe(response => {
      if (response && this.prismForm.controls.invitationId.valid) {
        this.zipVerified = true;
      } else if (response === null && this.prismForm.controls.invitationId.valid) {
        this.error = new DdpError('', ErrorType.InvalidZip);
      }
    });
    this.anchor.addNew(zip);
  }
}
