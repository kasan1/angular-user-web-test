import { HttpClient } from '@angular/common/http';

export class AsonService {
  constructor(protected url: string, protected http: HttpClient) {}

  ats = (id = 1) =>
    this.http.get<IAsonResult>(`${this.url}/PLDG/GetAts?id=${id}`);

  atsTypes = () => this.http.get<INameIdPair[]>(`${this.url}/PLDG/GetAtsTypes`);

  geonim = (id: number) =>
    this.http.get<INameIdPair[]>(`${this.url}/PLDG/GetGeonim?id=${id}`);

  propertyPrice = (request: IPropertyPriceRequest) =>
    this.http.post<IPropertyPriceResponse>(
      `${this.url}/PLDG/GetPropertyPrice`,
      request
    );

  wallMaterials = () =>
    this.http.get<INameIdPair[]>(`${this.url}/PLDG/GetWallMaterials`);
}

export interface IAsonResult {
  all: IAsonResultEntry[];
  types: string;
}

export interface INameIdPair {
  id: number;
  name: string;
}

export interface IAsonResultEntry {
  id: number;
  type: number;
  name: string;
  cato: string;
}

export interface IPropertyPriceRequest {
  geonimId: number;
  atsId: number;
  houseNumber: string;
  realtyType: number;
  roomNumber: number;
  yearBuilt: number;
  totalSquare: number;
  wallMaterial: number;
}

export interface IPropertyPriceResponse {
  totalSum: number;
  squarePrice: number;
  priceType: PriceType;
}

export enum PriceType {
  /// Сумма исходя из стоимости за кв.м.
  MultiplySquare = 1,

  /// Общая сумма
  All = 2,

  /// Не вернул цену, в соответствие с бизнес логикой необходимо сохранить залог и установить возможность продолжить.
  /// Не смотря на то, что продолжить можно только с ценой залога более 1.3млн
  NoResult = 3,
}
