import { Component, Input } from '@angular/core';
import { ListedBook } from '../../types/listedBook';
import { Tag } from '../../types/tag';
import { BookService } from '../services/book/book.service';
import { TagService } from '../services/tag/tag.service';
import { Router } from '@angular/router';

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

  public showError = false;
  public errTitle = "";
  public errMessage = "";

  constructor(
    private bookService : BookService,
    private tagSercice : TagService,
    private router : Router
  ){
  }
  ngOnInit(){

    let booksPromise = null;
    if (this.personal){
      booksPromise = this.bookService.getAllPersonal(null, null, "", null, true);
    }
    else{
      booksPromise = this.bookService.getAll(null, null, "", null, true);
    }

    const tagsPromise = this.tagSercice.getAll();
    
    let promises = [booksPromise, tagsPromise]

    Promise.all(promises).then(
      results => {

        this.books = results[0] as ListedBook[];
        this.tags = results[1] as Tag[];

        this.dataWasFetched = true;
      }
    )
    .catch(
      error => {
        this.displayError(
          "Unexpected error",
          "An unexpected error occured when fetching data from server, please try again.\nIf the problem persists, contact the support."
        )
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
          "An unexpected error occured when fetching data from server, please try again.\nIf the problem persists, contact the support."
        )
      }
    )
  }
}
