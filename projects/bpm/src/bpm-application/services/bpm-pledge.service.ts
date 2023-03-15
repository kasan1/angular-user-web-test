import { PledgeService } from 'projects/shared/services/pledge.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class BpmPledgeService extends PledgeService {
  constructor(http: HttpClient) {
    super(`${environment.sharedUrl}`, http);
  }
}
