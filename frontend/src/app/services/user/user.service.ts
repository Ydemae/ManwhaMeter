import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { DetailedUser } from '../../../types/detailedUser';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient,
    private authService: AuthService
  ) {}

  create (
    username : string,
    password : string,
    profilePicture : string,
    invite : string
  ): Promise<boolean> {

    let body = {
      username : username,
      password : password,
      profilePicture : profilePicture,
      invite : invite
    }

    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/user/create`,
        body,
        {
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to create user");

          reject(error.status);
          return throwError(() => { });
        })
      ).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response) {
            const body = response.body as { result: string }
            resolve(body.result == "success");
          }
          else {
            console.log("Error caught when attempting to create user");
            reject();
          }
        },
        error: (error: HttpResponse<any>) => {
          reject()
        }
      }
      );
    })
  }

  usernameExists (
    username : string,
    invite : string
  ): Promise<boolean> {

    let body = {
      username : username,
      invite : invite
    }

    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/user/username_exists`,
        body,
        {
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to check username availability");

          reject();
          return throwError(() => { });
        })
      ).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response) {
            const body = response.body as { result: string, exists : boolean }
            resolve(body.exists);
          }
          else {
            console.log("Unexpected error caught when attempting to check username availability");
            reject();
          }
        },
        error: (error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to check username availability");
          reject()
        }
      }
      );
    })
  }
}
