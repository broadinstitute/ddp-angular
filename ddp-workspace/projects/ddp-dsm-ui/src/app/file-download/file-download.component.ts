import {DatePipe} from '@angular/common';
import {Component, Input} from '@angular/core';
import {mergeMap} from 'rxjs';
import {take} from 'rxjs/operators';
import {ESFile} from '../participant-list/models/file.model';
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

export class FileDownloadComponent {
  @Input() participant: Participant;
  downloadMessage = '';
  downloading = false;
  CLEAN = 'CLEAN';
  private SUCCESSFUL_DOWNLOAD_MESSAGE = 'File download finished.';
  private NOT_SCANNED_FILE_MESSAGE = 'Error - file has not passed scanning';

  constructor( private dsmService: DSMService ) {

  }


  downloadParticipantFile( file: ESFile ): void {
    this.downloading = true;
    if (!this.isFileClean( file )) {
      this.setDownloadMessageAndStatus( this.NOT_SCANNED_FILE_MESSAGE, false );
      return;
    }

    const realm = localStorage.getItem( ComponentService.MENU_SELECTED_REALM );
    this.dsmService.getSignedUrl( this.participant.data.profile[ 'guid' ], file, realm ).pipe(
      mergeMap(data => this.dsmService.downloadFromSignedUrl(data['url']).pipe(take(1)))).subscribe( {
        next: data => {
            const blob = new Blob( [ data ], {type: file.mimeType} );
            fileSaver.saveAs( blob, file.fileName );
            this.setDownloadMessageAndStatus( this.SUCCESSFUL_DOWNLOAD_MESSAGE, false );
        },
        error: err => {
          this.setDownloadMessageAndStatus( err, false );
        }
      } );

  }

  getNiceDateFormat( uploadedAt: string ): string {
    return new DatePipe( 'en-US' ).transform( uploadedAt, Utils.DATE_STRING_IN_CVS_WITH_TIME );
  }

  public isFileClean( file: ESFile ): boolean {
    return file.scanResult === this.CLEAN;
  }

  private setDownloadMessageAndStatus( message: string, downloading: boolean ): void {
    this.downloadMessage = message;
    this.downloading = downloading;

  }
}
