import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IConfirmDialogContent } from '../../models/common.model';

@Component({
  selector: 'app-okaps-comfirm-dialog',
  templateUrl: './okaps-comfirm-dialog.component.html',
  styleUrls: ['./okaps-comfirm-dialog.component.scss'],
})
export class OkapsComfirmDialogComponent implements OnInit {
  title: string;
  contentText: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<OkapsComfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: IConfirmDialogContent
  ) {
    this.title = data.title;
    this.contentText = data.contentText;
  }

  ngOnInit(): void {}

  onBtnClick(confirmed: boolean) {
    this.dialogRef.close(confirmed);
  }
}
