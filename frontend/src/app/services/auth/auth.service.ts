import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FlashMessageService } from '../flashMessage/flash-message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  public isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private _http: HttpClient,
    private router : Router,
    private flashMessageService : FlashMessageService
  ) {
    this.isLoggedInSubject.next(!!localStorage.getItem('token'));
  }

  logout(){
    localStorage.removeItem("token");
    this.isLoggedInSubject.next(false);
  }

  forcedLogout(){
    localStorage.removeItem("token");
    this.isLoggedInSubject.next(false);

    this.flashMessageService.setFlashMessage("You have been logged out due to your token expiring, please authenticate again")
    this.router.navigate(["/login"]);
  }

  login(username: string, password : string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._http.post(
        `${this.apiUrl}/auth/getToken`,
        {
          username : username,
          password : password
        }
      ).pipe(
        catchError(error => {
          console.log(`Error caught when attempting to authenticate : ${error}`);
          reject(error);
          return error;
          
        })
      ).subscribe((response : any) => {
        if (response) {
          console.log(response)

          if (response["result"] == "success"){
            this.isLoggedInSubject.next(true)
            localStorage.setItem("token", response["token"])
          }
          resolve(response["result"] == "success");
        }
        else {
          console.log("Error caught when attempting to authenticate");
          reject();
        }
      });
    })
  }
}
