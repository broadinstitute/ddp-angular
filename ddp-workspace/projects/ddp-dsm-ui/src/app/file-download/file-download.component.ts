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
  CLEAN = 'CLEAN';
  subscription: Subscription;
  subscription2: Subscription;

  constructor( private dsmService: DSMService ) {

  }

  ngOnDestroy(): void {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
    if (this.subscription2 != null) {
      this.subscription2.unsubscribe();
    }
  }

  downloadParticipantFile( file: File ): void {
    this.downloading = true;
    if (!this.isFileClean( file )) {
      this.downloadMessage = 'Error - file has not passed scanning';
      this.downloading = false;
      return;
    }
    const realm = localStorage.getItem( ComponentService.MENU_SELECTED_REALM );
    this.subscription = this.dsmService.getSignedUrl( this.participant.data.profile[ 'guid' ], file.fileName, file.bucket,
      file.blobName, file.guid, realm ).subscribe( {
        next: data => {
          this.saveParticipantFile( data.url, file.mimeType, data.fileName );
        },
        error: err => {
          this.downloadMessage = err;
          this.downloading = false;
        }
      }
    );
  }

  saveParticipantFile( url: any, type: string, fileName: string ): void {
    this.subscription2 = this.dsmService.downloadFromSignedUrl( url ).subscribe(
      {
        next: data => {
          const blob = new Blob( [ data ], {type: type} );
          fileSaver.saveAs( blob, fileName );
          this.downloading = false;
          this.downloadMessage = 'File download finished.';
        },
        error: err => {
          console.log( err );
          this.downloadMessage = err;
          this.downloading = false;
        }
      }
    );
//    const downloadURI = (uri, name) => {
//      const link = document.createElement("a");
//      link.download = name;
//      link.href = uri;
//      document.body.appendChild(link);
//      link.click();
//      document.body.removeChild(link);
//    }
//    downloadURI(url, fileName);




  }


  getNiceDateFormat( uploadedAt: string ): string {
    return new DatePipe( 'en-US' ).transform( uploadedAt, Utils.DATE_STRING_IN_CVS_WITH_TIME );
  }

  public isFileClean( file: File ): boolean {
    return file.scanResult === this.CLEAN;
  }
}
