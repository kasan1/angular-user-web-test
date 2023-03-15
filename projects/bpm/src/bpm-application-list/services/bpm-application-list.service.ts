import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApplicationService } from 'projects/shared/services/application.service';

@Injectable()
export class BpmApplicationListService extends ApplicationService {
  constructor(http: HttpClient) {
    super(`${environment.sharedUrl}`, http);
  }
}
