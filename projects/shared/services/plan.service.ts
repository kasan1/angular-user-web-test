import { HttpClient } from '@angular/common/http';

export class PlanService {
  constructor(protected url: string, protected http: HttpClient) {}

  plans = (appId: string) =>
    this.http.get<IPlan[]>(`${this.url}/BP/Plans/${appId}`);
}

export interface IPlan {
  id: string;

  sum: number;
  animalCount: number;
  acitivyTypeId: string;
}
