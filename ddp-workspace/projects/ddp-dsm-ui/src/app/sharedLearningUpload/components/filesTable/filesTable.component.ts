import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {SharedLearningsFile} from "../../interfaces/sharedLearningsFile";
import {HttpRequestStatusEnum} from "../../enums/httpRequestStatus-enum";

@Component({
  selector: 'app-files-table',
  templateUrl: 'filesTable.component.html',
  styleUrls: ['filesTable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesTableComponent implements OnChanges {
  public readonly columnNames: string[] = ['Name', 'UploadDate', 'SendToParticipant', 'SentDate', 'Delete'];

  @Input() uploadedFiles: SharedLearningsFile[] = [];
  @Input() sendToParticipantStatus: HttpRequestStatusEnum = HttpRequestStatusEnum.DEFAULT;
  @Input() deleteStatus: HttpRequestStatusEnum = HttpRequestStatusEnum.DEFAULT;

  @Output() sendToParticipant = new EventEmitter();
  @Output() delete = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes, 'FILE_TABLE_CHANGES')
  }

}
