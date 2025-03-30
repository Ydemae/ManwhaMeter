import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  errorIsShown = false
  errTitle = ""
  errMessage = ""

  username : string = "";
  password : string = "";

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

  constructor(private http: HttpClient, private authService : AuthService, private router: Router) {}

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
