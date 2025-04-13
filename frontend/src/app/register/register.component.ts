import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{

  public showPassword : boolean = false

  constructor(
    private authService : AuthService,
    private router : Router
  ){}

  ngOnInit(): void {
    //Redirects to home if the user is already logged in
    if (this.authService.isLoggedInSubject.value){
      this.router.navigate(["/home"])
    }
  }

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }
}
