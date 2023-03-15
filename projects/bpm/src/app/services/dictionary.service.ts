import { DictionaryService } from 'projects/shared/services/dictionary.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BpmDictionaryService extends DictionaryService {
  constructor(http: HttpClient) {
    super(`${environment.adminUrl}`, http);
  }
}
