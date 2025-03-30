import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RatingData } from '../../types/ratingData';

@Component({
  selector: 'app-rating-form',
  standalone: false,
  templateUrl: './rating-form.component.html',
  styleUrl: './rating-form.component.scss'
})
export class RatingFormComponent {

  @Input()
  public formData! : RatingData;

  @Output()
  public formDataEmitter = new EventEmitter<RatingData>();

  onDataChange(){
    this.formDataEmitter.emit(this.formData);
  }
}
