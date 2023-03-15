import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CreditAdminService } from 'projects/shared/services/creditAdmin.service';

@Injectable()
export class BPMCreditAdminService extends CreditAdminService {

    constructor(http: HttpClient) {
        super(`${environment.sharedUrl}`, http);
    }
}
