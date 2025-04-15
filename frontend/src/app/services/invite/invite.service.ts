import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Invite } from '../../../types/invite';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InviteService {

  private apiUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient,
    private authService: AuthService
  ) {}

  getAll(
    used : boolean | null = null
  ): Promise<Array<Invite>> {

    let body = {
      used : used
    }
    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/registerInvite/getAll`,
        body,
        {
          headers: new HttpHeaders({ "Authorization": `Bearer ${localStorage.getItem("token")}` }),
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          console.log(error)
          if (error.status == 401) {
            this.authService.forcedLogout()
          }
          else {
            console.log("Unexpected error caught when attempting to get all invites");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response) {
            const body = response.body as { result: string, invites: Array<Invite> }
            resolve(body.invites);
          }
          else {
            console.log("Error caught when attempting to get all invites");
            reject();
          }
        },
        error: (error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to get all invites");
          reject()
        }
      }
      );
    })
  }

  create(): Promise<Invite> {
    return new Promise((resolve, reject) => {
      this._http.get<HttpResponse<any>>(
        `${this.apiUrl}/registerInvite/create`,
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
            console.log("Unexpected error caught when attempting to create invite");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response) {
            const body = response.body as { result: string, invite: Invite }
            resolve(body.invite);
          }
          else {
            console.log("Error caught when attempting to create invite");
            reject();
          }
        },
        error: (error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to create invite");
          reject()
        }
      }
      );
    })
  }

  delete(id : number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._http.get<HttpResponse<any>>(
        `${this.apiUrl}/registerInvite/delete/${id}`,
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
            console.log("Unexpected error caught when attempting to delete invite");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response) {
            const body = response.body as { result: string }
            resolve(body.result == "success");
          }
          else {
            console.log("Error caught when attempting to delete invite");
            reject();
          }
        },
        error: (error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to delete invite");
          reject()
        }
      }
      );
    })
  }

  isUsed(inviteUid : string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._http.get<HttpResponse<any>>(
        `${this.apiUrl}/registerInvite/isUsed/${inviteUid}`,
        {
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to create invite");

          reject();
          return throwError(() => { });
        })
      ).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response) {
            const body = response.body as { result: string, used: boolean }
            resolve(body.used);
          }
          else {
            console.log("Error caught when attempting to create invite");
            reject();
          }
        },
        error: (error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to create invite");
          reject()
        }
      }
      );
    })
  }
}
