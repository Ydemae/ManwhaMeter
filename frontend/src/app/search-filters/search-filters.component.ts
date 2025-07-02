// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

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

  extractEntityIdFromHtmlId(htmlId : string) : string{
    return htmlId.split(";")[1]
  }

  onSelectStatus(status : string, inputElement : HTMLInputElement){
    if (status != this.filtersValues.status){
      this.filtersValues.status = status;
    }
    else{
      this.filtersValues.status = null;
      inputElement.checked = false;
    }
    this.emitFilterChanges()
  }

  onSelectBookType(booktype : string, inputElement : HTMLInputElement){
    if (booktype != this.filtersValues.bookType){
      this.filtersValues.bookType = booktype;
    }
    else{
      this.filtersValues.bookType = null;
      inputElement.checked = false;
    }
    this.emitFilterChanges()
  }
}
