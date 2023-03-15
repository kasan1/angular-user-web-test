import { FileService } from 'projects/shared/services/file.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BpmFileService extends FileService {
  constructor(http: HttpClient) {
    super(`${environment.sharedUrl}`, http);
  }
}
