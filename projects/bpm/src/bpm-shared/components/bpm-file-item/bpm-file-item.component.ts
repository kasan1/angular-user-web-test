import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { take } from 'rxjs/operators';
import { IFileInfo } from 'projects/shared/models/fileInfo';
import { BpmFileService } from 'projects/bpm/src/app/services/bpm-file.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-file-item',
  templateUrl: './bpm-file-item.component.html',
  styleUrls: ['./bpm-file-item.component.scss'],
})
export class BpmFileItemComponent implements OnInit {
  @Input() file: IFileInfo;
  @Input() locale: any;
  @Input() hasActions = true;

  @Output() deleted: EventEmitter<IFileInfo> = new EventEmitter();

  constructor(private service: BpmFileService) {}

  ngOnInit(): void {}

  size = () => {
    if (!this.file) return;

    const { size } = this.file;

    return size < 1024
      ? `${size} bytes`
      : size < 1048576
      ? `${(size / 1024).toFixed(1)} kb`
      : `${(size / 1024 / 1024).toFixed(1)} mb`;
  };

  getFile = (download = false) => {
    if (this.file.id)
      return this.service
        .file(this.file.id)
        .pipe(take(1))
        .subscribe((x) => {
          const blob = new Blob([x], {
            type: this.file.type || 'application/octet-stream',
          });

          this._file(blob, download);
        });

    this._file(this.file.blob, download);
  };

  _file = (blob: Blob, download: boolean) => {
    const url = URL.createObjectURL(blob);

    if (download) {
      const element = document.createElement('a');
      element.href = url;
      element.target = '_blank';
      element.download = this.file.title;
      element.click();
    } else
      window.open(
        url,
        '_blank',
        `width=${screen.width / 2},height=${screen.height - 150},top=70,left=${
          screen.width / 2
        }right=100`
      );
  };

  delete = () => this.deleted.emit(this.file);
}
