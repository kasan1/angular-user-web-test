import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable } from 'rxjs';
import { BpmLocaleService } from 'projects/bpm/src/app/services/locale.service';
import {
  fadeInOutTrigger,
  fadeInOutSequenceTrigger,
} from 'projects/shared/util/triggers';
import { FilePage, FileCode, IFileInfo } from 'projects/shared/models/fileInfo';
import { cloneDeep } from 'lodash';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-file-upload-base',
  templateUrl: './bpm-file-upload-base.component.html',
  styleUrls: ['./bpm-file-upload-base.component.scss'],
  animations: [fadeInOutTrigger, fadeInOutSequenceTrigger],
})
export class BpmFileUploadBaseComponent implements OnInit {
  @Input() page: FilePage = FilePage.All;
  @Input() code: FileCode;
  @Input() deferred = true;
  @Input() hasActions = true;

  @Input() initialFiles: IFileInfo[] = [];
  @Input() maxMb = 10;

  @Output() filesUploaded: EventEmitter<IFileInfo[]> = new EventEmitter();
  @Output() fileDeleted: EventEmitter<IFileInfo> = new EventEmitter();

  locale$: Observable<any>;

  warning = '';
  currentSizeMb = 0;
  files: IFileInfo[] = [];
  initial: IFileInfo[] = [];

  constructor(private locale: BpmLocaleService) {}

  ngOnInit(): void {
    this.initial = cloneDeep(this.initialFiles);
    this.locale$ = this.locale.file();
  }

  uploaded = (event: Event) => {
    const { files } = event.target as HTMLInputElement;
    if (!files.length) return;

    const filesToAdd: IFileInfo[] = [];
    for (let i = 0; i < files.length; i++) {
      const { name, size, type } = files[i];
      filesToAdd.push({
        title: name,
        size,
        type: type || name.substr(name.lastIndexOf('.')),
        blob: files[i],
        page: this.page,
        code: this.code,
      });
    }

    this.currentSizeMb = +(
      filesToAdd.map((f) => f.size).reduce((a, b) => a + b) /
      1024 /
      1024
    ).toFixed(2);
    if (this.currentSizeMb > this.maxMb) {
      this.warning = `Превышено ограничение размера файлов в ${this.maxMb} MB.`;
      return;
    }

    this.filesUploaded.emit(filesToAdd);
  };

  deleted = (event: IFileInfo) => {
    if (!event.id) {
      let index = this.initial.findIndex((x) => x === event);
      if (index > -1) this.initial.splice(index, 1);
    }
    this.fileDeleted.emit(event);
  };
}
