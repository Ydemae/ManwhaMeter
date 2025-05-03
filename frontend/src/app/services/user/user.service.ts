import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { DetailedUser } from '../../../types/detailedUser';
import { catchError, throwError } from 'rxjs';
import { User } from '../../../types/user';

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

  getAll (active : boolean | null): Promise<DetailedUser[]> {
    if (!this.authService.isAdminSubject.value){
      return Promise.reject("User is not admin");
    }

    let active_code = active == null ? 2 : (active == true ? 1 : 0);

    return new Promise((resolve, reject) => {
      this._http.get<HttpResponse<any>>(
        `${this.apiUrl}/user/getAll/${active_code}`,
        {
          headers: new HttpHeaders({ "Authorization" : `Bearer ${localStorage.getItem("token")}`}),
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          if (error.status == 401) {
            this.authService.forcedLogout()
          }
          else {
            console.log("Unexpected error caught when attempting to get all users");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response) {
            const body = response.body as { result: string, users : DetailedUser[] }
            resolve(body.users);
          }
          else {
            console.log("Error caught when attempting to get all users");
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

  delete (user_id : number): Promise<boolean> {

    let body = {
      user_id : user_id
    }

    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/user/delete`,
        body,
        {
          headers: new HttpHeaders({ "Authorization" : `Bearer ${localStorage.getItem("token")}`}),
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          if (error.status == 401) {
            this.authService.forcedLogout()
          }
          else {
            console.log("Unexpected error caught when attempting to delete user");
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
            console.log("Error caught when attempting to delete user");
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


  deactivate (user_id : number): Promise<boolean> {

    let body = {
      user_id : user_id
    }

    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/user/deactivate`,
        body,
        {
          headers: new HttpHeaders({ "Authorization" : `Bearer ${localStorage.getItem("token")}`}),
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          if (error.status == 401) {
            this.authService.forcedLogout()
          }
          else {
            console.log("Unexpected error caught when attempting to deactivate user");
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
            console.log("Error caught when attempting to deactivate user");
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

  activate (user_id : number): Promise<boolean> {

    let body = {
      user_id : user_id
    }

    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/user/activate`,
        body,
        {
          headers: new HttpHeaders({ "Authorization" : `Bearer ${localStorage.getItem("token")}`}),
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          if (error.status == 401) {
            this.authService.forcedLogout()
          }
          else {
            console.log("Unexpected error caught when attempting to activate user");
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
            console.log("Error caught when attempting to activate user");
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
}
