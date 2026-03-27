// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { ReadingListEntity } from '../../../types/readingListEntity';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReadingListService {

  private apiUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient,
  ) {}

  getAll(): Promise<Array<ReadingListEntity>> {

    return new Promise((resolve, reject) => {
      this._http.get<HttpResponse<any>>(
        `${this.apiUrl}/readingList/getAll`,
        {
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to get user's reading list");

          reject();
          return throwError(() => { });
        })
      ).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response) {
            const body = response.body as { result: string, readingListEntries: Array<ReadingListEntity> }

            resolve(body.readingListEntries);
          }
          else {
            console.log("Error caught when attempting to get user's reading list");
            reject();
          }
        },
        error: (error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to get user's reading list");
          reject()
        }
      }
      );
    })
  }

  create( book_id : number ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/readingList/create`,
        {book_id : book_id},
        {
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to add book to user's reading list");

          reject();
          return throwError(() => { });
        })
      ).subscribe((response: HttpResponse<any>) => {
        if (response) {
          const body = response.body as { result: string, error: string | null }

          resolve(body["result"] === "success");
        }
        else {
          console.log("Error caught when attempting to add book to user's reading list");
          reject();
        }
      });
    })
  }

  delete(
    id: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/readingList/delete`,
        {id : id},
        {
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to remove book from user's reading list");

          reject();
          return throwError(() => { });
        })
      ).subscribe((response: HttpResponse<any>) => {
        if (response) {
          const body = response.body as { result: string, error: string | null }

          resolve(body["result"] === "success");
        }
        else {
          console.log("Error caught when attempting to remove book from user's reading list");
          reject();
        }
      });
    })
  }
}
