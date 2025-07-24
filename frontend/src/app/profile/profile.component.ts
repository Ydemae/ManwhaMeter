import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { User } from '../../types/user';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  public dataFetched = false;
  public loadingFailed = false;
  public changePasswordLoading = false;
  public passwordChangeSuccess = false;

  public userInfo! : User;

  public showError = false;
  public errTitle = "";
  public errMessage = "";

  public changePasswordErrorSubject = new Subject<any>();

  constructor(
    private userService : UserService
  ){}

  ngOnInit(): void {
    this.fetchMyInfo();
  }

  fetchMyInfo(){
    this.dataFetched = false;
    this.loadingFailed = false;

    this.userService.getMyInfo().then(
      info => {
        this.userInfo = info as User;
        console.log(info);
        this.dataFetched = true;
      }
    ).catch(
      error =>{
        this.loadingFailed = true;
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

  hidePasswordChangeSuccess(){
    this.passwordChangeSuccess = false;
  }

  changePassword(passwords : {oldPassword : string, newPassword : string, confirmPassword : string}){
    this.changePasswordLoading = true;

    this.userService.changePassword(passwords.oldPassword, passwords.newPassword).then(
      res => {
        this.changePasswordLoading = false;
        this.passwordChangeSuccess = true;
      }
    )
    .catch(
      error => {
        this.changePasswordLoading = false;
        if (error == 2){
          this.changePasswordErrorSubject.next(0);
        }
      }
    )
  }
}
