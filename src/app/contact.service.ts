import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from './models/contact.class';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  url = 'https://localhost:44389/api/contact/';

  constructor(private http: HttpClient) { }

  get(pageNumber: number, pageSize: number, searchInput: string) {
    return this.http.get(this.url + `?pageNumber=${pageNumber}&pageSize=${pageSize}&searchInput=${encodeURIComponent(searchInput)}`);
  }

  post(contact: Contact) {
    return this.http.post(this.url, contact);
  }

  patch(contact: Contact) {
    return this.http.patch(this.url, contact);
  }

  delete(id) {
    return this.http.delete(this.url + id);
  }

}
