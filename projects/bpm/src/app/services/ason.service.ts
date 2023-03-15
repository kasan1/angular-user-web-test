import { HttpClient } from '@angular/common/http';
import { AsonService } from 'projects/shared/services/ason.service';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BpmAsonService extends AsonService {
  constructor(http: HttpClient) {
    super(`${environment.integrationUrl}`, http);
  }
}
