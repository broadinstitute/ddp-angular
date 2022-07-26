import {DatePipe} from '@angular/common';
import {Component, Input, Output} from '@angular/core';
import {File} from '../participant-list/models/file.model';
import {Participant} from '../participant-list/participant-list.model';
import {ComponentService} from '../services/component.service';
import {DSMService} from '../services/dsm.service';
import {Utils} from '../utils/utils';
import { Subscription } from 'rxjs';

const fileSaver = require( 'file-saver' );

@Component( {
  selector: 'app-file-download',
  templateUrl: './file-download.component.html',
  styleUrls: [ './file-download.component.scss' ]
} )

export class FileDownloadComponent {
  @Input() participant: Participant;
  downloadMessage = '';
  downloading = false;
  CLEAN = 'CLEAN';
  subscription: Subscription;

  constructor(private dsmService: DSMService ) {

  }

  ngOnDestroy(){
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

  downloadParticipantFile( file: File ): void {
    this.downloading = true;
    if (file.scanResult !== this.CLEAN) {
      this.downloadMessage = 'Error - file has not passed scanning';
      this.downloading = false;
      return;
    }
    const realm = localStorage.getItem( ComponentService.MENU_SELECTED_REALM );
    this.subscription = this.dsmService.downloadParticipantFile( file.fileName, file.bucket, file.blobName, realm, file.mimeType ).subscribe(
      data => {
        this.saveParticipantFile( data, file.mimeType, file.fileName );
        this.downloading = false;
        this.downloadMessage = 'File download finished.';
      },
      err => {
        console.log( err );
        this.downloadMessage = err;
        this.downloading = false;
      }
    );
  }

  saveParticipantFile( data: any, type: string, fileName: string ): void {
    const blob = new Blob( [ data ], {type: type} );
    fileSaver.saveAs( blob, fileName );
  }


  getNiceDateFormat( uploadedAt: string ): string {
    return new DatePipe('en-US').transform(uploadedAt, Utils.DATE_STRING_IN_CVS_WITH_TIME);
  }
}
