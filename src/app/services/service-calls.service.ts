import { Injectable } from '@angular/core';
import { BASE_URL, ENDPOINTS } from '../constants/api-url.constant';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceCallsService {

  constructor(private http: HttpClient) { }

  getUrl(endpoint: string, ...params: {[key: string]: string}[]) {
    const baseUrl = BASE_URL;
    let new_endpoint = '';
    if (params.length) {
      params.forEach(param => {
        const [key, value] = Object.entries(param)[0];
        new_endpoint = endpoint.replace(`{${key}}`, value);
      });
      return `${baseUrl}/${new_endpoint}`;
    }
    return `${baseUrl}${endpoint}`;
  }

  login(email: string, password: string): Observable<any> {
    const url = this.getUrl(ENDPOINTS.USER_LOGIN),
    body = { email, password };
    return this.http.post<any>(url, body);
  }
}
