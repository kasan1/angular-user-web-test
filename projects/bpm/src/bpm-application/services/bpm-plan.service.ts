import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlanService } from 'projects/shared/services/plan.service';
import { environment } from '../../environments/environment';

@Injectable()
export class BpmPlanService extends PlanService {
  constructor(http: HttpClient) {
    super(`${environment.sharedUrl}`, http);
  }
}
