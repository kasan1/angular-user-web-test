import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FinAnalysisService } from 'projects/shared/services/finAnalysis.service';
import { environment } from '../../environments/environment';

@Injectable()
export class OkapsFinAnalysisService extends FinAnalysisService {
  constructor(http: HttpClient) {
    super(`${environment.sharedUrl}`, http);
  }
}
