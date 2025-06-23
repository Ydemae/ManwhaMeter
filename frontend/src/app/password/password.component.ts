import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-password',
  standalone: false,
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss'
})
export class PasswordComponent {

  @Input()
  public password! : string;

  @Input()
  public label : string = "Password";

  @Output()
  public passwordChangeEvent = new EventEmitter<string>();

  @Input()
  public error : string = "";

  public showPassword : boolean = false;

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }

  onPasswordChange(){
    this.passwordChangeEvent.emit(this.password);
  }

}
