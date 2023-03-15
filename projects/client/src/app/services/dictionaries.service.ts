import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IResponse, IDictionaryBase } from '../models/common.model';
import {
  IGetManufacturersParams,
  IGetSuppliersParams,
  IGetTechModelsParams,
  IGetTechProductsParams,
  IGetTechTypesParams,
} from '../models/dictionary.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class DictionariesService {
  private readonly baseUrl = `${environment.sharedUrl}/Dictionary`;

  constructor(private http: HttpClient, public snackbar: MatSnackBar) {}

  showErrorMessage(err?: any) {
    let errorMessage = 'По выбранному справочнику элементов не найдено';
    if (err) {
      errorMessage = 'Произошла ошибка, пожалуйста обратитесь к администратору';

      if (err.error && err.error.Message) errorMessage = err.error.Message;
    }

    this.snackbar.open(errorMessage, 'Закрыть', {
      duration: 5000,
    });
  }

  private async getDictionary(
    code: string,
    params: object = {}
  ): Promise<IResponse<{ list: IDictionaryBase[]; count: number }>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      httpParams = httpParams.append(key, params[key]);
    });

    try {
      return await this.http
        .get<IResponse<{ list: IDictionaryBase[]; count: number }>>(
          `${this.baseUrl}/${code}`,
          { params: httpParams }
        )
        .toPromise();
    } catch (ex) {
      this.showErrorMessage(ex);
    }
  }

  async getTechTypes(params: IGetTechTypesParams) {
    return await this.getDictionary('techtypes', params);
  }

  async getTechProducts(params: IGetTechProductsParams) {
    return await this.getDictionary('techproducts', params);
  }

  async getTechModels(params: IGetTechModelsParams) {
    return await this.getDictionary('techmodels', params);
  }

  async getManufacturers(params: IGetManufacturersParams) {
    return await this.getDictionary('countries', params);
  }

  async getSuppliers(params: IGetSuppliersParams) {
    return await this.getDictionary('providers', params);
  }

  async getOwnershipForms() {
    return await this.getDictionary('ownershipForm');
  }

  async getOked() {
    return await this.getDictionary('oked');
  }

  async getMarriageStatuses() {
    return await this.getDictionary('mariageStatus');
  }

  async getOrganisationTypes() {
    return await this.getDictionary('organizationType');
  }

  async getOwnershipTypes() {
    return await this.getDictionary('ownershipType');
  }

  async getLandTypes() {
    return await this.getDictionary('landType');
  }

  async getLivestockTypes() {
    return await this.getDictionary('livestockType');
  }

  async getFloraCultures() {
    return await this.getDictionary('floraCulture');
  }

  async getCountries() {
    return await this.getDictionary('country');
  }

  async getRegions() {
    return await this.getDictionary('region');
  }

  async getTaxTreatments() {
    return await this.getDictionary('taxTreatment');
  }

  async getLegalForms() {
    return await this.getDictionary('legalForm');
  }

  async getSubjectOfEntrepreneurs() {
    return await this.getDictionary('subjectOfEntrepreneur');
  }

  async getProvisioningTypes() {
    return await this.getDictionary('provisionType');
  }

  async getProvisioningDescriptions() {
    return await this.getDictionary('provisionDescription');
  }
}
