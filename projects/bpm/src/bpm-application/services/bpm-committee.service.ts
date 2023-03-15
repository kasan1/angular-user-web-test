import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CommitteeService } from 'projects/shared/services/committee.service';

@Injectable()
export class BPMCommitteeService extends CommitteeService {

    constructor(http: HttpClient) {
        super(`${environment.sharedUrl}`, http);
    }
}
