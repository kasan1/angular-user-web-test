import { HttpClient } from '@angular/common/http';

export class CommitteeService {
  constructor(protected url: string, protected http: HttpClient) {}

  committeeSet = (request: {
    applicationId: string;
    applicationTaskId: string;
    accept: boolean;
  }) =>
    this.http.post<number>(`${this.url}/CreditCommittee/Set`, request);

  userResult = (applicationId: string) =>
    this.http.get<ICreditCommitteeResult>(
      `${this.url}/CreditCommittee/GetCurrentUserResult/` + applicationId
    );

  decision = (applicationId: string) =>
    this.http.get<ICreditCommitteeDecision[]>(
      `${this.url}/CreditCommittee/Decision/` + applicationId
    );

  isAccept = (applicationId: string) =>
    this.http.get<boolean>(
      `${this.url}/CreditCommittee/GetIsAccept/` + applicationId
    );
}

export interface ICreditCommitteeResult {
  applicationId: string;
  applicationTaskId: string;
  accept: boolean;
}

export interface ICreditCommitteeDecision {
  applicationId: string;
  userId: string;
  fullName: string;
  accept: boolean;
}
