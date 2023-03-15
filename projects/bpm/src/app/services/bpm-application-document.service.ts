import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationDocumentService } from 'projects/shared/services/application-document.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BpmApplicationDocumentService extends ApplicationDocumentService {
  constructor(http: HttpClient) {
    super(`${environment.sharedUrl}`, http);
  }
}
