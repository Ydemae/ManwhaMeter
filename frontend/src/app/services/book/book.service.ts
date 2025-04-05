import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ListedBook } from '../../../types/listedBook';
import { DetailedBook } from '../../../types/detailedBook';
import { Book } from '../../../types/book';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient,
    private authService: AuthService
  ) {

  }

  getAll(
    tags: Array<number> | null = null,
    bookType: string | null = null,
    bookName: string = "",
    status: string | null = null,
    active: boolean | null = null
  ): Promise<Array<ListedBook>> {

    let body = {
      tags: tags === null ? [] : tags,
      book_type: bookType === null ? null : bookType,
      book_name: bookName === null ? "" : bookName,
      status: status === null ? null : status,
      active: active === null ? null : active
    }

    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/books/getAll`,
        body,
        {
          headers: new HttpHeaders({ "Authorization": `Bearer ${localStorage.getItem("token")}` }),
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          if (error.status == 401) {
            this.authService.forcedLogout()
          }
          else {
            console.log("Unexpected error caught when attempting to get all books");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response) {
            const body = response.body as { result: string, books: Array<ListedBook> }

            console.log(response)
            resolve(body.books);
          }
          else {
            console.log("Error caught when attempting to get all books");
            reject();
          }
        },
        error: (error: HttpResponse<any>) => {
          console.log("Unexpected error caught when attempting to get all books");
          reject()
        }
      }
      );
    })
  }

  getOneById(
    id: number
  ): Promise<DetailedBook> {

    return new Promise((resolve, reject) => {
      this._http.get<HttpResponse<any>>(
        `${this.apiUrl}/books/getOneById/${id}`,
        {
          headers: new HttpHeaders({ "Authorization": `Bearer ${localStorage.getItem("token")}` }),
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          if (error.status == 401) {
            this.authService.forcedLogout()
          }
          else {
            console.log("Unexpected error caught when attempting to getting one book");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe((response: HttpResponse<any>) => {
        if (response) {
          const body = response.body as { result: string, book: DetailedBook }

          resolve(body.book);
        }
        else {
          console.log("Error caught when attempting to get book with id ${id}");
          reject();
        }
      });
    })
  }


  create(
    book: Book
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._http.post<HttpResponse<any>>(
        `${this.apiUrl}/books/create`,
        book,
        {
          headers: new HttpHeaders({ "Authorization": `Bearer ${localStorage.getItem("token")}` }),
          observe: 'response'
        }
      ).pipe(
        catchError((error: HttpResponse<any>) => {
          if (error.status == 401) {
            this.authService.forcedLogout()
          }
          else {
            console.log("Unexpected error caught when attempting to create book");
          }

          reject();
          return throwError(() => { });
        })
      ).subscribe((response: HttpResponse<any>) => {
        if (response) {
          const body = response.body as { result: string, error: string | null }

          resolve(body["result"] === "success");
        }
        else {
          console.log("Error caught when attempting to create the book");
          reject();
        }
      });
    })
  }
}
