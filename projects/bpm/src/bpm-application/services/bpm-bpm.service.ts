import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { BpmService } from 'projects/shared/services/bpm.service';

@Injectable()
export class BpmBpmService extends BpmService {
  constructor(http: HttpClient) {
    super(`${environment.sharedUrl}`, http);
  }
}
