import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class LocaleService {
  constructor(protected http: HttpClient) {}

  certificate = () => this.locale(paths.certificate);
  file = () => this.locale(paths.file);

  public switchLocale = (type: LocaleType) => {
    localStorage.setItem('lang', type);
    LocaleSignal.signal$.next(type);
  };

  protected locale = (path: string) =>
    LocaleSignal.signal$.pipe(
      switchMap((x) => this.http.get<Locale>(path).pipe(map((l) => l[x])))
    );
}

export type LocaleType = 'ru' | 'kz';

type Locale = {
  [key in LocaleType]: { [key: string]: string };
};

const paths = {
  certificate: './assets/certificate.json',
  file: './assets/file.json',
};

export class LocaleSignal {
  public static readonly signal$ = new BehaviorSubject<LocaleType>(
    ['kz', 'ru'].indexOf(localStorage.getItem('lang')) > -1
      ? (localStorage.getItem('lang') as LocaleType)
      : 'ru'
  );
}
