import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dialog-title',
  templateUrl: './dialog-title.component.html',
  styleUrls: ['./dialog-title.component.scss'],
})
export class DialogTitleComponent implements OnInit {
  @Input() title: string;
  @Input() readonly: boolean;

  constructor() {}

  ngOnInit(): void {}
}
