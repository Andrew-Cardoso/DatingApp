import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { GenderPipe } from './_pipes/gender.pipe';
import { TimeAgoPipe } from './_pipes/time-ago.pipe';
import { SharedModule } from './_modules/shared/shared.module';
import { AboutComponent } from './members/member-detail/about/about.component';
import { InterestsComponent } from './members/member-detail/interests/interests.component';
import { SameHeightDirective } from './_directives/same-height.directive';
import { PhotosComponent } from './members/member-detail/photos/photos.component';
import { MessagesTabComponent } from './members/member-detail/messages/messages.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberFormComponent } from './members/member-edit/member-form/member-form.component';
import { IsEqualPipe } from './_pipes/is-equal.pipe';
import { MemberProfileCardComponent } from './members/member-profile-card/member-profile-card.component';
import { CitiesPipe } from './_pipes/cities.pipe';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    ListsComponent,
    MessagesComponent,
    MemberDetailComponent,
    MemberListComponent,
    MemberCardComponent,
    AboutComponent,
    InterestsComponent,
    PhotosComponent,
    MessagesTabComponent,
    NotFoundComponent,
    ServerErrorComponent,
    MemberEditComponent,
    MemberFormComponent,
    GenderPipe,
    TimeAgoPipe,
    IsEqualPipe,
    CitiesPipe,
    SameHeightDirective,
    MemberProfileCardComponent,
    PhotoEditorComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    NgxSpinnerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
