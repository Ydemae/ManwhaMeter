import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RatingData } from '../../types/ratingData';

@Component({
  selector: 'app-rating-form',
  standalone: false,
  templateUrl: './rating-form.component.html',
  styleUrl: './rating-form.component.scss'
})
export class RatingFormComponent {

  @Input()
  public formData! : RatingData;

  @Output()
  public correctDataFlag = new EventEmitter<boolean>();

  onDataChange(){
    this.correctDataFlag.emit(this.validateAllFields());
  }

  public errors = {
    "comment" : "",
    "story" : "",
    "art_style" : "",
    "characters" : "",
    "feeling" : "",
  }

  validateAllFields() : boolean{
    if (
      !this.validateComment() ||
      !this.validateArtStyle() ||
      !this.validateCharacters() ||
      !this.validateFeeling() ||
      !this.validateStory()
    ){
      return false;
    }

    return true;
  }

  validateComment() : boolean{
    if (this.formData.comment.length > 2000){
      this.errors.comment = "The comment must not be over 2000 characters.";
      return false;
    }

    if (this.formData.comment.length < 20){
      this.errors.comment = "Please put at least 20 characters in your comment.";
      return false;
    }

    return true;
  }
  validateArtStyle(){
    this.errors.art_style = ""
    if (!this.formData.art_style){
      this.errors.art_style = "Art style grade cannot be null.";
    }

    const validationResult = this.validateGradeField(this.formData.art_style!);

    if (validationResult != ""){
      this.errors.art_style = validationResult.replace("[Field]", "Art style grade");
      return false;
    }

    return true;
  }
  validateStory(){
    this.errors.story = ""
    if (!this.formData.story){
      this.errors.story = "Story grade cannot be null.";
    }

    const validationResult = this.validateGradeField(this.formData.story!);

    if (validationResult != ""){
      this.errors.story = validationResult.replace("[Field]", "Story grade");
      return false;
    }

    return true;
  }
  validateFeeling(){
    this.errors.feeling = ""
    if (!this.formData.feeling){
      this.errors.feeling = "Feeling grade cannot be null.";
    }

    const validationResult = this.validateGradeField(this.formData.feeling!);

    if (validationResult != ""){
      this.errors.feeling = validationResult.replace("[Field]", "Feeling grade");
      return false;
    }

    return true;
  }
  validateCharacters() : boolean{
    this.errors.characters = ""
    if (!this.formData.characters){
      this.errors.characters = "Characters grade cannot be null.";
    }

    const validationResult = this.validateGradeField(this.formData.characters!);

    if (validationResult != ""){
      this.errors.characters = validationResult.replace("[Field]", "Characters grade");
      return false;
    }

    return true;
  }
  validateGradeField(value : number) : string{
    if (isNaN(value)){
      return "[Field] is not a number.";
    }
    if (value > 25){
      return "[Field] cannot be over 25.";
    }
    if (value < 0){
      return "[Field] must be positive.";
    }
    return ""
  }
}
