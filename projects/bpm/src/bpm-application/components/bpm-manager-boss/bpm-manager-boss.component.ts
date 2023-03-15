import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BpmApplicationService } from '../../services/bpm-application.service';
import { BPMCommitteeService } from '../../services/bpm-committee.service';
import { IJuristComment } from 'projects/shared/services/jurist.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bpm-manager-boss',
  templateUrl: './bpm-manager-boss.component.html',
  styleUrls: ['./bpm-manager-boss.component.scss'],
})
export class BpmManagerBossComponent implements OnInit {
  id: string;
  applicationTaskId: string;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private committeeService: BPMCommitteeService,
    private snackbar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder,
    private service: BpmApplicationService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.applicationTaskId = this.route.snapshot.paramMap.get(
      'applicationTaskId'
    );
    this._initializeForm();
  }

  _initializeForm = () =>
    (this.form = this.fb.group({
      appTaskId: [this.applicationTaskId],
      comment: [''],
      decision: [''],
    }));

  send = (decision: string) => {
    this.form.get('decision').setValue(decision);
    this.service
      .managerBossSend(this.form.value)
      .subscribe(this._successResponse);
  };

  _successResponse = (x: string) => {
    this.snackbar.open('Заявка успешно отправлена!', null, {
      duration: 2500,
    });
    this.router.navigate([`/applicationList`]);
  };
}
