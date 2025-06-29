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
  public logged! : boolean;

  @Input()
  public books! : Array<ListedBook>;

  @Input()
  public bookIdToReadingListEntry : Map<number, number> = new Map();

  @Input()
  public ranked : boolean = true;

  @Output()
  public bookClickedEventEmitter = new EventEmitter<number>()

  @Output()
  private addReadingListEmitter = new EventEmitter<number>();

  @Output()
  private removeReadingListEmitter = new EventEmitter<number>();

  receiveBookClickedEvent(bookId : number){
    this.bookClickedEventEmitter.emit(bookId)
  }

  public onAddReadingListReceived(bookId : number){
    this.addReadingListEmitter.emit(bookId);
  }

  public onRemoveReadingListReceived(bookId : number){
    this.removeReadingListEmitter.emit(bookId);
  }
}
