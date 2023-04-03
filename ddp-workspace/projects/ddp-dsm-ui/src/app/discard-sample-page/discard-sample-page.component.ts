import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Utils } from '../utils/utils';
import { ComponentService } from '../services/component.service';
import { Auth } from '../services/auth.service';
import { DSMService } from '../services/dsm.service';
import { RoleService } from '../services/role.service';
import { DiscardSample } from '../discard-sample/discard-sample.model';
import { Result } from '../utils/result.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discard-sample-page',
  templateUrl: './discard-sample-page.component.html',
  styleUrls: ['./discard-sample-page.component.css']
})
export class DiscardSamplePageComponent implements OnInit, OnDestroy {
  /* eslint-disable no-console */
  errorMessage: string;
  additionalMessage: string;

  realm: string;

  sample: DiscardSample;

  fileBSPScreenshot: File = null;
  fileSampleImage: File = null;
  imageToShow: any;
  savingNote = false;
  fileToDelete: string;

  public modalRef: BsModalRef;

  waiting = false;
  subscription1: Subscription;
  subscription2: Subscription;

  constructor(private _changeDetectionRef: ChangeDetectorRef, private auth: Auth, private compService: ComponentService,
               private dsmService: DSMService, private router: Router, private sanitizer: DomSanitizer,
               private role: RoleService, private util: Utils, private route: ActivatedRoute, private modalService: BsModalService) {
    if (!auth.authenticated()) {
      auth.sessionLogout();
    }
    this.route.queryParams.subscribe(params => {
      this.realm = params[DSMService.REALM] || null;
      if (this.realm != null) {
        //        this.compService.realmMenu = this.realm;
        this.router.navigate(['/discardList']);
      }
    });
  }

  ngOnInit(): void {
    if (this.compService.discardSample != null) {
      this.sample = this.compService.discardSample;
    }
    if (sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM) != null) {
      this.realm = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
    } else {
      this.errorMessage = 'Error - Information is missing';
    }
    window.scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    if (this.subscription1 != null) {
      this.subscription1.unsubscribe();
    }
    if (this.subscription2 != null) {
      this.subscription2.unsubscribe();
    }
  }

  public backToDiscardSamples(): boolean {
    this.compService.discardSample = null;
    this.router.navigate(['/discardList']);
    return false;
  }

  discard(): void {
    if (this.realm != null) {
      this.errorMessage = null;
      this.additionalMessage = null;
      const payload = {
        kitRequestId: this.sample.kitRequestId,
        kitDiscardId: this.sample.kitDiscardId,
        discardDate: this.sample.discardDate
      };
      this.dsmService.setKitDiscarded(this.realm, JSON.stringify(payload)).subscribe({
        next: () => {
          // console.info(`received: ${JSON.stringify(data, null, 2)}`);
          this.router.navigate(['/discardList']);
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.sessionLogout();
          }
          this.errorMessage = 'Error - Loading list of samples of exited participants\nPlease contact your DSM developer';
        }
      });
    }
  }

  uploadFile(pathName: string, file: File): void {
    this.waiting = true;
    this.dsmService.uploadFile(this.realm, this.sample.kitDiscardId, pathName, file).subscribe({
      next: data => {
        console.info(`received: ${JSON.stringify(data, null, 2)}`);
        const result = Result.parse(data);
        if (result.code === 200 && result.body != null) {
          this.sample[pathName] = result.body;
          this.additionalMessage = 'File uploaded';
        } else {
          this.additionalMessage = 'Failed to upload file';
        }
        this.waiting = false;
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.sessionLogout();
        }
        this.errorMessage = 'Error - Uploading file\nPlease contact your DSM developer';
        this.waiting = false;
      }
    });
  }

  saveNote(): void {
    if (this.realm != null && this.sample.note != null) {
      this.errorMessage = null;
      this.additionalMessage = null;
      this.savingNote = true;
      this.dsmService.saveNote(this.realm, this.sample.kitDiscardId, this.sample.note).subscribe({
        next: data => {
          console.info(`received: ${JSON.stringify(data, null, 2)}`);
          this.savingNote = false;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.sessionLogout();
          }
          this.errorMessage = 'Error - Loading list of samples of exited participants\nPlease contact your DSM developer';
        }
      });
    }
  }

  deleteFile(path: string, template: TemplateRef<any>): void {
    this.fileToDelete = path;
    this.openModal(template);
  }

  deleteFileNow(): void {
    if (this.fileToDelete != null) {
      this.waiting = true;
      this.dsmService.deleteFile(this.realm, this.sample.kitDiscardId, this.fileToDelete, this.sample[this.fileToDelete]).subscribe({
        next: data => {
          console.info(`received: ${JSON.stringify(data, null, 2)}`);
          const result = Result.parse(data);
          if (result.code === 200) {
            this.sample[this.fileToDelete] = null;
            this.fileToDelete = null;
            this.additionalMessage = 'File deleted';
            this.errorMessage = null;
          } else {
            this.additionalMessage = null;
            this.errorMessage = 'Failed to delete file';
          }
          this.modalRef.hide();
          this.waiting = false;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.sessionLogout();
          }
          this.modalRef.hide();
          this.additionalMessage = null;
          this.errorMessage = 'Error - Uploading file\nPlease contact your DSM developer';
          this.waiting = false;
        }
      });
    }
  }

  fileBSPSelected(file: File): void {
    this.fileBSPScreenshot = file;
    if (this.fileBSPScreenshot != null) {
      this.uploadFile('pathBSPScreenshot', this.fileBSPScreenshot);
    }
  }

  fileImageSelected(file: File): void {
    this.fileSampleImage = file;
    if (this.fileSampleImage != null) {
      this.uploadFile('pathSampleImage', this.fileSampleImage);
    }
  }

  hasRole(): RoleService {
    return this.role;
  }

  discardDate(date: string): void {
    this.sample.discardDate = date;
  }

  show(path: string, template: TemplateRef<any>): void {
    const payload = {
      kitRequestId: this.sample.kitRequestId,
      kitDiscardId: this.sample.kitDiscardId,
      path
    };
    // console.info("here" + path);
    this.dsmService.showUpload(this.realm, JSON.stringify(payload)).subscribe({
      next: data => {
        // console.info("received something back " + data);
        const blob = new Blob([data]);
        this.imageToShow = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        this.openModal(template);
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          console.info('received error back');
          this.auth.sessionLogout();
        }
        this.errorMessage = 'Error - Loading list of samples of exited participants\nPlease contact your DSM developer';
      }
    });
  }

  public openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  confirm(): void {
    this.auth.lockForDiscard.show();

    this.subscription1 = this.auth.confirmKitDiscard.subscribe(
      data => {
        // console.log(data);
        this.confirmToken(data);
      }
    );
  }

  confirmToken(token: string): void {
    this.waiting = true;
    const payload = {
      kitRequestId: this.sample.kitRequestId,
      kitDiscardId: this.sample.kitDiscardId,
      token
    };

    this.subscription2 = this.dsmService.confirm(this.realm, JSON.stringify(payload)).subscribe({
      next: data => {
        console.info(`received: ${JSON.stringify(data, null, 2)}`);
        const result = Result.parse(data);
        if (result.code === 200 && result.body != null) {
          this.sample.userConfirm = result.body;
          this.additionalMessage = 'Confirmed';
        } else if (result.code === 500 && result.body != null) {
          if (result.body === 'DIFFERENT_USER') {
            this.additionalMessage = 'Someone else needs to confirm';
          } else if (result.body === 'USER_NO_RIGHT') {
            this.additionalMessage = 'User needs to have the right to see Samples menu or is allowed to discard';
          }
        } else {
          this.additionalMessage = null;
          this.errorMessage = 'Error - Confirming discard sample\nPlease contact your DSM developer';
        }
        this.waiting = false;
      },
      error: () => {
        this.waiting = false;
        this.additionalMessage = null;
        this.errorMessage = 'Error - Confirming discard sample\nPlease contact your DSM developer';
      }
    });
  }
}
