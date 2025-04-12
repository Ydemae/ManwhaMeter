import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RatingData } from '../../types/ratingData';

@Component({
  selector: 'app-rating-modal',
  standalone: false,
  templateUrl: './rating-modal.component.html',
  styleUrl: './rating-modal.component.scss'
})
export class RatingModalComponent implements OnInit, OnChanges{
  @Output()
  public closeModalEmitter = new EventEmitter<null>()

  @Output()
  public submitDataEmitter = new EventEmitter<RatingData>();

  @Input()
  public bookRating : RatingData | null = null;

  @Input()
  public modalTitle! : string;

  public correctFlag : boolean = false;
  public errorMessage : string = "";

  ngOnInit(){
    if (this.bookRating === null || this.bookRating === undefined){
      this.bookRating = {
        comment: "",
        story : null,
        art_style : null,
        characters : null,
        feeling : null
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.bookRating === null || this.bookRating === undefined){
      this.bookRating = {
        comment: "",
        story : null,
        art_style : null,
        characters : null,
        feeling : null
      }
    }
  }

  close(){
    this.closeModalEmitter.emit()
  }

  updateCorrectFlag(flag : boolean){
    this.errorMessage = "";
    this.correctFlag = flag;
  }

  onSubmit(){
    if (!this.correctFlag){
      this.errorMessage = "At least one of the form's field is not correct"
      return;
    }
    
    this.submitDataEmitter.emit(this.bookRating!);
  }
}
