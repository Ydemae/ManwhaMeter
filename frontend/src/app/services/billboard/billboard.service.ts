// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Announcement } from '../../../types/announcement';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillboardService {

  private apiUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient,
    private authService: AuthService
  ) {}

  getAll(): Promise<Array<Announcement>> {

    return new Promise((resolve, reject) => {
      this._http.get<HttpResponse<any>>(
        `${this.apiUrl}/billboard/getAll`,
        {
          headers: new HttpHeaders({ "Authorization": `Bearer ${localStorage.getItem("token")}` }),
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          if (error.status == 401) {
            this.authService.forcedLogout()
          }
          else {
            console.log("Unexpected error caught when attempting to get all announcements");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response) {
            const body = response.body as { result: string, announcements: Array<Announcement> }

            resolve(body.announcements);
          }
          else {
            console.log("Error caught when attempting to get all announcements");
            reject();
          }
        },
        error: (error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to get all announcements");
          reject()
        }
      }
      );
    })
  }

  getOneById(id : number): Promise<Announcement> {

    return new Promise((resolve, reject) => {
      this._http.get<HttpResponse<any>>(
        `${this.apiUrl}/billboard/getOneById/${id}`,
        {
          headers: new HttpHeaders({ "Authorization": `Bearer ${localStorage.getItem("token")}` }),
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          if (error.status == 401) {
            this.authService.forcedLogout()
          }
          else {
            console.log("Unexpected error caught when attempting to get announcements");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response) {
            const body = response.body as { result: string, announcement: Announcement }

            resolve(body.announcement);
          }
          else {
            console.log("Error caught when attempting to get announcements");
            reject();
          }
        },
        error: (error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to get announcements");
          reject()
        }
      }
      );
    })
  }


  getAllActive(): Promise<Array<Announcement>> {

    return new Promise((resolve, reject) => {
      this._http.get<HttpResponse<any>>(
        `${this.apiUrl}/billboard/getAllActive`,
        {
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to get all announcements");

          reject();
          return throwError(() => { });
        })
      ).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response) {
            const body = response.body as { result: string, announcements: Array<Announcement> }

            resolve(body.announcements);
          }
          else {
            console.log("Error caught when attempting to get all announcements");
            reject();
          }
        },
        error: (error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to get all announcements");
          reject()
        }
      }
      );
    })
  }


  create(title : string, message: string, active : boolean = true): Promise<boolean> {

    let body = {
      title : title,
      message : message,
      active : active
    }

    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/billboard/create`,
        body,
        {
          headers: new HttpHeaders({ "Authorization": `Bearer ${localStorage.getItem("token")}` }),
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          if (error.status == 401) {
            this.authService.forcedLogout()
          }
          else {
            console.log("Unexpected error caught when attempting to create announcement");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe((response: HttpResponse<any>) => {
        if (response) {
          const body = response.body as { result: string, error: string | null }

          resolve(body["result"] === "success");
        }
        else {
          console.log("Error caught when attempting to create the announcement");
          reject();
        }
      });
    })
  }

  update(id : number, title : string, message: string): Promise<boolean> {

    let body = {
      id : id,
      title : title,
      message : message
    }

    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/billboard/update`,
        body,
        {
          headers: new HttpHeaders({ "Authorization": `Bearer ${localStorage.getItem("token")}` }),
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          if (error.status == 401) {
            this.authService.forcedLogout()
          }
          else {
            console.log("Unexpected error caught when attempting to update announcement");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe((response: HttpResponse<any>) => {
        if (response) {
          const body = response.body as { result: string, error: string | null }

          resolve(body["result"] === "success");
        }
        else {
          console.log("Error caught when attempting to update announcement");
          reject();
        }
      });
    })
  }

  deactivate(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/billboard/deactivate`,
        {id : id},
        {
          headers: new HttpHeaders({ "Authorization": `Bearer ${localStorage.getItem("token")}` }),
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          if (error.status == 401) {
            this.authService.forcedLogout()
          }
          else {
            console.log("Unexpected error caught when attempting to deactivate the announcement");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe((response: HttpResponse<any>) => {
        if (response) {
          const body = response.body as { result: string, error: string | null }

          resolve(body["result"] === "success");
        }
        else {
          console.log("Error caught when attempting to deactivate the announcement");
          reject();
        }
      });
    })
  }

  activate(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/billboard/activate`,
        {id : id},
        {
          headers: new HttpHeaders({ "Authorization": `Bearer ${localStorage.getItem("token")}` }),
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          if (error.status == 401) {
            this.authService.forcedLogout()
          }
          else {
            console.log("Unexpected error caught when attempting to activate the announcmenet");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe((response: HttpResponse<any>) => {
        if (response) {
          const body = response.body as { result: string, error: string | null }

          resolve(body["result"] === "success");
        }
        else {
          console.log("Error caught when attempting to activate the announcmenet");
          reject();
        }
      });
    })
  }
}
