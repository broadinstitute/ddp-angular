import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivityConverter } from '../activity/activityConverter.service';
import { UserServiceAgent } from './userServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { AnswerValue } from '../../models/activity/answerValue';
import { ActivityInstanceGuid } from '../../models/activityInstanceGuid';
import { Observable, of, throwError } from 'rxjs';
import { combineLatest, flatMap, catchError, map } from 'rxjs/operators';
import { AnswerSubmission } from '../../models/activity/answerSubmission';
import { PatchAnswerResponse } from '../../models/activity/patchAnswerResponse';
import { ActivityForm } from '../../models/activity/activityForm';

@Injectable()
export class ActivityServiceAgent extends UserServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        private converter: ActivityConverter,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger);
    }

    public getActivity(studyGuid: Observable<string | null>,
        activityGuid: Observable<string | null>): Observable<ActivityForm> {
        return studyGuid.pipe(
            combineLatest(activityGuid, (x, y) => {
                return { study: x, activity: y };
            }),
            flatMap(x => {
                if (x.study == null || x.study === '' ||
                    x.activity == null || x.activity === '') {
                    return of(null);
                }
                return this.getObservable(`/studies/${x.study}/activities/${x.activity}`, {}, [404]);
            }, (x, y) => y),
            catchError(e => {
                if (e.error && e.error.code && e.error.code === 'ACTIVITY_NOT_FOUND') {
                    return throwError('ACTIVITY_NOT_FOUND');
                }
                return throwError(e);
            }),
            map(x => {
                if (x == null) {
                    return null;
                }
                x = {
                    "formType": "GENERAL",
                    "listStyleHint": "NUMBER",
                    "readonlyHint": "\u003cspan class\u003d\"ddp-block-title-bold\"\u003eThank you for signing your consent form. If you would like to make any changes, please reach out to the study team at \u003ca href\u003d\"mailto:info@ascproject.org\" class\u003d\"Footer-contactLink\"\u003einfo@ascproject.org \u003c/a\u003e, or call us at \u003ca href\u003d\"tel:857-500-6264\" class\u003d\"Footer-contactLink\"\u003e 857-500-6264\u003c/a\u003e.\u003c/span\u003e",
                    "introduction": {
                        "name": null,
                        "icons": [],
                        "blocks": [
                            {
                                "title": null,
                                "body": "\u003cdiv class\u003d\"row\"\u003e\u003cdiv class\u003d\"col-lg-12 col-md-12 col-sm-12 col-xs-12\"\u003e\u003ch1 class\u003d\"PageContent-title NoMargin\"\u003eThank you very much for providing your consent to participate in this research study. To complete the process, we will need to collect some additional information from you below.\u003c/h1\u003e\u003c/div\u003e\u003c/div\u003e",
                                "blockType": "CONTENT",
                                "blockGuid": "XR8GK9BLXD",
                                "shown": true
                            },
                            {
                                "listStyleHint": "BULLET",
                                "presentation": "DEFAULT",
                                "title": "\u003ch2 class\u003d\"PageContent-subtitle Normal Color--neutral\"\u003eTo proceed with this study, we need to collect information about:\u003c/h2\u003e",
                                "nested": [
                                    {
                                        "title": null,
                                        "body": "\u003cdiv class\u003d\"PageContent-text\"\u003eYour contact information, including your current mailing address, so that we can send you a saliva kit.\u003c/div\u003e",
                                        "blockType": "CONTENT",
                                        "blockGuid": "R50MKZKQD4",
                                        "shown": true
                                    },
                                    {
                                        "title": null,
                                        "body": "\u003cdiv class\u003d\"PageContent-text\"\u003eThe name and contact information for the physician(s) who has/have cared for you throughout your experiences with angiosarcoma, so we can obtain copies of your medical records.\u003c/div\u003e",
                                        "blockType": "CONTENT",
                                        "blockGuid": "GNTHXKKZ9E",
                                        "shown": true
                                    },
                                    {
                                        "title": null,
                                        "body": "\u003cdiv class\u003d\"PageContent-text\"\u003eThe names of the hospitals / institutions where you’ve had biopsies and surgeries, so we can obtain some of your stored tumor samples.\u003c/div\u003e",
                                        "blockType": "CONTENT",
                                        "blockGuid": "VNM2ISAXPM",
                                        "shown": true
                                    }
                                ],
                                "blockType": "GROUP",
                                "blockGuid": "A61BHJK6UZ",
                                "shown": true
                            },
                            {
                                "title": null,
                                "body": "\u003ch3 class\u003d\"PageContent-subtitle Normal Color--neutral\"\u003eAs you fill out the information below, your answers will be automatically saved. If you cannot complete this form now, please use the link we sent you via email to return to this page and pick up where you left off.\u003c/h3\u003e",
                                "blockType": "CONTENT",
                                "blockGuid": "DA8CC9JD4F",
                                "shown": true
                            }
                        ]
                    },
                    "closing": {
                        "name": null,
                        "icons": [],
                        "blocks": [
                            {
                                "title": null,
                                "body": "\u003ch2 class\u003d\"PageContent-subtitle PageContent-closing-question Normal Color--neutral\"\u003eBy completing this information, you are agreeing to allow us to contact these physician(s) and hospital(s) / institution(s) to obtain your records.\u003c/h2\u003e",
                                "blockType": "CONTENT",
                                "blockGuid": "HP2EM57CQL",
                                "shown": true
                            },
                            {
                                "question": {
                                    "questionType": "AGREEMENT",
                                    "stableId": "RELEASE_AGREEMENT",
                                    "prompt": "\u003cspan id\u003d\"release-agree\"\u003eI have already read and signed the informed consent document for this study, which describes the use of my personal health information (Section O), and hereby grant permission to Nikhil Wagle, MD, Dana-Farber Cancer Institute, 450 Brookline Ave, Boston, MA, 02215, or a member of the study team to examine copies of my medical records pertaining to my angiosarcoma diagnosis and treatment, and, if I elected on the informed consent document, to obtain tumor tissue for research studies. I acknowledge that a copy of this completed form will be sent to my email address.\u003c/span\u003e",
                                    "textPrompt": "I have already read and signed the informed consent document for this study, which describes the use of my personal health information (Section O), and hereby grant permission to Nikhil Wagle, MD, Dana-Farber Cancer Institute, 450 Brookline Ave, Boston, MA, 02215, or a member of the study team to examine copies of my medical records pertaining to my angiosarcoma diagnosis and treatment, and, if I elected on the informed consent document, to obtain tumor tissue for research studies. I acknowledge that a copy of this completed form will be sent to my email address.",
                                    "additionalInfoHeader": null,
                                    "additionalInfoFooter": null,
                                    "answers": [],
                                    "validations": [
                                        {
                                            "rule": "REQUIRED",
                                            "message": "Please agree to the consent.",
                                            "allowSave": false
                                        }
                                    ],
                                    "validationFailures": null
                                },
                                "displayNumber": null,
                                "blockType": "QUESTION",
                                "blockGuid": "HL3RAR2B5A",
                                "shown": true
                            }
                        ]
                    },
                    "sections": [
                        {
                            "name": null,
                            "icons": [],
                            "blocks": [
                                {
                                    "component": {
                                        "componentType": "MAILING_ADDRESS",
                                        "displayNumber": null,
                                        "parameters": {
                                            "titleText": "Your contact information",
                                            "subtitleText": null
                                        }
                                    },
                                    "displayNumber": 1,
                                    "blockType": "COMPONENT",
                                    "blockGuid": "806O6BMEGE",
                                    "shown": true
                                },
                                {
                                    "component": {
                                        "componentType": "PHYSICIAN",
                                        "displayNumber": null,
                                        "parameters": {
                                            "allowMultiple": true,
                                            "addButtonText": "+ ADD ANOTHER PHYSICIAN",
                                            "titleText": "Your Physicians\u0027 Names",
                                            "subtitleText": null,
                                            "institutionType": "PHYSICIAN",
                                            "showFieldsInitially": true,
                                            "required": true
                                        }
                                    },
                                    "displayNumber": 2,
                                    "blockType": "COMPONENT",
                                    "blockGuid": "ACILNGUVES",
                                    "shown": true
                                },
                                {
                                    "component": {
                                        "componentType": "INSTITUTION",
                                        "displayNumber": null,
                                        "parameters": {
                                            "allowMultiple": false,
                                            "addButtonText": null,
                                            "titleText": "Your Hospital / Institution",
                                            "subtitleText": "Where was your initial biopsy for angiosarcoma performed?",
                                            "institutionType": "INITIAL_BIOPSY",
                                            "showFieldsInitially": true,
                                            "required": false
                                        }
                                    },
                                    "displayNumber": 3,
                                    "blockType": "COMPONENT",
                                    "blockGuid": "SBU5PPQG6F",
                                    "shown": true
                                },
                                {
                                    "component": {
                                        "componentType": "INSTITUTION",
                                        "displayNumber": null,
                                        "parameters": {
                                            "allowMultiple": true,
                                            "addButtonText": "+ ADD ANOTHER INSTITUTION",
                                            "titleText": "Where were any other biopsies or surgeries for your angiosarcoma performed?",
                                            "subtitleText": null,
                                            "institutionType": "INSTITUTION",
                                            "showFieldsInitially": false,
                                            "required": false
                                        }
                                    },
                                    "displayNumber": 4,
                                    "blockType": "COMPONENT",
                                    "blockGuid": "6X108T8VLN",
                                    "shown": true
                                }
                            ]
                        }
                    ],
                    "lastUpdated": null,
                    "lastUpdatedText": null,
                    "activityType": "FORMS",
                    "guid": "HPY9NZH87P",
                    "activityCode": "ANGIORELEASE",
                    "name": "Medical Release Form",
                    "status": "New",
                    "readonly": false,
                    "subtitle": "\u003cdiv\u003e\u003cspan\u003eIf you have any questions, please email us at\u003c/span\u003e\u003ca href\u003d\"mailto:info@ascproject.org\" class\u003d\"HeaderLink\"\u003e info@ascproject.org \u003c/a\u003e\u003cspan\u003eor call us at\u003c/span\u003e\u003ca href\u003d\"tel:857-500-6264\" class\u003d\"HeaderLink\"\u003e 857-500-6264\u003c/a\u003e.\u003c/div\u003e",
                    "isFollowup": false
                };
                return this.converter.convertActivity(x);
            })
        );
    }

    public saveAnswerSubmission(studyGuid: string, activityGuid: string, answerSubmission: AnswerSubmission,
        throwError: boolean): Observable<PatchAnswerResponse> {
        const payload = { answers: [answerSubmission] };
        return this.patchObservable(`/studies/${studyGuid}/activities/${activityGuid}/answers`, payload, {}, throwError).pipe(
            map(httpResponse => httpResponse.body));
    }

    public saveAnswer(studyGuid: string,
        activityGuid: string,
        questionStableId: string,
        value: AnswerValue,
        answerId: string | null = null, throwError = false): Observable<any> {
        const data: AnswerSubmission = {
            stableId: questionStableId,
            answerGuid: answerId,
            value
        };

        return this.saveAnswerSubmission(studyGuid, activityGuid, data, throwError);
    }

    public flushForm(studyGuid: string, activityGuid: string): Observable<any> {
        return this.putObservable(`/studies/${studyGuid}/activities/${activityGuid}/answers`, null);
    }

    public createInstance(studyGuid: string, activityCode: string): Observable<ActivityInstanceGuid | null> {
        return this.postObservable(`/studies/${studyGuid}/activities`, { activityCode }).pipe(
            map(x => !!x ? x.body as ActivityInstanceGuid : null)
        );
    }
}
