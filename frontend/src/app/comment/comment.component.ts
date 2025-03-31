import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Rating } from '../../types/rating';

@Component({
  selector: 'app-comment',
  standalone: false,
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input()
  public rating!: Rating;

  @Input()
  public canDelete : boolean = false;

  @Output()
  public deleteButtonClicked = new EventEmitter<null>();


  public onDeleteClicked(){
    this.deleteButtonClicked.emit()
  }
}
