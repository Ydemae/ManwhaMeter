import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Rating } from '../../types/rating';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-comment-list',
  standalone: false,
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss'
})
export class CommentListComponent {
  @Input()
  public ratingsList! : Rating[];

  @Output()
  public deleteEmitter = new EventEmitter<[number, number]>();

  constructor(
    private authService : AuthService
  ){}

  isAdmin() : boolean{
    return this.authService.isAdminSubject.value
  }

  onDeleteButtonClicked(identifier : number, index : number){
    this.deleteEmitter.emit([identifier, index]);
  }
}
