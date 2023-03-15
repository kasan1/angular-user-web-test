import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocaleService } from 'projects/shared/services/locale.service';

@Injectable({ providedIn: 'root' })
export class BpmLocaleService extends LocaleService {
  constructor(http: HttpClient) {
    super(http);
  }

  login = () => this.locale(paths.login);
  register = () => this.locale(paths.register);
  navigation = () => this.locale(paths.navigation);
}

const paths = {
  login: './assets/bpm-login.json',
  register: './assets/bpm-register.json',
  navigation: './assets/bpm-navigation.json',
};
