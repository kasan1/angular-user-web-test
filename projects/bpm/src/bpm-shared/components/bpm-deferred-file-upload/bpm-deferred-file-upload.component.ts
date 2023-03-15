import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { IFileInfo, FileCode, FilePage } from 'projects/shared/models/fileInfo';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-deferred-file-upload',
  templateUrl: './bpm-deferred-file-upload.component.html',
  styleUrls: ['./bpm-deferred-file-upload.component.scss'],
})
export class BpmDeferredFileUploadComponent implements OnInit {
  @Input() page: FilePage;
  @Input() code: FileCode;
  @Input() hasActions = true;

  @Input() initialFiles: IFileInfo[] = [];
  @Output() deletedInitialFile: EventEmitter<IFileInfo> = new EventEmitter();

  @Output() fileChange: EventEmitter<IFileInfo[]> = new EventEmitter();
  files: IFileInfo[] = [];

  constructor() {}

  ngOnInit(): void {
    this.files = [...this.initialFiles];
  }

  filesUploaded = (event: IFileInfo[]) => {
    this.files.push(...event);
    this.fileChange.emit(this.files);
  };

  fileDeleted = (event: IFileInfo) => {
    this.files = this.files.filter((x) => x !== event);

    if (event.id) this.deletedInitialFile.emit(event);
    else this.fileChange.emit(this.files);
  };
}
