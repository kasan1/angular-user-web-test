import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { INotification } from '../models/notification.model';
import { IList, IResponse } from '../models/common.model';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private url = `${environment.sharedUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getNotifications = (page: number, pageLimit: number) =>
    this.http.get<IResponse<IList<INotification>>>(
      `${this.url}?page=${page}&pageLimit=${pageLimit}`
    );
}
