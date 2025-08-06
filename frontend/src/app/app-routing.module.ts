// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

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
import { AnnouncementCreateComponent } from './announcement-create/announcement-create.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { ReadingListComponent } from './reading-list/reading-list.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { CreditsComponent } from './credits/credits.component';
import { ProfileComponent } from './profile/profile.component';
import { AnnouncementEditComponent } from './announcement-edit/announcement-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register/:uid', component: RegisterComponent },
  { path: 'booklist', component: GeneralRankingComponent },
  { path: 'mybooklist', component: PersonalRankingComponent },
  { path: 'bookdetail/:id', component: BookDetailComponent },
  { path: 'bookcreate', component: BookCreateComponent },
  { path: 'admin', component: AdminBoardComponent },
  { path: 'announcement/create', component: AnnouncementCreateComponent },
  { path: 'books/edit/:id', component: BookEditComponent },
  { path: 'announcement/edit/:id', component: AnnouncementEditComponent },
  { path: 'readinglist', component: ReadingListComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: 'credits', component: CreditsComponent },
  { path: 'profile', component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
