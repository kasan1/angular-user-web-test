import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IResponse } from '../models/common.model';
import { ICalculatorInput, ICalculatorResult } from '../models/lizing.model';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  private readonly baseUrl = `${environment.sharedUrl}/Calculator`;

  constructor(private http: HttpClient) {}

  async calculate(
    calculatorInput: ICalculatorInput
  ): Promise<IResponse<ICalculatorResult>> {
    return this.http
      .post<IResponse<ICalculatorResult>>(
        `${this.baseUrl}/calculate`,
        calculatorInput
      )
      .toPromise();
  }
}
