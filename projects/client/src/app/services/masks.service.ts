import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MasksService {
  constructor() {}

  iinMask() {
    return [
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ];
  }
}
