import { Component, OnInit } from '@angular/core';
import { Tag } from '../../types/tag';
import { TagService } from '../services/tag/tag.service';
import { BookService } from '../services/book/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../types/book';
import { DetailedBook } from '../../types/detailedBook';
import { BookType } from '../../enum/bookType';
import { BookStatus } from '../../enum/bookStatus';
import { FlashMessageService } from '../services/flashMessage/flash-message.service';

@Component({
  selector: 'app-book-edit',
  standalone: false,
  templateUrl: './book-edit.component.html',
  styleUrl: './book-edit.component.scss'
})
export class BookEditComponent implements OnInit {

  public id! : number;

  public dataFetched = false;
  public loadingFailed = false;
  public allTagsList! : Tag[];
  public book! : DetailedBook;

  public showError = false;
  public errTitle = "";
  public errMessage = "";

  constructor(
    private tagService : TagService,
    private bookService : BookService,
    private router : Router,
    private route : ActivatedRoute,
    private flashMessageSercice : FlashMessageService
  ){}

  ngOnInit(){
    let id = this.route.snapshot.paramMap.get('id');

    if (id == null || id == undefined || !parseInt(id)){
      this.displayError("Parameter error", "The id passed as parameter for edition is not valid");
      return;
    }

    this.id = parseInt(id);

    this.loadData(this.id);
  }

  loadData(bookId : number){
    this.loadingFailed = false;
    this.dataFetched = false;

    let tagPromise = this.tagService.getAll();
    let bookPromise = this.bookService.getOneById(bookId);

    Promise.all([bookPromise, tagPromise]).then(
      results => {
        this.book = results[0];
        this.allTagsList = results[1];
        this.dataFetched = true;
      }
    ).catch(
      error => {
        this.displayError(
          "Unknown error occurred",
          "An Unknwon error occurred when trying to fetch tags, please contact the support if the problem persists"
        )
      })
    }

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

  onSubmit(data : Book){
    
    let updateRequestBody : any = {}

    updateRequestBody["id"] = this.book.id;

    if (this.book.name != data.name){
      updateRequestBody["name"] = data.name;
    }
    if (this.book.description != data.description){
      updateRequestBody["description"] = data.description;
    }
    if (this.book.image_path != data.image && data.image != ""){
      updateRequestBody["image"] = data.image;
    }

    let tags = []
    for (let i = 0; i < this.book.tags.length; i++){
      tags.push(this.book.tags[i].id);
    }

    if (JSON.stringify(tags) != JSON.stringify(data.tags_ids)){
      updateRequestBody["tags_ids"] = data.tags_ids;
    }
    if (this.book.bookType as BookType != data.book_type as BookType){
      updateRequestBody["book_type"] = data.book_type;
    }
    if (this.book.status as BookStatus != data.status as BookStatus){
      updateRequestBody["status"] = data.status;
    }


    this.bookService.update(updateRequestBody).then(
      response => {
        if (response === true){
          this.flashMessageSercice.setFlashMessage("Book successfully updated");
          this.router.navigate([`/bookdetail/${this.book!.id}`])
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
}
