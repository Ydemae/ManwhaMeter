import { Component, Input } from '@angular/core';
import { Rating } from '../../types/rating';

@Component({
  selector: 'app-comment-list',
  standalone: false,
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss'
})
export class CommentListComponent {
  @Input()
  public ratingsList! : Rating[];
}
