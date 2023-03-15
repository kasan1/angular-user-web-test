import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IAttachment, IList, IResponse } from '../models/common.model';
import {
  ICreateLizingApplicationFormValues,
  ILizingContractResponse,
} from '../models/lizing.model';
import { IClientDetails, IClientExtraDetails } from '../models/client.model';
import { IAssets } from '../models/assets.model';
import {
  IContractListItem,
  ILoanApplication,
} from '../models/application.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private readonly baseUrl = `${environment.sharedUrl}/LoanApplication`;

  constructor(private http: HttpClient) {}

  async createLizingApplication(
    formData: ICreateLizingApplicationFormValues
  ): Promise<IResponse<null>> {
    return this.http
      .post<IResponse<null>>(`${this.baseUrl}/temp`, formData)
      .toPromise();
  }

  async updateLizingApplication(
    formData: ICreateLizingApplicationFormValues
  ): Promise<IResponse<null>> {
    return this.http
      .put<IResponse<null>>(`${this.baseUrl}/update`, formData)
      .toPromise();
  }

  async getApplications(
    page: number,
    pageLimit: number
  ): Promise<IResponse<IList<ILoanApplication>>> {
    return this.http
      .get<IResponse<IList<ILoanApplication>>>(
        `${this.baseUrl}?page=${page}&pageLimit=${pageLimit}`
      )
      .toPromise();
  }

  async removeApplication(id: string): Promise<IResponse<null>> {
    return this.http
      .delete<IResponse<null>>(`${this.baseUrl}/${id}`)
      .toPromise();
  }

  async getApplicationContracts(
    loanApplicationId: string
  ): Promise<IResponse<ILizingContractResponse[]>> {
    return this.http
      .get<IResponse<ILizingContractResponse[]>>(
        `${this.baseUrl}/${loanApplicationId}/contracts`
      )
      .toPromise();
  }

  async getClientDetails(
    loanApplicationId: string
  ): Promise<IResponse<IClientDetails>> {
    return this.http
      .get<IResponse<IClientDetails>>(
        `${this.baseUrl}/${loanApplicationId}/details`
      )
      .toPromise();
  }

  async createClientDetails(
    loanApplicationId: string,
    data: IClientDetails
  ): Promise<IResponse<null>> {
    return this.http
      .post<IResponse<null>>(
        `${this.baseUrl}/${loanApplicationId}/details`,
        data
      )
      .toPromise();
  }

  async updateClientDetails(
    loanApplicationId: string,
    data: IClientDetails
  ): Promise<IResponse<null>> {
    return this.http
      .put<IResponse<null>>(
        `${this.baseUrl}/${loanApplicationId}/details`,
        data
      )
      .toPromise();
  }

  async addOrUpdateAssets(
    loanApplicationId: string,
    data: IAssets
  ): Promise<IResponse<null>> {
    return this.http
      .post<IResponse<null>>(
        `${this.baseUrl}/${loanApplicationId}/activities`,
        data
      )
      .toPromise();
  }

  async getAssets(loanApplicationId: string): Promise<IResponse<IAssets>> {
    return this.http
      .get<IResponse<IAssets>>(
        `${this.baseUrl}/${loanApplicationId}/activities`
      )
      .toPromise();
  }

  async addOrUpdateClientExtraDetails(
    loanApplicationId: string,
    data: IClientExtraDetails
  ): Promise<IResponse<null>> {
    return this.http
      .post<IResponse<null>>(
        `${this.baseUrl}/${loanApplicationId}/details/extra`,
        data
      )
      .toPromise();
  }

  async getClientExtraDetails(
    loanApplicationId: string
  ): Promise<IResponse<IClientExtraDetails>> {
    return this.http
      .get<IResponse<IClientExtraDetails>>(
        `${this.baseUrl}/${loanApplicationId}/details/extra`
      )
      .toPromise();
  }

  async signAndStartProcess(
    loanApplicationId: string,
    xml: string
  ): Promise<IResponse<null>> {
    return this.http
      .post<IResponse<null>>(`${this.baseUrl}/${loanApplicationId}/sign`, {
        xml,
      })
      .toPromise();
  }

  async getAllAttachments(): Promise<IResponse<IAttachment[]>> {
    return this.http.get<IResponse<null>>(`${this.baseUrl}/files`).toPromise();
  }

  getAllContracts = (page: number, pageLimit: number) =>
    this.http.get<IResponse<IList<IContractListItem>>>(
      `${this.baseUrl}/contracts?page=${page}&pageLimit=${pageLimit}`
    );
}
