import {
  Component,
  OnInit,
  NgModule,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SharedModule } from 'projects/shared/shared.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { iinValidator } from 'projects/shared/validators/iin.validator';
import { BpmAdminLocaleService } from 'projects/bpm/src/admin/services/bpm-admin.locale.service';
import { Observable, Subject } from 'rxjs';
import { fadeInOutTrigger } from 'projects/shared/util/triggers';
import { passwordValidator } from 'projects/shared/validators/password.validator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-bpm-admin-register',
  templateUrl: './bpm-admin-register.component.html',
  styleUrls: ['./bpm-admin-register.component.scss'],
  animations: [fadeInOutTrigger],
})
export class LazyBpmAdminRegisterComponent implements OnInit {
  form: FormGroup;
  locale$: Observable<any>;

  constructor(private fb: FormBuilder, private locale: BpmAdminLocaleService) {}

  ngOnInit(): void {
    this._initializeForm();

    this.locale$ = this.locale.adminRegister();
  }

  submit = () => console.log(this.form.value);

  iin = () => this.form.get('iin');
  password = () => this.form.get('password');
  confirmPassword = () => this.form.get('confirmPassword');

  _initializeForm = () => {
    this.form = this.fb.group({
      email: ['', Validators.required],
      iin: ['', iinValidator()],
      password: ['', [Validators.required, passwordValidator(8)]],
      confirmPassword: ['', Validators.required],

      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],

      phone: ['', Validators.required],
      position: [0, Validators.min(1)],
      organization: [0, Validators.min(1)],
    });
  };
}

@NgModule({
  declarations: [LazyBpmAdminRegisterComponent],
  imports: [SharedModule],
})
class AdminRegisterModule {}
