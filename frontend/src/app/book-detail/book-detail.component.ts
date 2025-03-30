import { Component, TemplateRef, ViewChild } from '@angular/core';
import { DetailedBook } from '../../types/detailedBook';
import { BookService } from '../services/book/book.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environments';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RatingService } from '../services/rating/rating.service';
import { RatingData } from '../../types/ratingData';

@Component({
  selector: 'app-book-detail',
  standalone: false,
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})
export class BookDetailComponent {
  private ratingModalRef! : NgbModalRef;
  @ViewChild('ratingModal') ratingModalTemplate!: TemplateRef<any>;

  public dataWasFetched = false;
  public book : DetailedBook | null = null;

  private bookId! : number;
  public apiUrl = environment.apiUrl;

  public modalOperation = "Rate the book";

  public showError = false;
  public errTitle = "";
  public errMessage = "";

  constructor(
    private bookService : BookService,
    private route: ActivatedRoute,
    private modalService : NgbModal,
    private ratingService : RatingService
  ){
  }
  
  ngOnInit(){
    let stringBookId = this.route.snapshot.paramMap.get("id");

    if (stringBookId === null){
      //TO DO - manage error
      return;
    }

    this.bookId = parseInt(stringBookId)

    this.loadBookData();
  }

  loadBookData(){
    this.bookService.getOneById(this.bookId).then(
      result => {
        this.book = result;
        this.dataWasFetched = true;
      }
    ).catch(
      (error) => {
        console.log(error)
      }
    )
  }

  openCreateRatingModal(){
    this.ratingModalRef = this.modalService.open(this.ratingModalTemplate);
  }

  closeRatingModal(){
    if (this.ratingModalRef){
      this.ratingModalRef.close();
    }
  }

  createRating(data : RatingData){
    //We pass the rating from 20 to 25
    let formatted_data = {
      comment : data.comment,
      art_style : (data.art_style!/20) * 25,
      story : (data.story!/20) * 25,
      characters : (data.characters!/20) * 25,
      feeling : (data.feeling!/20) * 25
    }

    this.ratingService.create(
      this.book?.id!,
      formatted_data
    ).then(
      response => {
        console.log("created")
        this.loadBookData();
      }
    )
    .catch(
      error => {
        this.displayError("Unknown error occurred", "An unexpected error occurred when trying to create the rating")
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
}
