import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import {
  IFile,
  IFileBase,
  IFileUpload,
  IResponse,
} from '../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private readonly baseUrl = `${environment.sharedUrl}/Files`;

  constructor(private http: HttpClient, public snackbar: MatSnackBar) {}

  showErrorMessage(err?: any) {
    let errorMessage = 'Произошла ошибка во время обработки файла(ов)';
    if (err) {
      if (err.error && err.error.Message) errorMessage = err.error.Message;
    }

    this.snackbar.open(errorMessage, 'Закрыть', {
      duration: 5000,
    });
  }

  async uploadFiles(data: IFileUpload): Promise<IResponse<null>> {
    try {
      const formData = new FormData();
      formData.append('entityId', data.entityId);
      formData.append('entityType', data.entityType.toString());

      Array.from(data.files).forEach((file) => {
        formData.append(`files`, file);
      });

      return await this.http
        .post<IResponse<null>>(`${this.baseUrl}`, formData)
        .toPromise();
    } catch (ex) {
      this.showErrorMessage(ex);
    }
  }

  async getAttachmentFiles(data: IFileBase): Promise<IResponse<IFile[]>> {
    const params = new HttpParams()
      .set('entityId', data.entityId)
      .set('entityType', data.entityType.toString());

    try {
      return await this.http
        .get<IResponse<IFile[]>>(`${this.baseUrl}`, { params })
        .toPromise();
    } catch (ex) {
      this.showErrorMessage(ex);
    }
  }

  async deleteFile(fileId: string): Promise<IResponse<null>> {
    try {
      return await this.http
        .delete<IResponse<null>>(`${this.baseUrl}/${fileId}`)
        .toPromise();
    } catch (ex) {
      this.showErrorMessage(ex);
    }
  }

  async getULFiles(applicationId: string): Promise<IResponse<IFile[]>> {
    try {
      return await this.http
        .get<IResponse<IFile[]>>(`${this.baseUrl}/ul/${applicationId}`)
        .toPromise();
    } catch (ex) {
      this.showErrorMessage(ex);
    }
  }

  async getFLFiles(applicationId: string): Promise<IResponse<IFile[]>> {
    try {
      return await this.http
        .get<IResponse<IFile[]>>(`${this.baseUrl}/fl/${applicationId}`)
        .toPromise();
    } catch (ex) {
      this.showErrorMessage(ex);
    }
  }
}
