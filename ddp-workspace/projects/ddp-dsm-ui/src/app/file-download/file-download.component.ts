import {DatePipe} from '@angular/common';
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ESFile} from '../participant-list/models/file.model';
import {Participant} from '../participant-list/participant-list.model';
import {Utils} from '../utils/utils';


@Component( {
  selector: 'app-file-download',
  templateUrl: './file-download.component.html',
  styleUrls: [ './file-download.component.scss' ]
} )

export class FileDownloadComponent {
  @Input() participant: Participant;
  @Output() downloadFileEvent = new EventEmitter<ESFile>();
  CLEAN = 'CLEAN';


  downloadParticipantFile( event: Event, file: ESFile ): void {
    this.downloadFileEvent.emit(file);
  }

  getNiceDateFormat( uploadedAt: string ): string {
    return new DatePipe( 'en-US' ).transform( uploadedAt, Utils.DATE_STRING_IN_CVS_WITH_TIME );
  }


}
