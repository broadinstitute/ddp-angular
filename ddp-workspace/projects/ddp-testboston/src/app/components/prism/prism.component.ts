import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CompositeDisposable, SubjectInvitationServiceAgent, DdpError, ErrorType, StudySubject, SessionMementoService } from 'ddp-sdk';
import { Subject } from 'rxjs';
import { filter, tap, map, debounceTime, concatMap, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AppRoutes } from '../../app-routes';
import { PrismForm } from '../../models/prismForm.model';

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
  private notes = new Subject<string>();
  private anchor = new CompositeDisposable();

  constructor(
    private sessionService: SessionMementoService,
    private subjectInvitation: SubjectInvitationServiceAgent) { }

  public ngOnInit(): void {
    this.initPrismForm();
    this.initSearchListener();
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  public clearField(field: string): void {
    this.prismForm.controls[field].reset();
    if (field === 'invitationId') {
      this.resetForm();
    }
  }

  public showClearButton(field: string): boolean {
    return !!this.prismForm.controls[field].value;
  }

  public hasError(errorType: ErrorType): boolean {
    return this.error && this.error.errorType === errorType;
  }

  public setSelectedSubject(): void {
    this.sessionService.setParticipant(this.studySubject.userGuid);
  }

  public saveNotes(notes: string): void {
    this.notes.next(notes);
  }

  public enrollSubject(): void {
    // TBD
    alert(`We are sorry, but the CRC Dashboard doesn't support enrollment yet.`);
  }

  private initPrismForm(): void {
    this.prismForm = new FormGroup({
      invitationId: new FormControl(null)
    });
  }

  private addFields(studySubject: StudySubject): void {
    if (studySubject.userGuid) {
      this.addNotesField();
    } else {
      this.addZipField();
      this.addNotesField();
    }
  }

  private addZipField(): void {
    this.prismForm.addControl('zip', new FormControl(null));
    this.initZipListener();
  }

  private addNotesField(): void {
    this.prismForm.addControl('notes', new FormControl(this.studySubject.notes));
    this.initNotesListener();
  }

  private resetForm(): void {
    if (this.prismForm.controls.zip) {
      this.prismForm.removeControl('zip');
      this.zipVerified = false;
      this.isZipLoading = false;
    }
    if (this.prismForm.controls.notes) {
      this.prismForm.removeControl('notes');
    }
  }

  private initSearchListener(): void {
    const search = this.prismForm.valueChanges.pipe(
      map((form: PrismForm) => form.invitationId),
      distinctUntilChanged(),
      tap(() => {
        this.error = null;
        this.studySubject = null;
        this.isInvitationLoading = false;
        this.resetForm();
      }),
      filter(invitationId => this.prismForm.controls.invitationId.valid && !!invitationId),
      tap(() => this.isInvitationLoading = true),
      switchMap(invitationId => this.subjectInvitation.lookupInvitation(invitationId)),
      tap(() => this.isInvitationLoading = false)
    ).subscribe(response => {
      if (response && (response.invitationId === this.prismForm.controls.invitationId.value)) {
        this.studySubject = response;
        this.addFields(response);
      } else if (response === null && this.prismForm.controls.invitationId.valid) {
        this.error = new DdpError('', ErrorType.InvitationNotFound);
        this.resetForm();
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

  private initZipListener(): void {
    const zip = this.prismForm.valueChanges.pipe(
      map((form: PrismForm) => form.zip),
      distinctUntilChanged(),
      tap(() => {
        this.error = null;
        this.isZipLoading = false;
        this.zipVerified = false;
      }),
      filter(zip => this.prismForm.controls.zip.valid && !!zip),
      tap(() => this.isZipLoading = true),
      switchMap(zip => this.subjectInvitation.checkZipCode(this.studySubject.invitationId, zip)),
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
