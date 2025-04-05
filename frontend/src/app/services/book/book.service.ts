import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ListedBook } from '../../../types/listedBook';
import { DetailedBook } from '../../../types/detailedBook';
import { Book } from '../../../types/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {
    
  }

  getAll(
    tags: Array<number> | null = null,
    bookType : string | null = null,
    bookName : string = "",
    status : string | null = null,
    active : boolean | null = null
  ): Promise<Array<ListedBook>> {

    let body = {
      tags : tags === null ? [] : tags,
      book_type : bookType === null ? null : bookType,
      book_name : bookName === null ? "" : bookName,
      status : status === null ? null : status,
      active : active === null ? null : active
    }

    return new Promise((resolve, reject) => {
      this._http.post(
        `${this.apiUrl}/books/getAll`,
        body,
        {
          headers: new HttpHeaders({ "Authorization" : `Bearer ${localStorage.getItem("token")}`})
        }
      ).pipe(
        catchError(error => {
          console.log(`Error caught when attempting to get all books : ${error}`);
          reject(error);
          return error;
          
        })
      ).subscribe((response : any) => {
        if (response) {
          console.log(response)
          const formattedResponse = response as {result : string, books : Array<ListedBook>}

          resolve(formattedResponse.books);
        }
        else {
          console.log("Error caught when attempting to get all books");
          reject();
        }
      });
    })
  }

  getOneById(
    id : number
  ): Promise<DetailedBook> {

    return new Promise((resolve, reject) => {
      this._http.get(
        `${this.apiUrl}/books/getOneById/${id}`,
        {
          headers: new HttpHeaders({ "Authorization" : `Bearer ${localStorage.getItem("token")}`})
        }
      ).pipe(
        catchError(error => {
          console.log(`Error caught when attempting to get book with id ${id} : ${error}`);
          reject(error);
          return error;
          
        })
      ).subscribe((response : any) => {
        if (response) {
          console.log(response)
          const formattedResponse = response as {result : string, book : DetailedBook}

          resolve(formattedResponse.book);
        }
        else {
          console.log("Error caught when attempting to get book with id ${id}");
          reject();
        }
      });
    })
  }


  create(
    book : Book
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._http.post(
        `${this.apiUrl}/books/create`,
        book,
        {
          headers: new HttpHeaders({ "Authorization" : `Bearer ${localStorage.getItem("token")}`})
        }
      ).pipe(
        catchError(error => {
          console.log(`Error caught when attempting to create book : ${error}`);
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
}
