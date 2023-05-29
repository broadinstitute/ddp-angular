import {ChangeDetectionStrategy, Component, ViewChild} from "@angular/core";
import {SharedLearningsFile} from "./interfaces/sharedLearningsFile";
import {delay, Observable, of} from "rxjs";
import {MatTable} from "@angular/material/table";

@Component({
  selector: 'app-shared-learnings-upload',
  templateUrl: 'sharedLearningsUpload.component.html',
  styleUrls: ['sharedLearningsUpload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedLearningsUploadComponent {
  @ViewChild(MatTable) table: MatTable<SharedLearningsFile>;

  public uploadedFiles: SharedLearningsFile[] = [];
  public isUploadedFilesDataLoading = false;
  public readonly columnNames: string[] = ['Name', 'DateUploaded'];

  constructor() {
  }

  public onFileUpload(file: SharedLearningsFile) {
    console.log(file, 'FILE_UPLOADED')
    this.uploadedFiles.push(file)
    this.table.renderRows();
  }

}
