import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IClientProfile } from 'projects/shared/models/clientProfile';
import { Observable } from 'rxjs';
import { IBpmUser } from 'projects/bpm/src/app/models/bpm-user';
import { Store, select } from '@ngrx/store';
import { IBpmAppState } from 'projects/bpm/src/app/store/bpm';
import { bpmAuthSelectors } from 'projects/bpm/src/app/store/selectors/auth.selectors';
import { BpmBpmService } from '../../services/bpm-bpm.service';
import { BpmJuristService } from '../../services/bpm-jurist.service';

@Component({
  selector: 'app-bpm-urist-boss',
  templateUrl: './bpm-urist-boss.component.html',
  styleUrls: ['./bpm-urist-boss.component.scss'],
})
export class BpmUristBossComponent implements OnInit {
  jurists$: Observable<IClientProfile[]>;
  id: string;
  user$: Observable<IBpmUser>;
  sid: string;
  form: FormGroup;
  applicationTaskId:string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: BpmJuristService,
    private bpmService: BpmBpmService,
    private snackbar: MatSnackBar,
    private store: Store<IBpmAppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.applicationTaskId = this.route.snapshot.paramMap.get('applicationTaskId');
    this.user$ = this.store.pipe(select(bpmAuthSelectors.selectUser));
    this._initializeForm();
    this.jurists$ = this.bpmService.getJuristUsers();
  }

  submit = () => {
    if (
      this.form.get('JuristResultId').value == null ||
      this.form.get('JuristResultId').value == ''
    ) {
      this.snackbar.open('Выберите специалиста!', null, {
        duration: 2500,
      });
    } else {
      this.service.setJurist(this.form.value).subscribe(this._successResponse);
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
      applicationTaskId:[this.applicationTaskId],
      JuristResultId: [''],
    }));
}
