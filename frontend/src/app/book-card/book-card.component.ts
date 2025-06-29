import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListedBook } from '../../types/listedBook';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-book-card',
  standalone: false,
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent {
  @Input()
  public book! : ListedBook;
  public displayedTags : string = "";

  @Input()
  public logged : boolean = false;

  @Input()
  public inReadingList : boolean = false;

  @Input()
  public ranked : boolean = true;

  @Output()
  private clickEmitter = new EventEmitter<number>();

  @Output()
  private addReadingListEmitter = new EventEmitter<number>();

  @Output()
  private removeReadingListEmitter = new EventEmitter<number>();

  public apiUrl = environment.apiUrl;

  ngOnInit(){
    this.initializeDisplayedTags()
  }

  public onBookClicked(){
    this.clickEmitter.emit(this.book.id)
  }

  public onAddReadingListClicked(event : MouseEvent){
    event.stopPropagation();
    this.addReadingListEmitter.emit(this.book.id);
  }

  public onRemoveReadingListClicked(event : MouseEvent){
    event.stopPropagation();
    this.removeReadingListEmitter.emit(this.book.id);
  }

  private initializeDisplayedTags(){
    for (let i = 0; i < this.book.tags.length; i++){
      if (i > 0){
        this.displayedTags += ", ";
      }

      this.displayedTags += this.book.tags[i]

      if (i > 2){
        return
      }
    }
  }
}
