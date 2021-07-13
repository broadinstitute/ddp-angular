import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';

import {
  SessionMementoService,
  UserProfile,
  UserProfileServiceAgent,
} from 'ddp-sdk';

@Injectable({
  providedIn: 'root',
})
export class ParticipantService implements OnDestroy {
  private destroyed = new Subject<void>();
  private currentParticipantGuid$ = new BehaviorSubject<string | null>(null);
  private prevParticipantGuid$ = new BehaviorSubject<string | null>(null);
  private currentParticipantProfile$ = new BehaviorSubject<UserProfile | null>(
    null,
  );
  private sessionSub = this.sessionService.sessionObservable
    .pipe(
      takeUntil(this.destroyed),
      filter(session => !!session),
      switchMap(session =>
        this.userProfileService.profile.pipe(
          map(({ profile }) => ({ session, profile })),
        ),
      ),
    )
    .subscribe(({ session, profile }) => {
      this.currentParticipantGuid$.next(session.participantGuid);
      this.currentParticipantProfile$.next(
        session.participantGuid ? profile : null,
      );
    });

  constructor(
    private sessionService: SessionMementoService,
    private userProfileService: UserProfileServiceAgent,
  ) {}

  ngOnDestroy(): void {
    this.destroyed.next();
  }

  get participantProfile$(): Observable<UserProfile | null> {
    return this.currentParticipantProfile$.asObservable();
  }

  get prevParticipantGuid(): string | null {
    return this.prevParticipantGuid$.getValue();
  }

  savePrevParticipantGuid(): void {
    this.prevParticipantGuid$.next(this.currentParticipantGuid$.getValue());
  }
}
