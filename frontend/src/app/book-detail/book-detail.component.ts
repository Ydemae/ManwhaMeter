import { Component, TemplateRef, ViewChild } from '@angular/core';
import { DetailedBook } from '../../types/detailedBook';
import { BookService } from '../services/book/book.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environments';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RatingService } from '../services/rating/rating.service';
import { RatingData } from '../../types/ratingData';
import { Rating } from '../../types/rating';
import { RatingModalOperation } from '../../enum/ratingModalOperation';

@Component({
  selector: 'app-book-detail',
  standalone: false,
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})
export class BookDetailComponent {
  private ratingModalRef! : NgbModalRef;
  @ViewChild('ratingModal') ratingModalTemplate!: TemplateRef<any>;

  private confirmModalRef! : NgbModalRef;
  @ViewChild('deleteRatingConfirmModal') confirmModalTemplate!: TemplateRef<any>;

  public bookFetched = false;
  public personalRatingFetched = false;

  public book : DetailedBook | null = null;

  private bookId! : number;
  public apiUrl = environment.apiUrl;

  public ratingModalOperation = RatingModalOperation.CREATE;

  //The user's rating on the book if it exists
  public personalRating : Rating | null = null;

  public showError = false;
  public errTitle = "";
  public errMessage = "";

  public bookRatingToUpdate : RatingData | null = null

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
    let getBookDetailPromise = this.bookService.getOneById(this.bookId).catch(
      (error) => {
        this.displayError(
          "Unexpected error",
          "An unexpected error occurred when attempting to get the book details"
        )
      }
    )

    let getPersonalRatingPromise = this.ratingService.getOneByBookId(this.bookId).catch(
      error => {
        //errcode 2 means that the user just didn't rate the book, not a true error
        console.log(error)

        if (error["errcode"] != 2){
          this.displayError(
            "Unexpected error",
            "An unexpected error occurred when attempting to fetch personal rating on this book"
          )
          return
        }
        this.personalRatingFetched = true;
      }
    )

    Promise.all([getBookDetailPromise, getPersonalRatingPromise]).then(
      results => {
        this.book = results[0]!;
        this.personalRating = results[1]!;

        if (this.personalRating){
          for (let i = 0; i < this.book.ratings.length; i++){
            if (this.book.ratings[i].id == this.personalRating.id){
              this.book.ratings.splice(i,1);
            }
          }
        }
        
        this.personalRatingFetched = true;
        this.bookFetched = true;
    })
  }

  onDeleteButtonClicked(){
    this.openDeleteRatingConfirmModal()
  }

  removePersonalRatingFromRatingList(){
    if (!this.book || !this.personalRating){
      return
    }

    for(let i = 0; i < this.book?.ratings.length!; i++){

    }
  }

  openCreateRatingModal(){
    this.ratingModalOperation = RatingModalOperation.CREATE;
    this.openRatingModal();
  }

  openUpdateRatingModal(){
    if (!this.personalRating){
      return;
    }

    let ratingData : RatingData = this.convertRatingDataFrom25To20({
      comment : this.personalRating.comment,
      story : this.personalRating.story,
      art_style : this.personalRating.art_style,
      feeling : this.personalRating.feeling,
      characters : this.personalRating.characters,
    })

    this.bookRatingToUpdate = ratingData;
    this.ratingModalOperation = RatingModalOperation.UPDATE;
    this.openRatingModal();
  }

  openRatingModal(){
    this.ratingModalRef = this.modalService.open(this.ratingModalTemplate);
  }

  closeRatingModal(){
    this.bookRatingToUpdate = null;
    if (this.ratingModalRef){
      this.ratingModalRef.close();
    }
  }

  createRating(data : RatingData){
    let formatted_data = this.convertRatingDataFrom20To25(data);

    this.ratingService.create(
      this.book?.id!,
      formatted_data
    ).then(
      response => {
        this.loadBookData();
        this.closeRatingModal();
      }
    )
    .catch(
      error => {
        this.displayError("Unknown error occurred", "An unexpected error occurred when trying to create the rating")
      }
    )
  }

  updateRating(data : RatingData){
    if (!this.personalRating){
      return;
    }

    let formatted_data = this.convertRatingDataFrom20To25(data);

    this.ratingService.update(
      this.book?.id!,
      this.personalRating?.id!,
      formatted_data
    ).then(
      response => {
        this.loadBookData();
        this.closeRatingModal();
      }
    )
    .catch(
      error => {
        this.displayError("Unknown error occurred", "An unexpected error occurred when trying to update the rating")
      }
    )
  }

  onRatingModalSubmit(data : RatingData){
    if (this.ratingModalOperation === RatingModalOperation.CREATE){
      this.createRating(data)
    }
    else{
      this.updateRating(data)
    }
  }

  convertRatingDataFrom20To25(data : RatingData) : RatingData{
    return {
      comment : data.comment,
      art_style : Math.round((data.art_style!/20) * 25 * 100) / 100,
      story : Math.round((data.story!/20) * 25 * 100) / 100,
      characters : Math.round((data.characters!/20) * 25 * 100) / 100,
      feeling : Math.round((data.feeling!/20) * 25 * 100) / 100
    }
  }

  convertRatingDataFrom25To20(data : RatingData) : RatingData{
    return {
      comment : data.comment,
      art_style : Math.round((data.art_style!/25) * 20 * 100) / 100,
      story : Math.round((data.story!/25) * 20 * 100) / 100,
      characters : Math.round((data.characters!/25) * 20 * 100) / 100,
      feeling : Math.round((data.feeling!/25) * 20 * 100) / 100
    }
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

  openDeleteRatingConfirmModal(){
    this.confirmModalRef = this.modalService.open(this.confirmModalTemplate);
  }

  closeDeleteRatingConfirmModal(){
    if (this.confirmModalRef){
      this.confirmModalRef.close();
    }
  }

  deletePersonalRating(){
    this.closeDeleteRatingConfirmModal()

    if (!this.personalRating){
      return
    }

    this.ratingService.delete(this.personalRating.id).then(
      (response) => {
        this.personalRating = null;
      }
    )
    .catch(
      (error) => {
        this.displayError("Unexcpected error", "Could not delete your rating");
      }
    )
  }
}
