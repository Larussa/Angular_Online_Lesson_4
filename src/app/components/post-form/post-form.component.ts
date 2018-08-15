import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Post } from "../../models/Post";
import { PostsService } from "../../services/posts.service";
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'node_modules/ngx-spinner';
import { ToastrService } from 'node_modules/ngx-toastr';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  @Output() onAddNewPost: EventEmitter<Post> = new EventEmitter();
  @Output() updatePost: EventEmitter<Post> = new EventEmitter();
  @ViewChild("form") form: NgForm;

  formData: Post = {
    userId: 1,
    title: '',
    body: '',
  };
  constructor(
    public postService: PostsService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.postService.editTaskEvent.subscribe((post:Post) => {
      this.formData = post;
    });
  }

  onAddPost(form): void {
    let addNewPost: Post = {
      userId: this.formData.userId,
      title: this.formData.title ,
      body: this.formData.body,
    };
    this.spinner.show();
    this.postService.addPost(addNewPost).subscribe((request: Post) => {
      addNewPost.id = request.id;
      this.onAddNewPost.emit(addNewPost);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.message, error);
    });
    form.resetForm();
  }

  onEditPost(): void {
    const updatePost: Post = {
      userId: this.formData.userId,
      title: this.formData.title,
      body: this.formData.body,
      id: this.formData.id,
    };
    this.updatePost.emit(updatePost);
  }

  onCancel(): void {
    this.postService.emitEditEvent({title: '', body: '', userId: 1});
  }
}
