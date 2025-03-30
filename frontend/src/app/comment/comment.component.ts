import { Component, Input } from '@angular/core';
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
}
