import {DatePipe} from '@angular/common';
import {Component, Input, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {File} from '../participant-list/models/file.model';
import {Participant} from '../participant-list/participant-list.model';
import {ComponentService} from '../services/component.service';
import {DSMService} from '../services/dsm.service';
import {Utils} from '../utils/utils';

const fileSaver = require( 'file-saver' );

@Component( {
  selector: 'app-file-download',
  templateUrl: './file-download.component.html',
  styleUrls: [ './file-download.component.scss' ]
} )

export class FileDownloadComponent implements OnDestroy {
  @Input() participant: Participant;
  downloadMessage = '';
  downloading = false;
  QUARANTINE = 'quarantine';
  CLEAN = 'CLEAN';
  subscription: Subscription;

  constructor( private dsmService: DSMService ) {

  }

  ngOnDestroy(): void {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

  downloadParticipantFile( file: File ): void {
    this.downloading = true;
    if (!this.isFileClean( file )) {
      this.downloadMessage = 'Error - file has not passed scanning';
      this.downloading = false;
      return;
    }
    if (file.bucket.includes( this.QUARANTINE )) {
      this.downloadMessage = 'Error - file is in quarantine and should not be downloaded!';
      this.downloading = false;
      return;
    }
    const realm = localStorage.getItem( ComponentService.MENU_SELECTED_REALM );
    this.subscription = this.dsmService.downloadParticipantFile( file.fileName, file.bucket, file.blobName, realm, file.mimeType )
      .subscribe( {
          next: data => {
            this.saveParticipantFile( data, file.mimeType, file.fileName );
            this.downloading = false;
            this.downloadMessage = 'File download finished.';
          },
          error: err => {
            this.downloadMessage = err;
            this.downloading = false;
          }
        }
      );
  }

  saveParticipantFile( data: any, type: string, fileName: string ): void {
    const blob = new Blob( [ data ], {type: type} );
    fileSaver.saveAs( blob, fileName );
  }


  getNiceDateFormat( uploadedAt: string ): string {
    return new DatePipe( 'en-US' ).transform( uploadedAt, Utils.DATE_STRING_IN_CVS_WITH_TIME );
  }

  public isFileClean( file: File ): boolean {
    return file.scannedAt && file.bucket && file.scanResult === this.CLEAN;
  }
}
