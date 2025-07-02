// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { Component, OnInit } from '@angular/core';
import { ReadingListService } from '../services/reading-list/reading-list.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReadingListEntity } from '../../types/readingListEntity';
import { ListedBook } from '../../types/listedBook';
import { BookType } from '../../enum/bookType';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reading-list',
  standalone: false,
  templateUrl: './reading-list.component.html',
  styleUrl: './reading-list.component.scss'
})
export class ReadingListComponent  implements OnInit{

  public dataFetched : boolean = false;
  public loadingFailed = false;

  public readingList! : ReadingListEntity[];
  public books! : ListedBook[];
  public bookIdToReadingListEntry! : Map<number, number>;

  public readingListEntityToDelete? : ReadingListEntity;

  public showError = false;
  public errTitle = "";
  public errMessage = "";

  constructor(
    private readingListService : ReadingListService,
    private router : Router
  ){}

  ngOnInit(): void {
    this.loadReadingList();
  }

  loadReadingList(){
    this.loadingFailed = false;
    this.dataFetched = false;

    this.readingListService.getAll().then(
      results => {
        this.readingList = results;

        this.books = [];
        this.bookIdToReadingListEntry = new Map<number, number>();

        for (let rdEntry of this.readingList){
          //Save a Map of all book ids relative to reading list entries
          this.bookIdToReadingListEntry.set(rdEntry.book.id, rdEntry.id);

          //Get tags labels and create ListedBook objects to fill this.books
          let tags = []

          for (let tag of rdEntry.book.tags){
            tags.push(tag.label);
          }

          let book : ListedBook = {
            id : rdEntry.book.id,
            name : rdEntry.book.name,
            description : rdEntry.book.description,
            tags : tags,
            image_path : rdEntry.book.image_path,
            bookType : rdEntry.book.bookType as BookType,
            overall_rating : 0
          };

          this.books.push(book);
        }

        this.dataFetched = true;
      }
    ).catch(
      error => {
        this.loadingFailed = true;
      }
    )
  }

  displayError(
    title : string,
    message : string
  ){
    this.errTitle = title;
    this.errMessage = message;
    this.showError = true;
  }

  hideError(){
    this.showError = false;
  }

  receiveBookClickedEvent(bookId : number){
    this.router.navigate([`/bookdetail`, bookId]);
  }

  receiveDeleteFromReadingListEvent(bookId : number){
    let rdId = this.bookIdToReadingListEntry.get(bookId);

    if (rdId == null){
      this.displayError("Unexpected error", "The book couldn't be found in the reading list");
      return;
    }

    let bookIndex = this.books.findIndex(item => item.id === bookId);
    let readinglistIndex = this.readingList.findIndex(item => item.id === rdId);

    if (bookIndex == -1 || readinglistIndex == -1){
      this.displayError("Unexpected error", "The book couldn't be found in the reading list");
      return;
    }

    //Keep backup of the objects in case the deletion cannot occur
    const rdBackup = JSON.parse(JSON.stringify(this.readingList[readinglistIndex]));
    const bookBackup = JSON.parse(JSON.stringify(this.books[bookIndex]));

    this.readingList.splice(readinglistIndex, 1);
    this.books.splice(bookIndex, 1);

    this.readingListService.delete(rdId).then(
      response => {}
    ).catch(
      error => {
        console.error(error);
        this.displayError("Unexpected error", "Book couldn't be removed from the reading list, please try again");

        //Put the book back in the reading list in case of an error
        this.readingList.push(rdBackup);
        this.books.push(bookBackup);
      }
    )
  }
}
