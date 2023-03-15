import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  @Input() color: string;

  constructor() {}

  ngOnInit(): void {
    if (!this.color) this.color = this._random();
  }

  _random = () => {
    const number = Math.floor(Math.random() * 2) + 1;
    return number > 1 ? 'primary' : 'accent';
  };
}
