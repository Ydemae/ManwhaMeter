// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { FlashMessageService } from '../services/flashMessage/flash-message.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{

  public inviteUid : string = "";

  public querying : boolean = false;

  public usernameAvailable : boolean | null = null;
  public usernameAvailableLabel : string = "";

  public formData = {
    password : "",
    confirmPassword : "",
    username : "",
    profilePicture : "",
    terms : false,
  }

  public formError = {
    password : "",
    confirmPassword : "",
    username : "",
    profilePicture : "",
    terms : "",
    invite : ""
  }

  public showError = false;
  public errTitle = "";
  public errMessage = "";

  constructor(
    private authService : AuthService,
    private router : Router,
    private route : ActivatedRoute,
    private userService : UserService,
    private flashMessageService : FlashMessageService
  ){}

  ngOnInit(): void {
    //Redirects to home if the user is already logged in
    if (this.authService.isLoggedInSubject.value){
      this.router.navigate(["/home"])
    }

    let inviteUid = this.route.snapshot.paramMap.get("uid");

    if (inviteUid === null){
      return;
    }

    this.inviteUid = inviteUid
  }

  validateAllFields() : boolean{
    let valid = true;

    if (!this.validatePassword()){
      valid = false;
    }
    if (!this.validateConfirmPassword()){
      valid = false;
    }
    if (!this.validateUsername()){
      valid = false;
    }
    if (!this.validateProfilePicture()){
      valid = false;
    }
    if (!this.validateTerms()){
      valid = false;
    }
    if (!this.validateInvite()){
      valid = false;
    }

    return valid;
  }

  validateInvite(){
    this.formError.invite = "";
    if (this.inviteUid == ""){
      this.formError.invite = "InviteUid cannot be empty.";
      return false;
    }

    return true;
  }
  validateTerms(){
    this.formError.terms = "";
    if (this.formData.terms == false){
      this.formError.terms = "You must agree to the terms of service to register.";
      return false;
    }

    return true;
  }

  onPasswordChange(password : string){
    this.formData.password = password;
    this.validatePassword();
    this.validateConfirmPassword();
  }
  onConfirmPasswordChange(password : string){
    this.formData.confirmPassword = password;
    this.validateConfirmPassword();
  }

  validatePassword() : boolean{
    this.formError.password = "";

    if (this.formData.password == ""){
      this.formError.password = "Password cannot be empty";
      return false;
    }

    if (this.formData.password.length < 8 || this.formData.password.length > 60){
      this.formError.password = "Password must be between 8-60 chars.";
      return false;
    }

    return true;
  }

  validateConfirmPassword() : boolean{
    this.formError.confirmPassword = "";
    
    if (this.formData.confirmPassword != this.formData.password){
      this.formError.confirmPassword = "Passwords do not match";
      return false;
    }

    return true;
  }
  validateUsername(){
    this.formError.username = "";

    if (this.formData.username == ""){
      this.formError.username = "Username cannot be empty";
      return false;
    }

    return true;
  }
  validateProfilePicture() : boolean{
    this.formError.profilePicture = "";

    //TO DO - validation when implementing profile picture

    return true;
  }

  checkUsernameAvailability(){
    this.usernameAvailable = null;

    if (this.formData.username == ""){
      return;
    }
    if (!this.validateInvite()){
      return;
    }

    this.userService.usernameExists(this.formData.username, this.inviteUid).then(
      (result) => {
        this.usernameAvailableLabel = !result == true ? "Username is available" : "Username is not available";

        this.usernameAvailable = !result
      }
    ).catch(
      error => {
        if (error == 2){
          this.formError.invite = "Invite is invalid";
        }
        else{
          this.displayError(
            "Unexpected error",
            "An unexpected error occured when checking username availability, please try again."
          )
        }
      }
    )
  }

  onUsernameChange(){
    this.validateUsername()
    this.checkUsernameAvailability()
  }

  registerUser(){
    if (!this.validateAllFields()){
      return;
    }

    this.querying = true;

    if (!this.usernameAvailable){
      this.querying = false;
      this.displayError("Unverified username", "Your username was not verified or is already taken. Sometimes you submit the form before the username was verified, please try again after a few seconds.")
      return;
    }

    this.userService.create(
      this.formData.username,
      this.formData.password,
      this.formData.profilePicture,
      this.inviteUid
    ).then(
      result => {
        if (result == true){
          this.flashMessageService.setFlashMessage("Account successfully created, you can now sign in !");
          this.querying = false;
          this.router.navigate(["/login"]);
        }
        else{
          this.querying = false;
          this.displayError(
            "Unexpected error",
            "An unexpected error occured when creating the user, please try again."
          )
        }
      }
    ).catch(
      error => {
        this.querying = false;
        if (error == 403){
          this.displayError(
            "Expired invite",
            "You invite either doesn't exist or has expired."
          )
        }
        else{
          this.displayError(
            "Unexpected error",
            "An unexpected error occured when creating the user, please try again."
          )
        }
      }
    )
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

  cancel(){
    this.router.navigate(["/home"]);
  }
}
