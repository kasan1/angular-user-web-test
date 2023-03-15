import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogData) {}

  ngOnInit(): void {}
}

export interface IDialogData {
  title: string;
  text: string;
}
