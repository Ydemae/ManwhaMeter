import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit{

  @Input()
  public passwordErrorObservable! : Observable<any>;

  @Input()
  public loading : boolean = false;

  @Output()
  public submitEmitter = new EventEmitter<{oldPassword : string, newPassword : string, confirmPassword : string}>();

  public error = {
    oldPassword : "",
    newPassword : "",
    confirmNewPassword : "",
    main : ""
  }

  public oldPassword = "";
  public newPassword = "";
  public confirmNewPassword = "";

  ngOnInit(): void {
    this.passwordErrorObservable.subscribe(
      data =>{
        this.error.main = "Incorrect password";
      }
    )
  }

  oldPasswordChange(password : string){
    this.oldPassword = password;
    this.validateOldPassword();
  }

  newPasswordChange(password : string){
    this.newPassword = password;
    this.validateNewPassword();
  }

  confirmNewPasswordChange(password : string){
    this.confirmNewPassword = password;
    this.validateConfirmPassword();
  }

  validateOldPassword(): boolean{
    let error = this.validatePassword(this.oldPassword);
    this.error.oldPassword = error;
    return error == "";
  }

  validateNewPassword(): boolean{
    let error = this.validatePassword(this.newPassword);
    this.error.newPassword = error;
    return error == "";
  }

  validateConfirmPassword(): boolean{    
    let error = this.validatePassword(this.confirmNewPassword);

    if (error == ""){
      if (this.confirmNewPassword != this.newPassword){
        error = "Both passwords aren't the same"
      }
    }
  
    this.error.confirmNewPassword = error
    return error == "";
  }

  validatePassword(password : string) : string{
    this.error.main = "";
    if (password == ""){
      return password = "Password cannot be empty";
    }

    if (password.length < 4 || password.length > 60){
      return "Password must be between 8-60 chars.";
    }

    return "";
  }

  validateAll() : boolean{
    let okay = true;

    if (!this.validateConfirmPassword()){
      okay = false;
    }
    if(!this.validateNewPassword){
      okay = false;
    }
    if (!this.validateOldPassword){
      okay = false;
    }

    return okay
  }

  submit(){
    if (!this.validateAll()){
      this.error.main = "Couldn't submit password change form";
      return;
    }

    this.submitEmitter.emit(
      {
        oldPassword : this.oldPassword,
        newPassword : this.newPassword,
        confirmPassword : this.confirmNewPassword
      }
    )
  }
}
