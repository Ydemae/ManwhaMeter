import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tag-create-modal',
  standalone: false,
  templateUrl: './tag-create-modal.component.html',
  styleUrl: './tag-create-modal.component.scss'
})
export class TagCreateModalComponent {
  @Output()
  public closeModalEmitter = new EventEmitter<null>()

  @Output()
  public submitDataEmitter = new EventEmitter<string>();

  public label : string = "";

  public error  = {
    label : ""
  }

  close(){
    this.closeModalEmitter.emit()
  }

  validateFields(){
    let valid = true;

    if (this.label == ""){
      this.error.label = "Label cannot be empty";
      valid = false;
    }
    else if (this.label.length > 80){
      this.error.label = "Label cannot be over 80 chars";
      valid = false;
    }
    return valid;
  }


  onSubmit(){
    if (!this.validateFields()){
      return;
    }
    
    this.submitDataEmitter.emit(this.label!);
  }
}
