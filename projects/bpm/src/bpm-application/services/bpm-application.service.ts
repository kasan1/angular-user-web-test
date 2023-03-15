import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApplicationService } from 'projects/shared/services/application.service';

@Injectable()
export class BpmApplicationService extends ApplicationService {
  constructor(http: HttpClient) {
    super(`${environment.sharedUrl}`, http);
  }
}
