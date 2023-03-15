import { Injectable } from '@angular/core';
import { LocaleService } from 'projects/shared/services/locale.service';

@Injectable()
export class BpmAdminLocaleService extends LocaleService {
  adminRegister = () => this.locale(paths.adminRegister);
}

const paths = {
  adminRegister: './assets/bpm-admin-register.json',
};
