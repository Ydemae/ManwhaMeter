import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from '../../types/tag';
import { BookStatus } from '../../enum/bookStatus';
import { BookType } from '../../enum/bookType';

@Component({
  selector: 'app-search-filters',
  standalone: false,
  templateUrl: './search-filters.component.html',
  styleUrl: './search-filters.component.scss'
})
export class SearchFiltersComponent {

  public statusList! : Array<string>;
  public bookTypeList! : Array<string>;
  @Input()
  public tagsList! : Array<Tag>;

  @Output()
  private filterChangeEmitter = new EventEmitter<{
    name : string,
    status : string | null,
    tags : Array<number>,
    bookType : string | null
  }>();

  public selectedStatus : number | null = null;

  public filtersValues : {
    name : string,
    status : string | null,
    tags : Array<number>,
    bookType : string | null
  } = {
    name : "",
    status : null,
    tags : [],
    bookType : null
  }

  ngOnInit(){
    this.statusList = Object.values(BookStatus)
    this.bookTypeList = Object.values(BookType)
  }

  emitFilterChanges(){
    this.filterChangeEmitter.emit(this.filtersValues)
  }

  onSelectedTagsChange(){
    this.emitFilterChanges()
  }

  onBookNameChange(){
    this.emitFilterChanges()
  }

  onSelectedStatusChange(event : Event){
    const target = event.target as HTMLInputElement;
    this.filtersValues.status = this.extractEntityIdFromHtmlId(target.id);
    this.emitFilterChanges()
  }

  onSelectedBookTypeChange(event : Event){
    const target = event.target as HTMLInputElement;
    this.filtersValues.bookType = this.extractEntityIdFromHtmlId(target.id);
    this.emitFilterChanges()
  }

  extractEntityIdFromHtmlId(htmlId : string) : string{
    return htmlId.split(";")[1]
  }
}
