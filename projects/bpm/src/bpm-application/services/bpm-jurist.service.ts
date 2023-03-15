import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { JuristService } from 'projects/shared/services/jurist.service';

@Injectable()
export class BpmJuristService extends JuristService {
  constructor(http: HttpClient) {
    super(`${environment.sharedUrl}`, http);
  }
}
