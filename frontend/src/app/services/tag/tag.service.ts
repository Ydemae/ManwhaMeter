import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Tag } from '../../../types/tag';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private apiUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient,
    private authService : AuthService
  ) {
    
  }

  getAll(): Promise<Array<Tag>> {
    return new Promise((resolve, reject) => {
      this._http.get<HttpResponse<any>>(
        `${this.apiUrl}/tag/getAll`,
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
            console.log("Unexpected error caught when attempting to get all tags");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe((response : HttpResponse<any>) => {
        if (response) {
          console.log(response)
          const body = response.body as {result : string, tags : Array<Tag>}

          resolve(body.tags);
        }
        else {
          console.log("Error caught when attempting to get all tags");
          reject();
        }
      });
    })
  }
}
