// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { RatingData } from '../../../types/ratingData';
import { catchError, of, throwError } from 'rxjs';
import { Rating } from '../../../types/rating';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private apiUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient,
    private authService : AuthService
  ) {}

  getOneByBookId
  (
    book_id : number
  ): Promise<Rating> 
  {
    return new Promise((resolve, reject) => {
      this._http.get<HttpResponse<any>>(
        `${this.apiUrl}/ratings/getOneByBookId/${book_id}`,
        {
          headers: new HttpHeaders({ "Authorization" : `Bearer ${localStorage.getItem("token")}`}),
          observe: 'response'
        },
      ).pipe(
        catchError(error => {
          let errCode = {"errcode" : 1};

          if (error.status == 401){
            this.authService.forcedLogout()
          }
          if (error.status == 430){
            //The user had not rated this book yet
            errCode = {"errcode" : 2};
          }
          else{
            console.log("Unexpected error caught when attempting to get rating");
          }

          reject(errCode);
          return throwError(() => errCode);
        })
      ).subscribe({
        next : (response : HttpResponse<any>) => {
          if (!response){
            reject()
          }
          const body = response.body as {result : string, rating : Rating | null, error : string | null}          

          resolve(body.rating!);
        },
        error : (error) => {
          console.error("Request failed", error);
          reject(error);
        }
      });
    })
  }


  update(
    book_id : number,
    rating_id : number,
    ratingData : RatingData
  ): Promise<boolean> {

    let body = {
      rating_id : rating_id,
      book_id : book_id,
      story : ratingData.story,
      art_style : ratingData.art_style,
      feeling : ratingData.feeling,
      characters : ratingData.characters,
      comment : ratingData.comment
    }

    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/ratings/update`,
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
            console.log("Unexpected error caught when attempting to update rating");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe((response : HttpResponse<any>) => {
        console.log(response)
        if (response) {
          const body = response.body as {result : string, error : string | null}

          resolve(body["result"] === "success");
        }
        else {
          console.log("Error caught when attempting to create the book");
          reject();
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
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/ratings/create`,
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
            console.log("Unexpected error caught when attempting to create rating");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe((response : HttpResponse<any>) => {
        if (response) {
          console.log(response)
          const body = response.body as {result : string, error : string | null}

          resolve(body.result === "success");
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
      this._http.get<HttpResponse<any>>(
        `${this.apiUrl}/ratings/delete/${rating_id}`,
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
            console.log("Unexpected error caught when attempting to delete rating");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe((response : HttpResponse<any>) => {
        if (response) {
          const body = response.body as {result : string, error : string | null}

          resolve(body["result"] === "success");
        }
        else {
          reject();
        }
      });
    })
  }
}
