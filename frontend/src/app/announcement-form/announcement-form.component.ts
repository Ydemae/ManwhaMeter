import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-announcement-form',
  standalone: false,
  templateUrl: './announcement-form.component.html',
  styleUrl: './announcement-form.component.scss'
})
export class AnnouncementFormComponent {

  @Input()
  public label! : string;

  @Output()
  public submitEmitter = new EventEmitter<{id : number, title : string, message : string}>();

  @Input()
  public title : string = "";
  @Input()
  public message : string = "";
  @Input()
  public id : number = -1;

  public error = {
    title : "",
    message : ""
  }

  submit(){
    this.error["title"] = "";
    this.error["message"] = "";

    let error = false;
    if (this.title == ""){
      this.error["title"] = "Title cannot be empty";
      error = true;
    }
    if (this.title.length >= 255){
      this.error["title"] = "Title cannot be over 255 chars";
      error = true;
    }
    if (this.message == ""){
      this.error["message"] = "Message cannot be empty";
      error = true;
    }
    if (this.message.length >= 10000){
      this.error["message"] = "Message cannot be over 10000 chars";
      error = true;
    }

    if (error == true){
      return;
    }

    this.submitEmitter.emit({id:this.id, title:this.title, message:this.message});
  }
}
