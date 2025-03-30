import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RatingData } from '../../types/ratingData';

@Component({
  selector: 'app-rating-modal',
  standalone: false,
  templateUrl: './rating-modal.component.html',
  styleUrl: './rating-modal.component.scss'
})
export class RatingModalComponent {
  @Output()
  public closeModalEmitter = new EventEmitter<null>()

  @Output()
  public submitDataEmitter = new EventEmitter<RatingData>();

  @Input()
  public bookRating! : RatingData;

  @Input()
  public modalTitle! : string;

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

  close(){
    this.closeModalEmitter.emit()
  }

  onSubmit(){
    this.submitDataEmitter.emit(this.bookRating);
  }
}
