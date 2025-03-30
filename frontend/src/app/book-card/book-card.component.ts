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

  @Output()
  private clickEmitter = new EventEmitter<number>();

  public apiUrl = environment.apiUrl;

  ngOnInit(){
    this.initializeDisplayedTags()
  }

  public onBookClicked(){
    this.clickEmitter.emit(this.book.id)
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
