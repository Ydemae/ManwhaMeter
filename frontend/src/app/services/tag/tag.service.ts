import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs';
import { Tag } from '../../../types/tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {
    
  }

  getAll(): Promise<Array<Tag>> {
    return new Promise((resolve, reject) => {
      this._http.get(
        `${this.apiUrl}/tag/getAll`,
        {
          headers: new HttpHeaders({ "Authorization" : `Bearer ${sessionStorage.getItem("token")}`})
        }
      ).pipe(
        catchError(error => {
          console.log(`Error caught when attempting to get all tags : ${error}`);
          reject(error);
          return error;
          
        })
      ).subscribe((response : any) => {
        if (response) {
          console.log(response)
          const formattedResponse = response as {result : string, tags : Array<Tag>}

          resolve(formattedResponse.tags);
        }
        else {
          console.log("Error caught when attempting to get all tags");
          reject();
        }
      });
    })
  }
}
