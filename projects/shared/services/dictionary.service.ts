import { HttpClient } from '@angular/common/http';
import { IKatoRow, IKatoRowTree } from '../models/katoRow';

export class DictionaryService {
  constructor(protected url: string, protected http: HttpClient) { }

  dictionaryItems = (name: string) =>
    this.http.get<IDictionaryItem[]>(
      `${this.url}/Dictionary/GetDictionaryItems/${name}`
    );

  getKatoTopElements = () =>
    this.http.get<IKatoRow[]>(
      `${this.url}/DicKato/GetKatoTopLevelElements`
    );

  getKatoByCode = (katoCode) =>
    this.http.get<IKatoRow[]>(
      `${this.url}/DicKato/GetKatoByCode/${katoCode}`
    );

  getKatoTreeByCode = (katoCode: string) =>
    this.http.get<IKatoRowTree>(
      `${this.url}/DicKato/GetKatoTreeByCode/${katoCode}`
    );

  getFileTypes = () =>
    this.http.get<IDictionaryItem[]>(
      `${this.url}/Dictionary/GetDictionaryItems/DicFileType`
    );

  getFirstDocTypes = () =>
    this.http.get<IDictionaryItem[]>(
      `${this.url}/Dictionary/GetDictionaryItems/DicFirstDocType`
    );

}

export interface IDictionaryItem {
  id: string;
  code: string;
  nameRu: string;
  nameKz: string;
}

export const dictionaries = {
  dicFileType: 'DicFileType',
  dicLandPurpose: 'DicLandPurpose',
  dicLoanPurpose: 'DicLoanPurpose',
  dicLoanProduct: 'DicLoanProduct',
  dicActivityType: 'DicActivityType',
  dicDocClassification: 'DicDocClassification',
  dicTransportType: 'DicTransportType',
  dicGuaranteeType: 'DicGuaranteeType',
  dicClientType: 'DicClientType',
  dicNok: 'DicNok',
  dicBank: 'DicBank',
  dicClientCategory: 'DicClientCategory',
};
