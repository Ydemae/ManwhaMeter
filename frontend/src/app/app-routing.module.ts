import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { GeneralRankingComponent } from './general-ranking/general-ranking.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookCreateComponent } from './book-create/book-create.component';
import { PersonalRankingComponent } from './personal-ranking/personal-ranking.component';
import { RegisterComponent } from './register/register.component';
import { AdminBoardComponent } from './admin-board/admin-board.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'booklist', component: GeneralRankingComponent },
  { path: 'mybooklist', component: PersonalRankingComponent },
  { path: 'bookdetail/:id', component: BookDetailComponent },
  { path: 'bookcreate', component: BookCreateComponent },
  { path: 'admin', component: AdminBoardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
