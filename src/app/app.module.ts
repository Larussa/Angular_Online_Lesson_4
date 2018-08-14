import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PostsComponent } from './components/posts/posts.component';
import { HttpClientModule } from "@angular/common/http";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";
import { FormsModule } from "@angular/forms";
import { PostItemComponent } from './components/post-item/post-item.component';
import { PostFormComponent } from './components/post-form/post-form.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PostsComponent,
    PostItemComponent,
    PostFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
