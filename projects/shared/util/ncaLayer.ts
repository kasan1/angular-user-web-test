import { Subject, Observable, Subscription, merge } from 'rxjs';
import { take, takeUntil, map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injector } from '@angular/core';

interface INCALayer {
  signXml: (xml: string) => void;
  authorize: () => void;
  close: () => void;
}

interface INCALayerData {
  code?: string;
  responseObject?: any;
}

class NCALayerFunctionality {
  _layer: INCALayer;
  _status$ = new Subject<boolean>();
  _errors$ = new Subject<Error | { text: string }>();
  _messages$ = new Subject<MessageEvent>();
  _loading$ = new Subject<boolean>();
  _closed$ = new Subject();
  snackbar: MatSnackBar;

  constructor(protected injector: Injector) {
    this.loadingSub = merge(this._closed$, this._errors$)
      .pipe(tap(() => this._loading$.next(false)))
      .subscribe();

    this.snackbar = injector.get(MatSnackBar);
  }

  get loading$() {
    return this._loading$.pipe(takeUntil(this._closed$));
  }

  setLoading(state: boolean) {
    this._loading$.next(state);
  }

  openConnection = () => {
    this._trackErrors();
    this._layer = NCALayer(this._status$, this._errors$, this._messages$);
  };

  authorize = () => this._layer.authorize();
  signXml = (xml: string) => this._layer.signXml(xml);

  closeConnection = () => {
    if (this._layer) {
      this._closed$.next();
      this._layer.close();
      this._layer = null;
    }
  };

  openLayer$ = (callback: Function): Observable<INCALayerData> => {
    this._loading$.next(true);
    this.openConnection();
    this._status$.pipe(take(1)).subscribe((status) => {
      if (status) callback();
    });

    return this._messages$.pipe(takeUntil(this._closed$)).pipe(
      map((message) => {
        const parsed = JSON.parse(message.data);

        if (parseInt(parsed.code) >= 500) {
          this._loading$.next(false);
          return this.closeConnection();
        }

        return parsed;
      })
    );
  };

  _trackErrors = () => {
    if (this.errorSub) this.errorSub.unsubscribe();

    this.errorSub = this._errors$
      .pipe(takeUntil(this._closed$))
      .subscribe((err) => {
        if (err['text'])
          this.snackbar.open(err['text'], 'Продолжить', { duration: 10000 });
        else console.log(err);
      });
  };

  loadingSub: Subscription;
  errorSub: Subscription;
  ngOnDestroy() {
    this.closeConnection();

    this._closed$.complete();
    if (this.loadingSub) this.loadingSub.unsubscribe();
    if (this.errorSub) this.errorSub.unsubscribe();
  }
}

function NCALayer(
  status$: Subject<boolean>,
  errors$: Subject<Error | { text: string }>,
  messages$: Subject<MessageEvent>
): INCALayer {
  const ws = new WebSocket('wss://127.0.0.1:13579/');

  const close = () => ws.close();

  const authorize = () => {
    const data = {
      module: 'kz.gov.pki.knca.commonUtils',
      method: 'getKeyInfo',
      args: ['PKCS12'],
    };
    ws.send(JSON.stringify(data));
  };

  const signXml = (xml: string) => {
    const data = {
      module: 'kz.gov.pki.knca.commonUtils',
      method: 'signXml',
      args: ['PKCS12', 'SIGNATURE', xml, '', ''],
    };

    ws.send(JSON.stringify(data));
  };

  ws.onopen = function () {
    status$.next(true);
    console.info('Connection opened');
  };

  ws.onclose = function (event: CloseEvent) {
    status$.next(false);

    if (event.wasClean) return console.info('Connection closed');

    errors$.next({
      text: 'Ошибка при подключении к NCALayer, запустите NCALayer и попробуйте снова.',
    });
  };

  ws.onerror = function (event: Event) {
    console.log('Error occurred', event);
  };

  ws.onmessage = function (event: MessageEvent) {
    messages$.next(event);
  };

  return { authorize, close, signXml };
}

export default NCALayerFunctionality;
