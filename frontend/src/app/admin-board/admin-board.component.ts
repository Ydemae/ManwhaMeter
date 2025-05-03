import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-board',
  standalone: false,
  templateUrl: './admin-board.component.html',
  styleUrl: './admin-board.component.scss'
})
export class AdminBoardComponent implements OnInit{


  constructor(
    private authService : AuthService,
    private router : Router
  ){}

  ngOnInit(): void {
    if (!this.authService.isAdminSubject.value || !this.authService.isLoggedInSubject.value){
      console.log(this.authService.isAdminSubject.value)
      console.log(this.authService.isLoggedInSubject.value)
      //this.router.navigate(["/home"]);
    }
  }
}
