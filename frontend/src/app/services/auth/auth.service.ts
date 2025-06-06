import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
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
    this.isLoggedInSubject.next(!!localStorage.getItem('token'));
    this.isAdminSubject.next(localStorage.getItem('isAdmin') == 'true');
  }

  logout(){
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("token");
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
  }

  forcedLogout(){
    this.logout();

    this.flashMessageService.setFlashMessage("You have been logged out due to your token expiring, please authenticate again")
    this.router.navigate(["/login"]);
  }

  login(username: string, password : string): Promise<number> {
    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/auth/getToken`,
        {
          username : username,
          password : password
        },
        {
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          console.log(error)
          console.log(`Error caught when attempting to authenticate : ${error}`);
          let code = 1
          if (error.status == 403){
            code = 2
            console.log(code)
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

          const body = response.body as { result: string, isAdmin : boolean, token : string }

          if (body.result == "success"){
            this.isLoggedInSubject.next(true)
            this.isAdminSubject.next(body.isAdmin)
            localStorage.setItem("isAdmin", String(body.isAdmin))
            localStorage.setItem("token", body.token)
          }
          resolve(body.result == "success" ? 0 : 1);
        }
        else {
          console.log("Error caught when attempting to authenticate");
          reject();
        }
      });
    })
  }
}
