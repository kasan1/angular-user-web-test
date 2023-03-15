import { HttpClient } from '@angular/common/http';
import { IFileInfo, FilePage, FileCode } from '../models/fileInfo';
import { v4 as uuidv4 } from 'uuid';

export class FileService {
  constructor(protected url: string, protected http: HttpClient) { }

  upload = (files: IFileInfo[]) => {
    const information = [];

    const formData = new FormData();
    files.forEach((f) => {
      if (!f.blob) return;

      const ext = f.title.substr(f.title.lastIndexOf('.'));

      const uuid = uuidv4();
      formData.append('file', f.blob, `${uuid}${ext}`);

      information.push({
        identifier: `${uuid}${ext}`,
        basePledgeId: f.basePledgeId,
        appId: f.appId,
        code: f.code,
        date: f.date,
        number: f.number,
        isOriginal: f.isOriginal,
        page: f.page,
        title: f.title,
      });
    });

    formData.append('fileInformation', JSON.stringify(information));

    return this.http.post<IFileInfo[]>(
      `${this.url}/file/UploadFiles`,
      formData
    );
  };

  load = (filter: IFileFilter) =>
    this.http.post<IFileInfo[]>(`${this.url}/file/List`, filter);

  getJuristResultFile = (id: string) =>
    this.http.get<IFileInfo[]>(`${this.url}/file/JuristResultFile/${id}`);

  file = (id: string) =>
    this.http.get(`${this.url}/file/DownloadFile/${id}`, {
      responseType: 'arraybuffer',
    });

  updateDocInformation = (request: { items: IDocInformation[] }) =>
    this.http.post(`${this.url}/file/UpdateDocInformation`, request);

  delete = (fileIds: string[]) =>
    this.http.post(`${this.url}/file/DeleteFiles`, { fileIds });

  document = (print: IPrint) =>
    this.http.post(`${this.url}/print/GenerateFile`, print, {
      responseType: 'arraybuffer',
    });
}

export interface IFileFilter {
  id?: string;
  appId?: string;
  basePledgeId?: string;
  page?: FilePage;
  codes?: FileCode[];
}

export interface IPrint {
  appId: string;
  name: string;
  format: string;
  hasXml?: boolean;
  xmlDate?: string;
}

interface IDocInformation {
  applicationId: string;
  pageCount: number;
  pageInterval: string;
  isOriginal: boolean;
}
