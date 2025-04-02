import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { RatingData } from '../../../types/ratingData';
import { catchError, of } from 'rxjs';
import { Rating } from '../../../types/rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  getOneByBookId
  (
    book_id : number
  ): Promise<Rating> 
  {
    return new Promise((resolve, reject) => {
      this._http.get<HttpResponse<any>>(
        `${this.apiUrl}/ratings/getOneByBookId/${book_id}`,
        {
          headers: new HttpHeaders({ "Authorization" : `Bearer ${sessionStorage.getItem("token")}`})
        }
      ).pipe(
        catchError(error => {
          console.log(`Error caught when attempting to get rating : ${error}`);
          reject(error);
          return of(error);
        })
      ).subscribe({
        next : (response : HttpResponse<any>) => {
          if (!response){
            reject()
          }
          
          const body = response.body as {result : string, rating : Rating | null, error : string | null}

          
          if (body.result != "success"){
            if (response.status == 430){
              //The user had not rated this book yet
              reject({"errcode" : 2})
            }
            console.log("Error caught when attempting to get rating");
            reject({"errcode" : 1});
          }

          resolve(body.rating!);
        },
        error : (error) => {
          console.error("Request failed", error);
          reject(error);
        }
      });
    })
  }


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
