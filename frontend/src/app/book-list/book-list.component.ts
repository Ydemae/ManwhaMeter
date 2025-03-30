import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListedBook } from '../../types/listedBook';

@Component({
  selector: 'app-book-list',
  standalone: false,
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent {

  @Input()
  public books! : Array<ListedBook>

  @Output()
  public bookClickedEventEmitter = new EventEmitter<number>()

  receiveBookClickedEvent(bookId : number){
    console.log(bookId)
    this.bookClickedEventEmitter.emit(bookId)
  }
}
