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
  @Input()
  public canEdit : boolean = false;

  @Output()
  public deleteButtonClicked = new EventEmitter<null>();
  @Output()
  public editButtonClicked = new EventEmitter<null>();

  public totalRating : number = 0;

  ngOnInit(){
    this.totalRating = this.rating.art_style + this.rating.characters + this.rating.feeling + this.rating.story
  }

  public onDeleteClicked(){
    this.deleteButtonClicked.emit()
  }

  public onEditClicked(){
    this.editButtonClicked.emit()
  }
}
