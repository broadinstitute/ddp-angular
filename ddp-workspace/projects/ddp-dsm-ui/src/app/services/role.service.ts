import {Inject, Injectable} from '@angular/core';
import {ConfigurationService} from "ddp-sdk";
import { SessionService } from './session.service';
import { UserSetting } from '../user-setting/user-setting.model';

@Injectable()
export class RoleService {
  private _isShipping = false;
  private _isMRRequesting = false;
  private _isMRView = false;
  private _isMailingList = false;
  private _isUpload = false;
  private _isExitParticipant = false;
  private _isDeactivation = false;
  private _isViewingEEL = false;
  private _isReceiving = false;
  private _isExpressKit = false;
  private _isTriggeringSurveyCreation = false;
  private _isSkipParticipant = false;
  private _isDiscardingSamples = false;
  private _isSampleListView = false;
  private _isDownloadPDF = false;
  private _isDownloadNDI = false;
  private _noTissueRequest = false;
  private _fieldSettings = false;
  private _isAbstracter = false;
  private _isQC = false;
  private _isAbstractionAdmin = false;
  private _canEditDrugList = false;
  private _isParticipantListView = false;
  private _isParticipantEdit = false;
  private _isDSSTesting = true; //TODO remove before final merge, for testing only

  private _userId: string;
  private _user: string;
  private _userEmail: string;
  private _userSetting: UserSetting;


  constructor(private sessionService: SessionService,
              @Inject('ddp.config') private config: ConfigurationService) {
    const token: string = this.sessionService.getDSMToken();
    this.setRoles(token);
  }

  public setRoles(token: string): void {
    if (token != null) {
      const accessRoles: string = this.getClaimByKeyName(token, 'USER_ACCESS_ROLE');
      if (accessRoles != null) {
        console.log(accessRoles);
        const roles: string[] = JSON.parse(accessRoles);
        for (const entry of roles) {
          // only special kit_shipping_xxx rights should get added here, not the overall only kit_shipping_view
          if (entry.startsWith('kit_shipping') && entry !== 'kit_shipping_view') {
            this._isShipping = true;
          } else if (entry === 'mr_request') {
            this._isMRRequesting = true;
          } else if (entry === 'mr_view') {
            this._isMRView = true;
          } else if (entry === 'mailingList_view') {
            this._isMailingList = true;
          } else if (entry === 'kit_upload') {
            this._isUpload = true;
          } else if (entry === 'participant_exit') {
            this._isExitParticipant = true;
          } else if (entry === 'kit_deactivation') {
            this._isDeactivation = true;
          } else if (entry === 'eel_view') {
            this._isViewingEEL = true;
          } else if (entry === 'kit_receiving') {
            this._isReceiving = true;
          } else if (entry === 'kit_express') {
            this._isExpressKit = true;
          } else if (entry === 'survey_creation') {
            this._isTriggeringSurveyCreation = true;
          } else if (entry === 'participant_event') {
            this._isSkipParticipant = true;
          } else if (entry === 'discard_sample') {
            this._isDiscardingSamples = true;
          } else if (entry === 'kit_shipping_view') {
            this._isSampleListView = true;
          } else if (entry === 'pdf_download') {
            this._isDownloadPDF = true;
          } else if (entry === 'ndi_download') {
            this._isDownloadNDI = true;
          } else if (entry === 'mr_no_request_tissue') {
            this._noTissueRequest = true;
          } else if (entry === 'field_settings') {
            this._fieldSettings = true;
          } else if (entry === 'mr_abstracter') {
            this._isAbstracter = true;
          } else if (entry === 'mr_qc') {
            this._isQC = true;
          } else if (entry === 'mr_abstraction_admin') {
            this._isAbstractionAdmin = true;
          } else if (entry === 'drug_list_edit') {
            this._canEditDrugList = true;
          } else if (entry === 'pt_list_view') {
            this._isParticipantListView = true;
          } else if (entry === 'participant_edit') {
            this._isParticipantEdit = true;
          }
        }
      }
      const userSettings: any = this.getClaimByKeyName(token, 'USER_SETTINGS');
      if (userSettings != null && userSettings !== 'null') {
        this._userSetting = UserSetting.parse(JSON.parse(userSettings));
      }
      this._userId = this.getClaimByKeyName(token, 'USER_ID');
      this._user = this.getClaimByKeyName(token, 'USER_NAME');
      this._userEmail = this.getClaimByKeyName(token, 'USER_MAIL');
    }
  }

  public userID(): string {
    return this._userId;
  }

  public userMail(): string {
    return this._userEmail;
  }

  public getUserName(): string {
    return this._user;
  }

  public allowedToHandleSamples(): boolean {
    return this._isShipping;
  }

  public allowedToViewMedicalRecords(): boolean {
    return this._isMRView;
  }

  public allowedToViewMailingList(): boolean {
    return this._isMailingList;
  }

  public allowedToUploadKits(): boolean {
    return this._isUpload;
  }

  public allowedToExitParticipant(): boolean {
    return this._isExitParticipant;
  }

  public allowedToDeactivateKits(): boolean {
    return this._isDeactivation;
  }

  public allowedToViewEELData(): boolean {
    return this._isViewingEEL;
  }

  public allowedToViewReceivingPage(): boolean {
    return this._isReceiving;
  }

  public allowedToCreateExpressLabels(): boolean {
    return this._isExpressKit;
  }

  public allowedToCreateSurveys(): boolean {
    return this._isTriggeringSurveyCreation;
  }

  public allowedToSkipParticipantEvents(): boolean {
    return this._isSkipParticipant;
  }

  public allowedToDiscardSamples(): boolean {
    return this._isDiscardingSamples;
  }

  public allowToViewSampleLists(): boolean {
    return this._isSampleListView;
  }

  public allowedToDownloadPDF(): boolean {
    return this._isDownloadPDF;
  }

  public allowedToDownloadNDI(): boolean {
    return this._isDownloadNDI;

  }

  public prohibitedToRequestTissue(): boolean {
    return this._noTissueRequest;
  }

  public allowedToChangeFieldSettings(): boolean {
    return this._fieldSettings;
  }

  public isAbstracter(): boolean {
    return this._isAbstracter;
  }

  public isQC(): boolean {
    return this._isQC;
  }

  public isAbstractionAdmin(): boolean {
    return this._isAbstractionAdmin;
  }

  public getUserSetting(): UserSetting {
    return this._userSetting;
  }

  public setUserSetting(userSettings: UserSetting): void {
    this._userSetting = userSettings;
  }

  public allowedToEditDrugList(): boolean {
    return this._canEditDrugList;
  }

  public allowedParticipantListView(): boolean {
    return this._isParticipantListView;
  }

  public allowedToEditParticipant(): boolean {
    return this._isParticipantEdit;
  }

  public allowedToTestDSSActivity(): boolean {
    return this._isDSSTesting;//TODO remove before final merge, for testing only
  }

  private getClaimByKeyName( token: any, key: string ) {
      return this.sessionService.getDSMClaims(token)[this.config.auth0ClaimNameSpace + key];
  }
}
