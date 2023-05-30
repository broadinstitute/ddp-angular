import {
  ChangeDetectionStrategy,
  Component,
  Input
} from "@angular/core";
import {SharedLearningsFile} from "../../interfaces/sharedLearningsFile";

@Component({
  selector: 'app-files-table',
  templateUrl: 'filesTable.component.html',
  styleUrls: ['filesTable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesTableComponent {
  @Input() uploadedFiles: SharedLearningsFile[] = [];
  public readonly columnNames: string[] = ['Name', 'UploadDate'];
}
