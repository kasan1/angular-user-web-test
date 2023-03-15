import { IBpmUser } from './../../../app/models/bpm-user';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { bpmAuthSelectors } from 'projects/bpm/src/app/store/selectors/auth.selectors';
import { select, Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { IClientProfile } from 'projects/shared/models/clientProfile';
import { BpmBpmService } from '../../services/bpm-bpm.service';
import { BpmJuristService } from '../../services/bpm-jurist.service';

@Component({
  selector: 'app-bpm-pledge-boss',
  templateUrl: './bpm-pledge-boss.component.html',
  styleUrls: ['./bpm-pledge-boss.component.scss'],
})
export class BpmPledgeBossComponent implements OnInit {
  pExperts$: Observable<IClientProfile[]>;
  id: string;
  user$: Observable<IBpmUser>;
  sid: string;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private juristService: BpmJuristService,
    private bpmService: BpmBpmService,
    private snackbar: MatSnackBar,
    private store: Store<IBpmAppState>,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.user$ = this.store.pipe(select(bpmAuthSelectors.selectUser));
    this._initializeForm();
    this.pExperts$ = this.bpmService.getEPledgeUsers();
  }

  submit = () => {
    if (
      this.form.get('pledgeExpertId').value == null ||
      this.form.get('pledgeExpertId').value == ''
    ) {
      this.snackbar.open('Выберите специалиста!', null, {
        duration: 2500,
      });
    } else {
      this.juristService
        .setPledgeExpert(this.form.value)
        .subscribe(this._successResponse);
    }
  };
  _successResponse = (x: string) => {
    this.snackbar.open('Заявка успешно отправлена!', null, {
      duration: 2500,
    });
    this.router.navigate([`/applicationList`]);
  };

  _initializeForm = () =>
    (this.form = this.fb.group({
      applicationId: [this.id],
      pledgeExpertId: [''],
    }));
}
