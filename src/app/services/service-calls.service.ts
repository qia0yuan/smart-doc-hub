import { Injectable } from '@angular/core';
import { BASE_URL, ENDPOINTS } from '../constants/api-url.constant';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceCallsService {
  assetPath = environment.assetPath;

  constructor(private http: HttpClient) { }

  getUrl(endpoint: string, ...params: {[key: string]: unknown}[]) {
    const baseUrl = BASE_URL;
    let new_endpoint = '';
    if (params.length) {
      params.forEach(param => {
        const [key, value] = Object.entries(param)[0];
        new_endpoint = endpoint.replace(`{${key}}`, value as string);
      });
      return `${baseUrl}${new_endpoint}`;
    }
    return `${baseUrl}${endpoint}`;
  }

  login(username: string, password: string): Observable<any> {
    const url = this.getUrl(ENDPOINTS.USER_LOGIN),
    body = new FormData();
    body.append('username', username);
    body.append('password', password);
    return this.http.post<any>(`${this.assetPath}login.json`, body);
    // return this.http.post<any>(url, body);
  }

  getUserByUsername(username: string): Observable<any> {
    const url = this.getUrl(ENDPOINTS.USER_BY_USERNAME),
    params = new HttpParams().append('user_id', username);
    return this.http.get<any>(`${this.assetPath}userByUsername.json`, {params});
    // return this.http.get<any>(url, {params});
  }

  getUserByUserId(userId: number): Observable<any> {
    const url = this.getUrl(ENDPOINTS.USER_CRUD, {user_id: userId});
    return this.http.get<any>(url);
  }

  getAccountByAccountId(accountId: number): Observable<any> {
    const url = this.getUrl(ENDPOINTS.ACCOUNT_CRUD, {account_id: accountId});
    return this.http.get<any>(`${this.assetPath}accountByAcctid.json`);
    // return this.http.get<any>(url);
  }
}
