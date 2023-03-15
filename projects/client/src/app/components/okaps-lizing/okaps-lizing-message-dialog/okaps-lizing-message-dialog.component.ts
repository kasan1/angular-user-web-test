import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-okaps-lizing-message-dialog',
  templateUrl: './okaps-lizing-message-dialog.component.html',
  styleUrls: ['./okaps-lizing-message-dialog.component.scss'],
})
export class OkapsLizingMessageDialogComponent implements OnInit {
  maxSum: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {
    this.maxSum = data;
  }

  ngOnInit(): void {}
}
