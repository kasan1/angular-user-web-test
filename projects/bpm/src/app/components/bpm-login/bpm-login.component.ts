import {
  Component,
  OnInit,
  OnDestroy,
  Optional,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IBpmAppState } from '../../store/bpm';
import { bpmAuthSelectors } from '../../store/selectors/auth.selectors';
import { bpmAuthActions } from '../../store/auth';
import { BpmLocaleService } from '../../services/locale.service';
import { fadeInTrigger } from 'projects/shared/util/triggers';
import { iinValidator } from 'projects/shared/validators/iin.validator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-bpm-login',
  templateUrl: './bpm-login.component.html',
  styleUrls: ['./bpm-login.component.scss'],
  animations: [fadeInTrigger],
})
export class BpmLoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  ngDestroyed$ = new Subject();
  locale$: Observable<any>;
  loading$: Observable<boolean>;

  _loginMessage: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private store: Store<IBpmAppState>,
    private locale: BpmLocaleService,
    @Optional() public ref: MatDialogRef<BpmLoginComponent>
  ) {}

  ngOnInit() {
    this._initializeForm();
    this.loading$ = this.store.pipe(
      select(bpmAuthSelectors.selectAuth),
      map((auth) => auth.loading)
    );
    this.locale$ = this.locale.login().pipe(
      map((x) => {
        this._loginMessage = x['loginMessage'];
        return x;
      })
    );
  }

  submit = () => {
    if (!this.form.valid) return;

    this.store.dispatch(bpmAuthActions.loggingIn());
    this.store.dispatch(bpmAuthActions.login(this.form.value));
    this.store
      .pipe(
        takeUntil(this.ngDestroyed$),
        select(bpmAuthSelectors.selectUser),
        map((user) => {
          if (user) {
            this.snackbar.open(this._loginMessage, null, { duration: 1000 });
            if (this.route.snapshot.queryParamMap.has('returnUrl')) {
              this.router.navigate([
                this.route.snapshot.queryParamMap.get('returnUrl'),
              ]);
              if (this.ref) this.ref.close();
            } else {
              if (this.ref) this.ref.close();
              else this.router.navigate(['/']);
            }
          }
        })
      )
      .subscribe();
  };

  login = () => this.form.get('login');

  _initializeForm = () => {
    this.form = this.fb.group({
      login: ['', iinValidator()],
      password: ['', Validators.required],
    });
  };

  ngOnDestroy() {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }
}
