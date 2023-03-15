import { FormControl } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDictionaryItem } from 'projects/shared/services/dictionary.service';

@Component({
  selector: 'app-bpm-product-dialog',
  templateUrl: './bpm-product-dialog.component.html',
  styleUrls: ['./bpm-product-dialog.component.scss'],
})
export class BpmProductDialogComponent implements OnInit {
  product: FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      products?: IDictionaryItem[];
      current?: string;
    }
  ) {}

  ngOnInit(): void {
    this.product = new FormControl(this.data.current);
  }
}
