import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailedUser } from '../../types/detailedUser';
import { UserService } from '../services/user/user.service';
import { T } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{

  public showPassword : boolean = false

  private inviteUid! : string;

  public usernameAvailable : boolean | null = null;
  public usernameAvailableLabel : string = "";

  public formData = {
    password : "",
    confirmPassword : "",
    username : "",
    profilePicture : ""
  }

  public formError = {
    password : "",
    confirmPassword : "",
    username : "",
    profilePicture : ""
  }

  public showError = false;
  public errTitle = "";
  public errMessage = "";

  constructor(
    private authService : AuthService,
    private router : Router,
    private route : ActivatedRoute,
    private userService : UserService
  ){}

  ngOnInit(): void {
    //Redirects to home if the user is already logged in
    if (this.authService.isLoggedInSubject.value){
      this.router.navigate(["/home"])
    }

    let inviteUid = this.route.snapshot.paramMap.get("uid");

    if (inviteUid === null){
      //TO DO - manage error
      return;
    }

    this.inviteUid = inviteUid
  }

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }

  validateAllFields() : boolean{
    if (
      !this.validatePassword() ||
      !this.validateConfirmPassword() ||
      !this.validateUsername() ||
      !this.validateProfilePicture()
    ){
      return false;
    }

    return true;
  }

  validatePassword() : boolean{
    this.formError.password = "";

    if (this.formData.password == ""){
      this.formError.password = "Password cannot be empty";
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

    this.userService.usernameExists(this.formData.username, this.inviteUid).then(
      (result) => {
        this.usernameAvailableLabel = !result == true ? "Username is available" : "Username is not available";

        this.usernameAvailable = !result
      }
    ).catch(
      error => {
        this.displayError(
          "Unexpected error",
          "An unexpected error occured when checking username availability, please try again."
        )
      }
    )
  }

  onUsernameChange(){
    this.validateAllFields()
    this.checkUsernameAvailability()
  }

  registerUser(){
    if (!this.validateAllFields()){
      return;
    }

    if (!this.usernameAvailable){
      this.displayError("Unverified username", "Your username was not verified or is taken, please click the veryfying button")
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
          this.router.navigate(["/login"]);
        }
        else{
          this.displayError(
            "Unexpected error",
            "An unexpected error occured when creating the user, please try again."
          )
        }
      }
    ).catch(
      error => {
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
