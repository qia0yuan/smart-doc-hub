import { Injectable } from '@angular/core';
import { BASE_URL, ENDPOINTS } from '../constants/api-url.constant';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Account, User } from '../models/models';

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
    // return this.http.post<any>(`${this.assetPath}login.json`, body);
    return this.http.post<any>(url, body);
  }

  createUser(user: User): Observable<User> {
    const url = this.getUrl(ENDPOINTS.USER);
    return this.http.post<User>(url, user);
  }

  createInvitee(invitee: User): Observable<User> {
    const url = this.getUrl(ENDPOINTS.INVITEE);
    return this.http.post<User>(url, invitee);
  }

  sendInvitation(inviteObj: any) {
    const url = this.getUrl(ENDPOINTS.INVITEE);
    return this.http.post(url, inviteObj);
  }

  getUserByUsername(username: string): Observable<User> {
    const url = this.getUrl(ENDPOINTS.USER),
    params = new HttpParams().append('user_id', username);
    // return this.http.get<User>(`${this.assetPath}userByUsername.json`, {params});
    return this.http.get<User>(url, {params});
  }

  getUserByUserId(userId: number): Observable<User> {
    const url = this.getUrl(ENDPOINTS.USER_CRUD, {user_id: userId});
    return this.http.get<User>(url);
  }

  getAccountByAccountId(accountId: number): Observable<Account> {
    const url = this.getUrl(ENDPOINTS.ACCOUNT_CRUD, {account_id: accountId});
    // return this.http.get<Account>(`${this.assetPath}accountByAcctid.json`);
    return this.http.get<Account>(url);
  }

  getUserlist(accountId: number): Observable<User[]> {
    const url = this.getUrl(ENDPOINTS.USERS_LIST, {account_id: accountId});
    return this.http.get<User[]>(url);
  }

  getInviteelist(accountId: number): Observable<User[]> {
    const url = this.getUrl(ENDPOINTS.INVITEES_LIST, {account_id: accountId});
    return this.http.get<User[]>(url);
  }

  getDocumentsByUserId(userId: number): Observable<Document[]> {
    const url = this.getUrl(ENDPOINTS.DOCUMENT_QUERRY),
    params = new HttpParams().append('user_id', userId);
    return this.http.get<Document[]>(url, {params});
  }

  uploadDocument(formData: FormData): Observable<any> {
    const url = this.getUrl(ENDPOINTS.DOCUMENT_UPLOAD);
    return this.http.post<any>(url, formData);
  }

  downloadDocument(id: number): Observable<any> {
    const url = this.getUrl(ENDPOINTS.DOCUMENT_DOWNLOAD, {doc_id: id}),
    options = {responseType: 'blob' as 'json', observe: 'response' as 'body'};
    return this.http.get<any>(url, options);
  }

  deleteDocument(id: number): Observable<any> {
    const url = this.getUrl(ENDPOINTS.DOCUMENT_DELETE, {doc_id: id});
    return this.http.delete<any>(url);
  }

}
