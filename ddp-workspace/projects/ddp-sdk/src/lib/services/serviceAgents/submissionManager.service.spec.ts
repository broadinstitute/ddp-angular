import { ActivityServiceAgent } from './activityServiceAgent.service';
import { Observable, of, from, interval, timer, throwError } from 'rxjs';
import { delayWhen, take, tap } from 'rxjs/operators';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { SubmissionManager } from './submissionManager.service';
import { AnswerSubmission } from '../../models/activity/answerSubmission';
import { PatchAnswerResponse } from '../../models/activity/patchAnswerResponse';
import { BlockVisibility } from '../../models/activity/blockVisibility';

describe('SubmissionManagerTest', () => {
    let submissionManager: SubmissionManager;
    // const source: Observable<number>;
    let serviceAgent: jasmine.SpyObj< ActivityServiceAgent>;

    beforeAll(() => {

    });

    afterAll(() => {
        console.log('bye bye!!');

    });
    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        console.log('The jasmine default timeout is:' + jasmine.DEFAULT_TIMEOUT_INTERVAL);

        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [ActivityServiceAgent]
        });
        serviceAgent  = jasmine.createSpyObj('ActivityServiceAgent', ['saveAnswerSubmission']);

        submissionManager = new SubmissionManager(serviceAgent);
    });
    afterEach(() => {

    });

    it('test submission manager mock', (done) => {
        expect(submissionManager).not.toBeNull();
        serviceAgent.saveAnswerSubmission.and.callFake((studyGuid: string, activityGuid: string, answerSubmission: AnswerSubmission,
                                                        throwAnError: boolean): Observable<PatchAnswerResponse> => {

            return of({ answers: [], blockVisibility: [] }).pipe(delayWhen(x => timer(2000)));
        });
        const start = new Date().getTime();
        serviceAgent.saveAnswerSubmission('hey', 'ho', { stableId: 'blah', answer: 'boo' }, true).subscribe(x => {
            console.log('Yipee ay yea');
            console.log('The milliseconds gone by are:' + (new Date().getTime() - start));
            expect(x['answers']).not.toBeNull();
            done();
        });

    });
    it('test patch calls serialized observable', (done) => {
        // Let's do 5 calls that if were done is parallel instead of serialized, would finish in a different order than that of submission
        const httpCallDelays = [40, 50, 10, 30, 20];

        // let's be sneaky and pass the http delay and requestIdx as arguments
        serviceAgent.saveAnswerSubmission.and.callFake((delayAsString: string, requestIdxAsString: string,
                                                        answerSubmission: AnswerSubmission): Observable<PatchAnswerResponse> => {
            console.log('I am calling fakey fake with delay ' + delayAsString + ' and requestId ' + requestIdxAsString);
            return of({
                answers: [{stableId: requestIdxAsString, answerGuid: 'blah'}],
                blockVisibility: []
            }).pipe(tap((x) => console.log('Creating ' + x.answers[0].stableId)), delayWhen(x => timer(parseInt(delayAsString, 10))));
        });

        let previousCompletedRequestIdx = -1;
        const startTime: number = new Date().getTime();
        httpCallDelays.forEach((delay, requestIdx) => {
            setTimeout(() => {
                    submissionManager.patchAnswer(httpCallDelays[requestIdx] + '', requestIdx + '',
                                                  'y', 'dummyValue', 'blockGuid');
                },
                       requestIdx * 10);
        });
        setTimeout(() => {
               done();
        },         6000);
        const subscription = submissionManager.answerSubmissionResponse$
            .subscribe(patchResponse => {
                expect(patchResponse).not.toBeNull();
                // remember: we stored the requestIdx in the response like so
                const submittedRequestIdx = parseInt(patchResponse.answers[0].stableId, 10);
                console.log('The completed request idx is:' + submittedRequestIdx + ' at ' + (new Date().getTime() - startTime));
                expect(submittedRequestIdx).toBeGreaterThan(previousCompletedRequestIdx);
                previousCompletedRequestIdx = submittedRequestIdx;
                if (previousCompletedRequestIdx === httpCallDelays.length - 1) {
                    console.log('All she wrote');
                }
            });

    });

    it('test isSubmissionInProgress$ observable', (done) => {
        // Fake the call to service agent, including the response delay
        const httpCallDelay = 500;
        serviceAgent.saveAnswerSubmission.and.callFake((studyGuid: string, activityGuid: string, answerSubmission: AnswerSubmission,
                                                        throwAnError: boolean): Observable<PatchAnswerResponse> => {
            return of({
                answers: [],
                blockVisibility: []
            }).pipe(delayWhen(x => timer(httpCallDelay)));
        });

        interface ValueAndDelay {
            value: boolean;
            delay: number;
        }

        // Let's capture the values pushed out by isSubmissionInProgress, including the timing, for later examination;
        const returnedInProgressValues: ValueAndDelay[] = [];

        // Let's set the start Time
        const startTime: number = new Date().getTime();

        // this is what we are actually testing: the subscription to isSubmissioninProgress$
        submissionManager.isAnswerSubmissionInProgress$.subscribe(isInProgress => {
            returnedInProgressValues.push({value: isInProgress, delay: (new Date().getTime() - startTime)});
        });

        submissionManager.pendingAnswerSubmissionQueue$.subscribe(queue => {
            console.log('The queue now has: ' + queue.length);
        });

        // expect right off the without any submissions, we should get an initial value
        expect(returnedInProgressValues[0]).not.toBeNull();
        expect(returnedInProgressValues[0].value).toBe(false);
        expect(returnedInProgressValues[0].delay).toBeLessThan(httpCallDelay);

        submissionManager.answerSubmissionResponse$.subscribe((response: PatchAnswerResponse) => console.log('Got a response'));

        // Let's do a dummy patch. Remember to subscribe!
        submissionManager.patchAnswer('1', '2', '3', 'hello', 'blockGuid');

        // Give the patch time to complete and let's observe what happened
        setTimeout(() => {
            console.log('About to check stuff');
            expect(serviceAgent.saveAnswerSubmission.calls.count()).toBe(1);
            // initial value + our patch + our patch completed = 3 changes to status
            expect(returnedInProgressValues.length).toBe(3);
            expect(returnedInProgressValues[1].value).toBe(true);
            expect(returnedInProgressValues[1].delay).toBeLessThan(httpCallDelay);
            expect(returnedInProgressValues[2].value).toBe(false);
            // the last status change should occur after the http call completed
            expect(returnedInProgressValues[2].delay).toBeGreaterThan(httpCallDelay);
            console.log('Checks completed!');
            done();
        },         2000);

    });

    it('test answer queued submissions', (done) => {
        serviceAgent.saveAnswerSubmission.and.callFake((studyGuid: string, requestIdxAsString: string,
                                                        answerSubmission: AnswerSubmission): Observable<PatchAnswerResponse> => {
            return of({
                answers: [{stableId: requestIdxAsString, answerGuid: 'blah'}],
                blockVisibility: []
            }).pipe(tap((x) => console.log('Creating ' + x.answers[0].stableId)), delayWhen(x => timer(200)));
        });

        const startTime: number = new Date().getTime();

        const pendingSubmissionsOverTime: Array<{time: number; queue: AnswerSubmission[]}> = [];

        // capture the changes to the queue over time
        submissionManager.pendingAnswerSubmissionQueue$.subscribe((pendingSubmissions: AnswerSubmission[]) => {
            console.log('I got ' + pendingSubmissions.length + 'from the subcriptions!!!');
            pendingSubmissionsOverTime.push({time: new Date().getTime() - startTime, queue: pendingSubmissions });
        });
        // this is needed to get things going
        submissionManager.answerSubmissionResponse$.subscribe(x => console.log('Got response for: ' + x.answers[0].stableId));

        let requestId = 0;
        // space out the PATCH request submissions some some end up having to wait
        const requestCreationTimes$: Observable<number> = from([20, 50, 100, 250]);

        requestCreationTimes$.pipe(
            delayWhen(start => timer(start)),
            tap(() => submissionManager.patchAnswer('x', requestId++ + '', 'z', 'boo', 'blockGuid')))
            .subscribe(x => console.log('There goes request ' + x + ' at ' + (new Date().getTime() - startTime)));

        // wait some time and check what happened.
        setTimeout(
            () => {
                expect(pendingSubmissionsOverTime.length).toBeGreaterThan(0);
                // should start empty
                expect(pendingSubmissionsOverTime[0].queue.length).toBe(0);
                // then the first request goes into queue
                expect(pendingSubmissionsOverTime[1].queue.length).toBe(1);
                expect(pendingSubmissionsOverTime[2].queue.length).toBe(2);
                expect(pendingSubmissionsOverTime[3].queue.length).toBe(3);
                // should have completed the first one, but the last request PATCH has not been yet submitted
                expect(pendingSubmissionsOverTime[4].queue.length).toBe(2);
                // end up empty again
                expect(pendingSubmissionsOverTime[pendingSubmissionsOverTime.length - 1].queue.length).toBe(0);
                done();
            },
            2000);
    });

    it('test retry and succeed requests', (done) => {
        const activityGuidThatWillThrow = '1';
        const numberOfErrorsToGenerate = 2;
        let countOfExecutionAttempts = 0;

        // Fake out the service agent call. Go boom if it meets our requirements for a specific number of retries
        serviceAgent.saveAnswerSubmission.and.callFake((studyGuid: string, activityGuid: string, answerSubmission: AnswerSubmission,
                                                        throwAnError: boolean): Observable<PatchAnswerResponse> => {
            let errorCount = 0;

            return of({
                answers: [],
                blockVisibility: []
            }).pipe(delayWhen(x => {
                ++countOfExecutionAttempts;
                console.log(`I am entering delay in my task with activityGuid ${activityGuid}`);
                console.log('I have had this many errors: ' + errorCount);

                // this is where we generate the throwError for our test case
                if (activityGuid === activityGuidThatWillThrow && errorCount++ < numberOfErrorsToGenerate) {
                    console.log('Boom!!!');
                    return throwError(new HttpErrorResponse({status: 500}));
                } else {
                    console.log(`activityGuid ${activityGuid} is executing now`);
                    return timer(100);
                }
            }));
        });

        const numberOfRequestsToMake = 3;

        const responses: PatchAnswerResponse[] = [];

        // subscribe. Just want to make sure that we got (at least) the expected number of responses
        submissionManager.answerSubmissionResponse$.subscribe((response: PatchAnswerResponse) => {
            responses.push(response);

            if (responses.length === numberOfRequestsToMake) {
                // add a check to indicate that we indeed retried even though
                expect(countOfExecutionAttempts).toBe(numberOfRequestsToMake + numberOfErrorsToGenerate);
                done();
            }
        });

        // push out our requests. our subscription is all set waiting for the responses.
        for (let activityGuidNumber = 0; activityGuidNumber < numberOfRequestsToMake; activityGuidNumber++) {
            submissionManager.patchAnswer('x', activityGuidNumber + '', 'blah', 'boo', 'blockGuid');
        }

    });

    it('test retry and fail requests', (done) => {
        const activityGuidThatWillThrow = '1';
        const numberOfErrorsToGenerate = 2;
        let countOfExecutionAttempts = 0;
        const errorMessage = 'Boom!';
        submissionManager.maxRetryCount = 5;
        submissionManager.retryDelayMs = 1000;

        // We are just going to blow up the specified activity. It is never going to work
        serviceAgent.saveAnswerSubmission.and.callFake((studyGuid: string, activityGuid: string, answerSubmission: AnswerSubmission,
                                                        throwAnError: boolean): Observable<PatchAnswerResponse> => {
            return of({
                answers: [],
                blockVisibility: []
            }).pipe(delayWhen(x => {
                ++countOfExecutionAttempts;
                console.log(`I am entering delay in my task with activityGuid ${activityGuid}`);
                // this is where we generate the throwError for our test case
                if (activityGuid === activityGuidThatWillThrow) {
                    console.log('Boom!!!');
                    throw new Error(errorMessage);
                } else {
                    console.log(`activityGuid ${activityGuid} is executing now`);
                    return timer(10);
                }
            }));
        });

        const numberOfRequestsToMake = 3;

        const responses: PatchAnswerResponse[] = [];

        // subscribe. Just want to make sure that we got (at least) the expected number of responses
        submissionManager.answerSubmissionResponse$.subscribe(
            (response: PatchAnswerResponse) => {
                responses.push(response);

                if (responses.length === numberOfRequestsToMake) {
                    done.fail('We should have died already. Did not get the expected thrown error');
                }},
            (error) => {
                console.log('The error handler is being executed!!!');
                expect(error).not.toBeNull();
                expect(error.message).toBe(errorMessage);
                done();
            }
        );

        // push out our requests. our subscription is all set waiting for the responses.
        for (let activityGuidNumber = 0; activityGuidNumber < numberOfRequestsToMake; activityGuidNumber++) {
            submissionManager.patchAnswer('x', activityGuidNumber + '', 'blah', 'boo', 'blockGuid');
        }

    });

    it('block hidden question submissions', (done) => {
        // question #1 will hide question #2
        serviceAgent.saveAnswerSubmission.and.callFake((studyGuid: string, activityGuid: string, answerSubmission: AnswerSubmission,
                                                        throwAnError: boolean): Observable<PatchAnswerResponse> => {
            if (answerSubmission.stableId === '1') {
                console.log('This is it!!!');
            }
            const testBlockVisibility: BlockVisibility[] = answerSubmission.stableId === '1' ? [{ blockGuid: '2', shown: false }] : [];
            return of({
                answers: [],
                blockVisibility: testBlockVisibility
            }).pipe(delayWhen(x => timer(100)));
        });
        submissionManager.answerSubmissionResponse$.subscribe((response) => {
            console.log('I got a new response: ' + JSON.stringify(response));
        });

        // submissionManager.pendingAnswerSubmissionQueue$.subscribe((queue) =>
        //     console.log('In the queue: ' + JSON.stringify(queue))
        // );

        let invalidSubmissions: AnswerSubmission[] = [];
        submissionManager.invalidAnswerSubmissions$.subscribe(invalidSubmission => {
            invalidSubmissions = invalidSubmissions.concat(invalidSubmission);
        });
        const totalPatchesToSubmitToManager = 4;

        interval(25).pipe(take(totalPatchesToSubmitToManager)).subscribe(val => {
            submissionManager.patchAnswer(val + '', 'x', val + '', 'who cares', val + '');
        });

        setTimeout(() => {
            // Should have called except for the call in queue that was hidden
            expect(serviceAgent.saveAnswerSubmission.calls.count()).toBe(totalPatchesToSubmitToManager - 1);

            // 1 notification of invalid submissions
            expect(invalidSubmissions.length).toBe(1);
            expect(invalidSubmissions[0].stableId).toBe('2');
            done();
        },
                   10000);

    });
});
