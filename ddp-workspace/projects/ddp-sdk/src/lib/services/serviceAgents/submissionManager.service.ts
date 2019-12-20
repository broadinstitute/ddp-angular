import { Injectable, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivityServiceAgent } from './activityServiceAgent.service';
import { AnswerValue } from '../../models/activity/answerValue';
import { AnswerSubmission } from '../../models/activity/answerSubmission';
import { PatchAnswerResponse } from '../../models/activity/patchAnswerResponse';
import { ActivityInstanceAnswerSubmission } from '../../models/activity/activityInstanceAnswerSubmission';
import { Observable, Subject, BehaviorSubject, timer } from 'rxjs';
import { concatMap, distinctUntilChanged, filter, map, merge, mergeMap, retryWhen, scan, share, take } from 'rxjs/operators';
import * as _ from 'underscore';

type GuidToShown = Record<string, boolean>;

@Injectable()
export class SubmissionManager implements OnDestroy {
    public static DEFAULT_RETRY_DELAY_MS = 5000;
    // Retry for 5 mins
    public static DEFAULT_MAX_RETRY_COUNT = 5 * 60 * 1000 / SubmissionManager.DEFAULT_RETRY_DELAY_MS;

    /**
     * Maintains a view of the pending answer submissions. Subscribe to obtain
     * list of submissions awaiting processing or being processed
     */
    public pendingAnswerSubmissionQueue$: Observable<ActivityInstanceAnswerSubmission[]>;
    /**
     * Indicate whether there is a submission going on
     */
    public isAnswerSubmissionInProgress$: Observable<boolean>;
    /**
     * Notifies on invalid submissions found in queue
     */
    public invalidAnswerSubmissions$: Observable<ActivityInstanceAnswerSubmission[]>;
    /**
     * Observable with the responses from the server
     */
    public get answerSubmissionResponse$(): Observable<PatchAnswerResponse> {
      return this._answerSubmissionResponse$;
    }
    /**
     * Observable with errors in submission process
     */
    public answerSubmissionFailure$: Observable<Error>;
    /**
     * Situation has arisen that user yshould
     */
    public answerSubmissionWarning$: Observable<boolean>;
    private answerSubmissionFailureSubject = new Subject<Error>();
    private answerSubmissionErrorSubject = new Subject<Error>();
    private answerSubmissions: Subject<ActivityInstanceAnswerSubmission> = new Subject();
    private blockGuidToVisibility$ = new BehaviorSubject<GuidToShown>({});
    private _answerSubmissionResponse$: Observable<PatchAnswerResponse>;
    retryDelayMs = SubmissionManager.DEFAULT_RETRY_DELAY_MS;
    maxRetryCount = SubmissionManager.DEFAULT_MAX_RETRY_COUNT;

    constructor(private serviceAgent: ActivityServiceAgent) {
        this.setupAnswerSubmissionPipeline();
        this.setupPendingSubmissionQueueManagement();
        this.setupSubmissionInProgress();
        this.setupInvalidSubmissions();
        this.setupAnswerSubmissionWarning();
    }

    public ngOnDestroy(): void {
        this.blockGuidToVisibility$.unsubscribe();
    }

    /**
     * Submit an answer to the server
     * param studyGuid
     * param activityInstanceGuid
     * param questionStableId
     * param value
     * param questionBlockGuid
     * param answerGuid
     */
    public patchAnswer(studyGuid: string, activityInstanceGuid: string, questionStableId: string, value: AnswerValue,
        questionBlockGuid: string, answerGuid: string | null = null): void {
        this.answerSubmissions.next({
            studyGuid, activityInstanceGuid, stableId: questionStableId,
            value, answerGuid, blockGuid: questionBlockGuid
        });
    }

    private setupAnswerSubmissionPipeline(): void {
        // Keep track of block visibility. We really just care about blockGuids that are false
        // but this is our ledger
        // Note that we use BehaviorSubject as we need an initial value to get pipeline going
        this.blockGuidToVisibility$ = new BehaviorSubject<GuidToShown>({});

        const filterOutHidden = (submission: ActivityInstanceAnswerSubmission): Observable<ActivityInstanceAnswerSubmission> =>
            this.blockGuidToVisibility$.pipe(
                // this take() is key. Otherwise this observable will be updated every time
                // the visibility observable has a new value. We just want nonHiddenSubmissions
                // to emit when a new submission comes in
                take(1),
                map(guidToShown => (guidToShown[submission.blockGuid] === false) ? null : submission),
                filter((submission1) => !!submission1),
                map((submission2) => submission2 as ActivityInstanceAnswerSubmission)
            );

        // wrapping the call to the serviceAgent that talks to server in a function that takes ActivityInstanceAnswerSubmission
        // This type more convenient to deal with when tracking submissions through our pipeline
        const executeAnswerSubmission = (patchSubmission: ActivityInstanceAnswerSubmission): Observable<PatchAnswerResponse> => {
            const answerSubmission: AnswerSubmission = {
                stableId: patchSubmission.stableId,
                answerGuid: patchSubmission.answerGuid,
                value: patchSubmission.value
            };
            const patchAnswerFunction = (submission: AnswerSubmission): Observable<PatchAnswerResponse> => {
                return this.serviceAgent.saveAnswerSubmission(patchSubmission.studyGuid, patchSubmission.activityInstanceGuid, submission,
                    true);
            };

            return patchAnswerFunction(answerSubmission);
        };

        // Send errors down this Observable. having problems catching errors!
        this.answerSubmissionFailure$ = this.answerSubmissionFailureSubject.asObservable();

        // Chunk that will actually send PATCH to server. includes the retry in case of failure
        const submitAnswerWithRetry: (submission: ActivityInstanceAnswerSubmission) => Observable<PatchAnswerResponse> =
            (submission) => {
                return executeAnswerSubmission(submission).pipe(
                    retryWhen((error: Observable<any>) => {
                        return error.pipe(
                            mergeMap((submissionError, i) => {
                                const errorCount = ++i;
                                // we will retry on HTTP errors that are not not the ones listed here
                                if (errorCount > this.maxRetryCount || !(submissionError instanceof HttpErrorResponse)
                                    || [404, 401, 422].includes(submissionError.status)) {
                                    // Would have prefered to throw error, and have subscriber handle it in the error handler
                                    // but could not get the error
                                    this.answerSubmissionFailureSubject.next(submissionError);
                                    throw submissionError;
                                } else {
                                    this.answerSubmissionErrorSubject.next(submissionError);
                                    return timer(this.retryDelayMs);
                                }
                            }));
                    }));
            };

        // this is the high-level pipeline that takes incoming answers, send them to server, and returns the PATCH responses
        // concatMap is really important here. One submission at a time and next one will not be submitted until previous
        // one completes
        // important that filterOutHidden inside same concatMap as submitAnswerRetry, otherwise there is no real queue
        // of waiting submissions to examine
        this._answerSubmissionResponse$ = this.answerSubmissions.pipe(
            concatMap(x => filterOutHidden(x).pipe(concatMap(submitAnswerWithRetry))), share());

        // visibility subject updated here: extract the visibility info in the PATCH responses
        // and update the our Observable map
        this.answerSubmissionResponse$.pipe(
            scan((acc: GuidToShown, response: PatchAnswerResponse) => {
                const newAcc = _.clone(acc);
                response.blockVisibility.forEach(visibility => newAcc[visibility.blockGuid] = visibility.shown);
                return newAcc;
            }, {})
        ).subscribe(this.blockGuidToVisibility$);
    }

    private setupPendingSubmissionQueueManagement(): void {
        // we are interested in keeping an observable on the state of queued requests
        const pendingAnswerSubmissionSubject = new BehaviorSubject([] as ActivityInstanceAnswerSubmission[]);

        // will define a few operations to update our view of the queue. Here are the types we will use
        type QueueOp = (queue: ActivityInstanceAnswerSubmission[]) => ActivityInstanceAnswerSubmission[];
        type QueueOpObservable = Observable<QueueOp>;

        // submissions come into manager: append to the queue array
        const submissionQueueAdditions$: QueueOpObservable = this.answerSubmissions.pipe(
            map(newSubmission => (queue: ActivityInstanceAnswerSubmission[]) => {
                queue.push(newSubmission);
                return queue;
            }));

        // submissions are completed: remove from the end of the queue array
        // can do this as we enforce order. The last one in the queue is the completed one
        const submissionQueueRemovalsOnCompletion$: QueueOpObservable = this.answerSubmissionResponse$.pipe(
            map(() => (queue: ActivityInstanceAnswerSubmission[]) => {
                queue.shift();
                return queue;
            }));

        // submissions are rejected because response says that they should be hidden. Find them in queue array and remove them
        const submissionRemovalOnHideResponse$: QueueOpObservable = this.answerSubmissionResponse$.pipe(
            filter(response => response.blockVisibility.length > 0),
            map(response => (queue: ActivityInstanceAnswerSubmission[]) => {
                const blockGuidsHide: string[] = response.blockVisibility.filter(
                    update => update.shown === false).map(update => update.blockGuid);
                return queue.filter((item) => {
                    return !blockGuidsHide.includes(item.blockGuid);
                });
            }));

        // merge additions, completions, and removal of submissions to create an observable state of the queue
        const workingSubmissionQueue: Observable<ActivityInstanceAnswerSubmission[]> = submissionQueueAdditions$.pipe(
            merge(submissionQueueRemovalsOnCompletion$),
            merge(submissionRemovalOnHideResponse$),
            scan((acc: ActivityInstanceAnswerSubmission[], currentOperation: QueueOp) => {
                return currentOperation(acc.slice(0));
            }, [] as ActivityInstanceAnswerSubmission[])
        );

        // finally we update queue subject by having it having it subscribe
        workingSubmissionQueue.subscribe(pendingAnswerSubmissionSubject);

        this.pendingAnswerSubmissionQueue$ = pendingAnswerSubmissionSubject.asObservable();
    }

    private setupSubmissionInProgress(): void {
        // if there is something in the queue, there is a submission in progress (queue includes the submission 'in flight')
        this.isAnswerSubmissionInProgress$ = this.pendingAnswerSubmissionQueue$.pipe(map(queue => queue.length > 0), share());
    }

    private setupInvalidSubmissions(): void {
        // examine the pending queue and compare it with our visibility map
        // invalid if the item in queue is supposed to be hidden
        this.invalidAnswerSubmissions$ = this.pendingAnswerSubmissionQueue$.pipe(
            mergeMap(queue => this.blockGuidToVisibility$.pipe(
                take(1),
                map((shownMap: GuidToShown) => queue.filter(submission => shownMap[submission.blockGuid] === false)),
                filter(x => x.length > 0)
            ))
            // don't bother subscribers unless we have found a different submission
        ).pipe(
            distinctUntilChanged((a, b) => {
                return _.isEqual(a, b);
            }));
    }

    private setupAnswerSubmissionWarning(): void {
        this.answerSubmissionWarning$ = this.answerSubmissionErrorSubject.pipe(map(() => true));
    }

}
