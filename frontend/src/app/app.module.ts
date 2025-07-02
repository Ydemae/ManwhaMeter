// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BookCardComponent } from './book-card/book-card.component';
import { BookListComponent } from './book-list/book-list.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { GeneralRankingComponent } from './general-ranking/general-ranking.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { SearchFiltersComponent } from './search-filters/search-filters.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BookCreateComponent } from './book-create/book-create.component';
import { BookFormComponent } from './book-form/book-form.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommentComponent } from './comment/comment.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { RatingModalComponent } from './rating-modal/rating-modal.component';
import { RatingFormComponent } from './rating-form/rating-form.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { PersonalRankingComponent } from './personal-ranking/personal-ranking.component';
import { BookRankingComponent } from './book-ranking/book-ranking.component';
import { RegisterComponent } from './register/register.component';
import { AdminBoardComponent } from './admin-board/admin-board.component';
import { InviteTrackerComponent } from './invite-tracker/invite-tracker.component';
import { UserListComponent } from './user-list/user-list.component';
import { BillboardComponent } from './billboard/billboard.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { LoaderComponent } from './loader/loader.component';
import { AnnouncementCreateComponent } from './announcement-create/announcement-create.component';
import { TagCreateModalComponent } from './tag-create-modal/tag-create-modal.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { PasswordComponent } from './password/password.component';
import { ReadingListComponent } from './reading-list/reading-list.component';
import { CreditsComponent } from './credits/credits.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BookCardComponent,
    BookListComponent,
    LoginComponent,
    HomeComponent,
    GeneralRankingComponent,
    BookDetailComponent,
    SearchFiltersComponent,
    BookCreateComponent,
    BookFormComponent,
    BookEditComponent,
    CommentComponent,
    CommentListComponent,
    RatingModalComponent,
    RatingFormComponent,
    ConfirmModalComponent,
    PersonalRankingComponent,
    BookRankingComponent,
    RegisterComponent,
    AdminBoardComponent,
    InviteTrackerComponent,
    UserListComponent,
    BillboardComponent,
    AnnouncementComponent,
    LoaderComponent,
    AnnouncementCreateComponent,
    TagCreateModalComponent,
    TagListComponent,
    PasswordComponent,
    ReadingListComponent,
    CreditsComponent,
    TermsOfServiceComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    NgSelectModule
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
