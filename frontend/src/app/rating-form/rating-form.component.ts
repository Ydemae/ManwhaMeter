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

  onCommentChange(){
    this.validateComment();
  }
  onStoryChange(){
    this.validateStory();
  }
  onArtStyleChange(){
    this.validateArtStyle();
  }
  onFeelingChange(){
    this.validateFeeling();
  }
  onCharactersChange(){
    this.validateCharacters();
  }

  sendCorrectFlag(){
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
    let valid = true;

    // Could be made with only one if but I want to display all the errors, not only the first one that triggers the condition
    if (!this.validateComment()){
      valid = false;
    }
    if (!this.validateArtStyle()){
      valid = false;
    }
    if (!this.validateCharacters()){
      valid = false;
    }
    if (!this.validateFeeling()){
      valid = false;
    }
    if (!this.validateStory()){
      valid = false;
    }

    return valid;
  }

  validateComment() : boolean{
    this.errors.comment = "";
    if (this.formData.comment.length > 2000){
      this.errors.comment = "The comment must not be over 2000 characters.";
      return false;
    }

    if (this.formData.comment.length < 5){
      this.errors.comment = "Please put at least 5 characters in your comment.";
      return false;
    }

    return true;
  }
  validateArtStyle(){
    this.errors.art_style = ""

    const validationResult = this.validateGradeField(this.formData.art_style!);

    if (validationResult != ""){
      this.errors.art_style = validationResult.replace("[Field]", "Art style grade");
      return false;
    }

    return true;
  }
  validateStory(){
    this.errors.story = ""
    const validationResult = this.validateGradeField(this.formData.story!);

    if (validationResult != ""){
      this.errors.story = validationResult.replace("[Field]", "Story grade");
      return false;
    }

    return true;
  }
  validateFeeling(){
    this.errors.feeling = ""

    const validationResult = this.validateGradeField(this.formData.feeling!);

    if (validationResult != ""){
      this.errors.feeling = validationResult.replace("[Field]", "Feeling grade");
      return false;
    }

    return true;
  }
  validateCharacters() : boolean{
    this.errors.characters = ""

    const validationResult = this.validateGradeField(this.formData.characters!);

    if (validationResult != ""){
      this.errors.characters = validationResult.replace("[Field]", "Characters grade");
      return false;
    }

    return true;
  }
  validateGradeField(value : number) : string{
    if (value === null || value === undefined){
      return "[Field] grade is empty.";
    }
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
