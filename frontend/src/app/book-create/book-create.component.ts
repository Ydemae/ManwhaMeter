// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { Component } from '@angular/core';
import { Tag } from '../../types/tag';
import { TagService } from '../services/tag/tag.service';
import { Book } from '../../types/book';
import { BookService } from '../services/book/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-create',
  standalone: false,
  templateUrl: './book-create.component.html',
  styleUrl: './book-create.component.scss'
})
export class BookCreateComponent {
  public dataFetched = false;
  public allTagsList! : Tag[];

  public showError = false;
  public errTitle = "";
  public errMessage = "";

  constructor(
    private tagService : TagService,
    private bookService : BookService,
    private router : Router
  ){}

  displayError(
    title : string,
    message : string
  ){
    this.errTitle = title;
    this.errMessage = message;
    this.showError = true;
  }

  hideError(){
    this.showError = false;
  }

  onCreate(data : Book){
    this.bookService.create(data).then(
      response => {
        if (response === true){
          this.router.navigate(["/booklist"])
        }
        else{
          this.displayError("Unexpected error", "An error occurred with your request, some of your data may be wrong.")
        }
      }
    )
    .catch(
      error => {
        this.displayError("Unexpected error", "An unexpected error occurred when trying to create the book, please try again in a few minutes.")
      }
    )
  }

  onCancel(){
    this.router.navigate(["/booklist"])
  }

  ngOnInit(){
    this.tagService.getAll().then(
      response => {
        this.allTagsList = response
        this.dataFetched = true;
      }
    )
    .catch(
      error => {
        this.displayError(
          "Unknown error occurred",
          "An Unknwon error occurred when trying to fetch tags, please contact the support if the problem persists"
        )
      }
    )
  }
}
