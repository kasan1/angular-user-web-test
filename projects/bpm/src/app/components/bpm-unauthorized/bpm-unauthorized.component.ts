import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-bpm-unauthorized',
  templateUrl: './bpm-unauthorized.component.html',
  styleUrls: ['./bpm-unauthorized.component.scss'],
})
export class BpmUnauthorizedComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
