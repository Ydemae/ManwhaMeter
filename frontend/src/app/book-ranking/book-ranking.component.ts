// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { Component, Input } from '@angular/core';
import { ListedBook } from '../../types/listedBook';
import { Tag } from '../../types/tag';
import { BookService } from '../services/book/book.service';
import { TagService } from '../services/tag/tag.service';
import { Router } from '@angular/router';
import { ReadingListEntity } from '../../types/readingListEntity';
import { ReadingListService } from '../services/reading-list/reading-list.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-book-ranking',
  standalone: false,
  templateUrl: './book-ranking.component.html',
  styleUrl: './book-ranking.component.scss'
})
export class BookRankingComponent {
  @Input()
  public personal : boolean = false;

  public dataWasFetched = false;
  public books : ListedBook[] | null = null;
  public tags : Tag[] | null = null;
  public readingList! : ReadingListEntity[];
  public bookIdToReadingListEntry! : Map<number, number>;

  public showError = false;
  public errTitle = "";
  public errMessage = "";

  public loadingFailed = false;

  constructor(
    private bookService : BookService,
    private tagSercice : TagService,
    private router : Router,
    private readingListService : ReadingListService,
    public authService : AuthService
  ){
  }

  ngOnInit(){
    this.loadStartingData()
  }

  loadStartingData(){
    this.loadingFailed = false;
    this.dataWasFetched = false;

    let booksPromise = null;
    if (this.personal){
      booksPromise = this.bookService.getAllPersonal(null, null, "", null, true);
    }
    else{
      booksPromise = this.bookService.getAll(null, null, "", null, true);
    }

    const tagsPromise = this.tagSercice.getAll();

    let readingListPromise = null;
    if (this.authService?.isLoggedInSubject.value){
      readingListPromise = this.readingListService.getAll();
    }

    let promises = [booksPromise, tagsPromise, readingListPromise]

    Promise.all(promises).then(
      results => {

        this.books = results[0] as ListedBook[];
        this.tags = results[1] as Tag[];

        this.dataWasFetched = true;

        this.bookIdToReadingListEntry = new Map<number, number>();
        if (results[2] != null){
          this.readingList = results[2] as ReadingListEntity[];
          this.updateBookIdToReadingListEntries();
        }
      }
    )
    .catch(
      error => {
        this.loadingFailed = true;
      }
    )
  }

  updateBookIdToReadingListEntries(){
    let temp = new Map<number, number>();
    for (let rdEntry of this.readingList){
      temp.set(rdEntry.book.id, rdEntry.id);
    }
    this.bookIdToReadingListEntry = temp;
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

  receiveFilterChangeEvent(filterData : {
    name : string,
    status : string | null,
    tags : Array<number>,
    bookType : string | null
  }){

    let booksPromise = null;

    if (this.personal){
      booksPromise = this.bookService.getAllPersonal(
        filterData.tags,
        filterData.bookType,
        filterData.name,
        filterData.status,
        true
      )  
    }
    else{
      booksPromise = this.bookService.getAll(
        filterData.tags,
        filterData.bookType,
        filterData.name,
        filterData.status,
        true
      )  
    }


    booksPromise.then(
      results => {
        this.books = results;
      }
    ).catch(
      error => {
        this.displayError(
          "Unexpected error",
          "An unexpected error occured when fetching data from server, please try again."
        )
      }
    )
  }

  public reloadReadingList(){
    this.readingListService.getAll().then(
      (response) => {
        this.readingList = response;
        this.updateBookIdToReadingListEntries();
      }
    ).catch(
      (error) => {
        console.error(error);
        this.displayError(
          "Unexpected error",
          "An unexpected error occured when fetching data from server, please try again."
        )
      }
    )
  }

  public onAddReadingListReceived(bookId : number){
    //Temporarily add the book to the reading list so that the user has instant result of their click
    this.bookIdToReadingListEntry.set(bookId, -1);

    this.readingListService.create(bookId).then(
      () => {
        //Reload the reading list so that we get the ID of the new reading list entry (in case we want to delete it later)
        this.reloadReadingList();
      }
    ).catch(
      (error) => {
        console.error(error)
        this.displayError("Couldn't add book to reading list", "An unexpected error occurred when attempting to add the book to the reading list, please try again.");
        this.updateBookIdToReadingListEntries()
      }
    )
  }

  public onRemoveReadingListReceived(bookId : number){
    let rdid = this.bookIdToReadingListEntry.get(bookId);

    if (rdid == null || rdid == -1){
      this.displayError("Couldn't remove book from reading list", "An unexpected error occurred when attempting to remove the book from the reading list, please try again.");
      return;
    }

    let rdIndex = this.readingList.findIndex(item => item.id == rdid);

    //Keep a backup of the reading list entry in case there's an error
    const rdEntry = JSON.parse(JSON.stringify(this.readingList[rdIndex]));

    this.readingList.splice(rdIndex, 1);
    this.updateBookIdToReadingListEntries();

    this.readingListService.delete(rdid).catch(
      (error) => {
        console.error(error)
        this.displayError("Couldn't remove book from reading list", "An unexpected error occurred when attempting to remove the book from the reading list, please try again.");
        
        //Put book back in the reading list entries when there's an error
        this.readingList.push(rdEntry);
        this.updateBookIdToReadingListEntries();
      }
    )
  }
}
