import {
  INameIdPair,
  IAsonResultEntry,
} from './../../../../../shared/services/ason.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BpmAsonService } from 'projects/bpm/src/app/services/ason.service';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { IAsonResult } from 'projects/shared/services/ason.service';
import {
  take,
  takeUntil,
  map,
  catchError,
  tap,
  switchMap,
} from 'rxjs/operators';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { fadeInOutTrigger } from 'projects/shared/util/triggers';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { sortBy } from 'lodash';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bpm-ason-dialog',
  templateUrl: './bpm-ason-dialog.component.html',
  styleUrls: ['./bpm-ason-dialog.component.scss'],
  animations: [fadeInOutTrigger],
})
export class BpmAsonDialogComponent implements OnInit, OnDestroy {
  types$ = new BehaviorSubject<INameIdPair[]>(null);
  level1$ = new BehaviorSubject<IAsonResult>(null);
  level2$ = new BehaviorSubject<IAsonResult>(null);
  level3$ = new BehaviorSubject<IAsonResult>(null);
  level4$ = new BehaviorSubject<IAsonResult>(null);
  level5$ = new BehaviorSubject<IAsonResult>(null);

  loading$ = new BehaviorSubject<boolean>(true);

  ngDestroyed$ = new Subject();

  form: FormGroup;

  constructor(
    private service: BpmAsonService,
    private fb: FormBuilder,
    private ref: MatDialogRef<BpmAsonDialogComponent>,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._initializeForm();

    this.service
      .ats()
      .pipe(
        take(1),
        switchMap((x) =>
          this.service.atsTypes().pipe(
            map((types) => {
              this.types$.next(types);
              this.level1$.next(x);
              this.loading$.next(false);
            })
          )
        ),
        catchError(() => () => this._handleError())
      )
      .subscribe();

    this.level1()
      .valueChanges.pipe(
        takeUntil(this.ngDestroyed$),
        switchMap((x: IAsonResultEntry) => {
          this.level2$.next(null);
          this.level3$.next(null);
          this.level4$.next(null);
          this.level5$.next(null);

          return this._atsRequest(x, this.level2$, [
            this.level2(),
            this.level3(),
            this.level4(),
            this.level5(),
          ]);
        })
      )
      .subscribe();

    this.level2()
      .valueChanges.pipe(
        takeUntil(this.ngDestroyed$),
        switchMap((x: IAsonResultEntry) => {
          this.level3$.next(null);
          this.level4$.next(null);
          this.level5$.next(null);

          return this._atsRequest(x, this.level3$, [
            this.level3(),
            this.level4(),
            this.level5(),
          ]);
        })
      )
      .subscribe();

    this.level3()
      .valueChanges.pipe(
        takeUntil(this.ngDestroyed$),
        switchMap((x: IAsonResultEntry) => {
          this.level4$.next(null);
          this.level5$.next(null);

          return this._atsRequest(x, this.level4$, [
            this.level4(),
            this.level5(),
          ]);
        })
      )
      .subscribe();

    this.level4()
      .valueChanges.pipe(
        takeUntil(this.ngDestroyed$),
        switchMap((x: IAsonResultEntry) => {
          this.level5$.next(null);

          return this._atsRequest(x, this.level5$, [this.level5()]);
        })
      )
      .subscribe();

    this.level5()
      .valueChanges.pipe(
        takeUntil(this.ngDestroyed$),
        switchMap((x: IAsonResultEntry) => this._atsRequest(x))
      )
      .subscribe();
  }

  result = () => {
    const l1 = this.level1().value;
    const l2 = this.level2().value;
    const l3 = this.level3().value;
    const l4 = this.level4().value;
    const l5 = this.level5().value;

    const values = [l5, l4, l3, l2, l1];
    for (let i = 0; i < values.length; i++)
      if (values[i] && this.form.get('geonimId').value == values[i].id) {
        const ats = values[i + 1];
        this.form.get('atsId').setValue(ats.id);
        this.form.get('cato').setValue(ats.cato);

        break;
      }

    const l1Item =
      this.level1$.value && l1
        ? this.level1$.value.all.find((x) => x.id == l1.id)
        : null;
    const l2Item =
      this.level2$.value && l2
        ? this.level2$.value.all.find((x) => x.id == l2.id)
        : null;
    const l3Item =
      this.level3$.value && l3
        ? this.level3$.value.all.find((x) => x.id == l3.id)
        : null;
    const l4Item =
      this.level4$.value && l4
        ? this.level4$.value.all.find((x) => x.id == l4.id)
        : null;
    const l5Item =
      this.level5$.value && l5
        ? this.level5$.value.all.find((x) => x.id == l5.id)
        : null;

    if (l1Item) l1Item['typeF'] = this._type(l1Item.type);
    if (l2Item) l2Item['typeF'] = this._type(l2Item.type);
    if (l3Item) l3Item['typeF'] = this._type(l3Item.type);
    if (l4Item) l4Item['typeF'] = this._type(l4Item.type);
    if (l5Item) l5Item['typeF'] = this._type(l5Item.type);

    const result = {
      level1: l1 ? l1.id : 0,
      level2: l2 ? l2.id : 0,
      level3: l3 ? l3.id : 0,
      level4: l4 ? l4.id : 0,
      level5: l5 ? l5.id : 0,
      atsId: this.form.get('atsId').value || 0,
      geonimId: this.form.get('geonimId').value || 0,
      cato: this.form.get('cato').value || null,
    };

    const address = `${l1Item ? `${l1Item['typeF']} ${l1Item.name}` : ''}${
      l2Item ? `, ${l2Item['typeF']} ${l2Item.name}` : ''
    }${l3Item ? `, ${l3Item['typeF']} ${l3Item.name}` : ''}${
      l4Item ? `, ${l4Item['typeF']} ${l4Item.name}` : ''
    }${l5Item ? `, ${l5Item['typeF']} ${l5Item.name}` : ''}`;

    result['address'] = address;
    this.ref.close(result);
  };

  level1 = () => this.form.get('level1');
  level2 = () => this.form.get('level2');
  level3 = () => this.form.get('level3');
  level4 = () => this.form.get('level4');
  level5 = () => this.form.get('level5');

  _initializeForm = () => {
    this.form = this.fb.group({
      atsId: [0],
      cato: [null],
      geonimId: [0],
      level1: [0],
      level2: [0],
      level3: [0],
      level4: [0],
      level5: [0],
      address: [''],
    });
  };

  _handleError = () => {
    {
      this.snackbar.open('Не удалось получить данные с АСОН');
      this.loading$.next(false);
      return of(null);
    }
  };

  _atsRequest = (
    x: IAsonResultEntry,
    level: BehaviorSubject<IAsonResult> = null,
    controls: AbstractControl[] = []
  ) => {
    controls.forEach((c) => c.setValue(null, { emitEvent: false }));
    this.loading$.next(true);

    return !x
      ? of(null).pipe(tap(() => this.loading$.next(false)))
      : this.service.ats(x.id).pipe(
          take(1),
          switchMap((r) =>
            this._geonimIfEmpty(r, x).pipe(
              map((g) => {
                this.loading$.next(false);

                if (level) level.next(g);
              })
            )
          ),
          catchError(() => this._handleError())
        );
  };

  _geonimIfEmpty = (x: IAsonResult, e: IAsonResultEntry) =>
    x && x.all && x.all.length
      ? of(x).pipe(
          map((u) => {
            u.all = sortBy(u.all, 'name');
            return u;
          })
        )
      : this.service.geonim(e.id).pipe(
          map((r) => {
            if (!r.length) this.form.get('geonimId').setValue(e.id);

            return r.length
              ? {
                  types: 'Улица',
                  all: sortBy(r, 'name').map((i) => ({
                    name: i.name,
                    id: i.id,
                    type: -1,
                    cato: null,
                  })),
                }
              : null;
          })
        );

  _type = (x: number) => {
    if (x == -1) return 'УЛИЦА';

    const item = this.types$.value
      ? this.types$.value.find((v) => v.id == x)
      : null;
    return item ? item.name : null;
  };

  ngOnDestroy() {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }
}
