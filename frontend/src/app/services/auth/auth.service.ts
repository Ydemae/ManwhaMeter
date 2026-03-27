// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FlashMessageService } from '../flashMessage/flash-message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  public isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  public isAdminSubject = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdminSubject.asObservable();

  constructor(
    private _http: HttpClient,
    private router : Router,
    private flashMessageService : FlashMessageService
  ) {
    this.isLoggedInSubject.next(!!localStorage.getItem('access_token'));
    this.isAdminSubject.next(localStorage.getItem('isAdmin') == 'true');
  }

  logout(){
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
  }

  forcedLogout(){
    this.logout();

    this.flashMessageService.setFlashMessage("You have been logged out due to your token expiring, please authenticate again")
    this.router.navigate(["/login"]);
  }

  unauthorizedRedrect(){
    this.flashMessageService.setFlashMessage("You are not authorized to perform this action.")
    this.router.navigate(["/home"]);
  }

  login(username: string, password : string): Promise<number> {
    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/auth/login`,
        {
          username : username,
          password : password
        },
        {
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          let code = 1
          if (error.status == 403){
            code = 2
          }
          else if (error.status == 401){
            code = 3;
          }
          else {
            console.log("Unexpected error caught when attempting to login");
          }

          reject(code);
          return throwError(() => { });
        }
      )
      ).subscribe((response : HttpResponse<any>) => {
        if (response) {

          const body = response.body as {isAdmin : boolean, token : string, refresh_token : string}

          this.isLoggedInSubject.next(true)
          this.isAdminSubject.next(body.isAdmin)
          localStorage.setItem("isAdmin", String(body.isAdmin))
          localStorage.setItem("refresh_token", body.refresh_token)
          localStorage.setItem("access_token", body.token)

          resolve(0);
        }
        else {
          console.log("Error caught when attempting to authenticate");
          reject();
        }
      });
    })
  }

  getAccessToken(){
    if (!this.isLoggedInSubject.value){
      return null
    }

    return localStorage.getItem("access_token")
  }

  getRefreshToken(){
    return localStorage.getItem("refresh_token")
  }

  refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    return this._http.post<{ token: string }>(
      `${this.apiUrl}/auth/refresh`,
      { refresh_token: refreshToken },
      { observe: 'response' }
    ).pipe(
      switchMap((response) => {
        const newToken = response.body!.token;
        localStorage.setItem('access_token', newToken);
        return of(newToken);
      })
    );
  }

}
