import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  userIsConnected!: boolean;

  constructor(private authService : AuthService) {
  }

  ngOnInit(){
    this.authService.isLoggedIn$.subscribe(
      (value) => {
        this.userIsConnected = value
      }
    )
  }

  disconnectUser() {
    this.authService.logout()
  }
}
