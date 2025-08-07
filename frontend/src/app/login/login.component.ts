// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { FlashMessageService } from '../services/flashMessage/flash-message.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  public errorIsShown = false
  public errTitle = ""
  public errMessage = ""

  public username : string = "";
  public password : string = "";
  public querying : boolean = false;

  public error = {
    password : "",
    username : "",
    global : ""
  }

  public flashMessage : string | null = null;

  constructor(
    private flashMessageService : FlashMessageService,
    private authService : AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let flashMessage = this.flashMessageService.getFlashMessage()

    this.flashMessage = flashMessage;
  }

  hideFlashMessage(){
    this.flashMessage = null;
  }

  hideError(){
    this.errorIsShown = false;
  }

  showError(
    errTtile : string,
    errMessage : string
  ){
    this.errTitle = errTtile;
    this.errMessage = errMessage;
    this.errorIsShown = true;
  }

  onPasswordChange(password: string){
    this.password = password;
    this.validatePassword();
  }

  onUsernameChange(){
    this.validateUsername();
  }

  validatePassword(){
    this.error.password = "";

    if (this.password == ""){
      this.error.password = "Password is empty";
      return false;
    }

    return true;
  }

  validateUsername(){
    this.error.username = "";

    if (this.username == ""){
      this.error.username = "Username is empty";
      return false;
    }

    return true;
  }

  onSubmit(): void {
    let valid = true;

    if (!this.validatePassword()){
      valid = false;
    }
    if (!this.validateUsername()){
      valid = false;
    }

    if (valid === false){
      return;
    }

    this.authenticate(this.username, this.password);
  }

  authenticate(username: string, password: string): void {
    this.error.global = "";
    this.querying = true;
    this.authService.login(username,password).then(
        (response) => {
            if (response === 0){
                this.router.navigate(["/home"])
            }
            else{
              this.showError(
                "Invalid credentials",
                "Invalid identifier or password"
              )
              this.querying = false;
            }
        }
    ).catch(
      (error) => {
        if (error == 2){
          this.error.global = "This account is disabled. If you don't know why your account was disabled, please contact your server owner";
        }
        else if (error == 3){
          this.error.global = "Incorrect credentials";
        }
        else{
          this.showError(
            "Unexpected error occurred",
            "Please contact the your server owner if the problem persists"
          )
        }
      }
    )
  }
}
