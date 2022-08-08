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
  subscription1: Subscription;
  subscription2: Subscription;
  subscriptions = new Subscription();
  private SUCCESSFUL_DOWNLOAD_MESSAGE = 'File download finished.';
  private NOT_SCANNED_FILE_MESSAGE = 'Error - file has not passed scanning';

  constructor( private dsmService: DSMService ) {

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  downloadParticipantFile( file: File ): void {
    this.downloading = true;
    if (!this.isFileClean( file )) {
      this.setDownloadMessageAndStatus( this.NOT_SCANNED_FILE_MESSAGE, false );
      return;
    }
    const realm = localStorage.getItem( ComponentService.MENU_SELECTED_REALM );
    this.subscription1 = this.dsmService.getSignedUrl( this.participant.data.profile[ 'guid' ], file, realm ).subscribe( {
        next: data => {
          this.saveParticipantFile( data.url, file.mimeType, data.fileName );
        },
        error: err => {
          this.setDownloadMessageAndStatus( err, false );
        }
      }
    );
    this.subscriptions.add( this.subscription1 );
  }

  saveParticipantFile( url: any, type: string, fileName: string ): void {
    this.subscription2 = this.dsmService.downloadFromSignedUrl( url ).subscribe(
      {
        next: data => {
          const blob = new Blob( [ data ], {type: type} );
          fileSaver.saveAs( blob, fileName );
          this.setDownloadMessageAndStatus( this.SUCCESSFUL_DOWNLOAD_MESSAGE, false );
        },
        error: err => {
          this.setDownloadMessageAndStatus( err, false );
        }
      }
    );
    this.subscriptions.add( this.subscription2 );

  }

  getNiceDateFormat( uploadedAt: string ): string {
    return new DatePipe( 'en-US' ).transform( uploadedAt, Utils.DATE_STRING_IN_CVS_WITH_TIME );
  }

  public isFileClean( file: File ): boolean {
    return file.scanResult === this.CLEAN;
  }

  private setDownloadMessageAndStatus( message: string, downloading: boolean ): void {
    this.downloadMessage = message;
    this.downloading = downloading;

  }
}
