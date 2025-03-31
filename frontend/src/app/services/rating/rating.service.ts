import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { RatingData } from '../../../types/ratingData';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  create(
    book_id : number,
    ratingData : RatingData
  ): Promise<boolean> {

    let body = {
      book_id : book_id,
      story : ratingData.story,
      art_style : ratingData.art_style,
      feeling : ratingData.feeling,
      characters : ratingData.characters,
      comment : ratingData.comment
    }

    return new Promise((resolve, reject) => {
      this._http.post(
        `${this.apiUrl}/ratings/create`,
        body,
        {
          headers: new HttpHeaders({ "Authorization" : `Bearer ${sessionStorage.getItem("token")}`})
        }
      ).pipe(
        catchError(error => {
          console.log(`Error caught when attempting to create rating : ${error}`);
          reject(error);
          return error;
        })
      ).subscribe((response : any) => {
        if (response) {
          console.log(response)
          const formattedResponse = response as {result : string, error : string | null}

          resolve(response["result"] === "success");
        }
        else {
          console.log("Error caught when attempting to create the book");
          reject();
        }
      });
    })
  }

  delete(
    rating_id : number
  ): Promise<boolean> {

    return new Promise((resolve, reject) => {
      this._http.get(
        `${this.apiUrl}/ratings/delete/${rating_id}`,
        {
          headers: new HttpHeaders({ "Authorization" : `Bearer ${sessionStorage.getItem("token")}`})
        }
      ).pipe(
        catchError(error => {
          reject(error);
          return error;
        })
      ).subscribe((response : any) => {
        if (response) {
          const formattedResponse = response as {result : string, error : string | null}

          resolve(response["result"] === "success");
        }
        else {
          reject();
        }
      });
    })
  }
}
