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
    ConfirmModalComponent
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
