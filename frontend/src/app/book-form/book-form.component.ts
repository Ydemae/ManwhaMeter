import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from '../../types/tag';
import { BookStatus } from '../../enum/bookStatus';
import { BookType } from '../../enum/bookType';
import { Book } from '../../types/book';

@Component({
  selector: 'app-book-form',
  standalone: false,
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss'
})
export class BookFormComponent {

  @Input()
  public allTagsList! : Tag[];
  @Input()
  public name : string = "";
  @Input()
  public description : string = "";
  @Input()
  public status : BookStatus = BookStatus.ONGOING;
  @Input()
  public bookType : BookType = BookType.WEBTOON;
  @Input()
  public submitLabel : string = "create";

  @Output()
  public cancelEmitter = new EventEmitter<null>();
  @Output()
  public submitEmitter = new EventEmitter<Book>();


  public base64Image : string | ArrayBuffer | null = null;
  public selectedTags : number[] = []

  public allBookTypes! : string[];
  public allBookStatus! : string[];

  public nameError = "";
  public descriptionError = "";
  public statusError = "";
  public bookTypeError = "";
  public selectedTagsError = "";
  public imageError = "";

  ngOnInit(){
    this.allBookTypes = Object.values(BookType);
    this.allBookStatus = Object.values(BookStatus);
  }

  onSubmit(){
    if (!this.validateFields()){
      return
    }

    let book = {
      name : this.name,
      description : this.description,
      tags_ids : this.selectedTags,
      image : (this.base64Image as string).split(",")[1],
      book_type : this.bookType,
      status : this.status
    } as Book

    this.submitEmitter.emit(book);
  }

  onCancel(){
    this.cancelEmitter.emit();
  }

  onImageUpload(event : Event){
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        this.base64Image = reader.result;
      };
    }
    this.validateImage();
  }

  //Input validation

  validateFields() : boolean{
    let isValid = true;

    if (!this.validateName()){
      isValid = false;
    }
    if (!this.validateDescription()){
      isValid = false;
    }
    if (!this.validateTags()){
      isValid = false;
    }
    if (!this.validateImage()){
      isValid = false;
    }

    return isValid;
  }

  validateStringField(stringValue : string, fieldName : string, minLength : number = 2, maxLength : number = 100) : string | null {
    if (stringValue == ""){
      return `The book ${fieldName} can't be empty`
    }

    if (stringValue.length < minLength){
      return `The book ${fieldName} can't be under ${minLength} characters`
    }

    if (stringValue.length > maxLength){
      return `The book ${fieldName} can't be over ${maxLength} characters`
    }

    return null;
  }
  validateName() : boolean{
    this.nameError = "";

    let errorString = this.validateStringField(
      this.name,
      "name",
      3,
      80
    );

    if (errorString === null){
      return true;
    }

    this.nameError = errorString;
    return false;
  }
  validateDescription() : boolean{
    this.descriptionError = "";

    let errorString = this.validateStringField(
      this.description,
      "description",
      25,
      1000
    );
  
    if (errorString === null){
      return true;
    }
  
    this.descriptionError = errorString;
    return false;
  }
  validateTags() : boolean{
    this.selectedTagsError = "";

    if (this.selectedTags.toString() == [].toString()){
      this.selectedTagsError = "At least one tag needs to be specified."
      return false;
    }

    return true;
  }
  validateImage() : boolean{
    this.imageError = "";

    if (this.base64Image == null){
      this.imageError = "The book image is required."
      return false;
    }

    return true;
  }

  onNameChange(){
    this.validateName();
  }
  onDescriptionChange(){
    this.validateDescription();
  }
  onSelectedTagsChange(){
    this.validateTags();
  }
}
