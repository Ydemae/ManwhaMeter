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
  errorIsShown = false
  errTitle = ""
  errMessage = ""

  username : string = "";
  password : string = "";

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

  onSubmit(): void {
    //TO DO - Add validation to username and password

    this.authenticate(this.username, this.password);
  }

  authenticate(username: string, password: string): void {
      this.authService.login(username,password).then(
          (response) => {
              if (response === true){
                  this.router.navigate(["/booklist"])
              }
              else{
                this.showError(
                    "Invalid credentials",
                    "Invalid identifier or password"
                )
              }
          }
      ).catch(
        () => {
            this.showError(
                "Unexpected error occurred",
                "Please contact the support if the problem persists"
            )
        }
      )
  }
}
