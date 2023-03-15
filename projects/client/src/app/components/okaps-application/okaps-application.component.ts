import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { Subscription } from 'rxjs';
import { LizingType } from '../../models/lizing.model';
import { clearAllContracts } from '../../store/lizing';
import { IOkapsAppState } from '../../store/okaps';

@Component({
  selector: 'app-okaps-application',
  templateUrl: './okaps-application.component.html',
  styleUrls: ['./okaps-application.component.scss'],
})
export class OkapsApplicationComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  isLizingSubmitted = false;
  isLizingSubmittedSubscription: Subscription;

  loanId: any;
  loanType: LizingType;
  assetsTabVisible = false;
  assetsTabEnabled = false;
  extraDetailsVisible = false;
  extraDetailsTabEnabled = false;
  lizingTabEnabled = false;

  selected = new FormControl(0);

  get signTabEnabled() {
    return this.assetsTabEnabled && this.lizingTabEnabled;
  }

  constructor(
    private store: Store<IOkapsAppState>,
    public dialogService: MatDialog,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.activateRoute.params.subscribe(
      (params) => (this.loanId = params['id'])
    );

    this.isLizingSubmittedSubscription = this.store
      .select((state: IOkapsAppState) => state)
      .subscribe((data) => {
        this.assetsTabEnabled = !isEmpty(data.client?.details?.id);
        this.extraDetailsTabEnabled = !isEmpty(data.client?.details?.id);
        this.assetsTabVisible =
          data.client?.details?.loanType === LizingType.Express;
        this.extraDetailsVisible =
          data.client?.details?.loanType === LizingType.Standard;
        this.lizingTabEnabled =
          !isEmpty(data.assets?.id) || !isEmpty(data.clientExtraDetails?.id);
        this.isLizingSubmitted = data.lizing.submitted;
      });
  }

  ngOnDestroy(): void {
    if (!this.isLizingSubmitted) {
      this.store.dispatch(clearAllContracts());
    }
    this.isLizingSubmittedSubscription.unsubscribe();
  }

  // Arrow function is necessary to bind 'this' context
  openNextTab = (): void => {
    this.selected.setValue(this.selected.value + 1);
  };
}
