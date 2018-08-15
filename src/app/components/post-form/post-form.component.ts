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
  @Output() onEditPost: EventEmitter<Post> = new EventEmitter();

  @ViewChild("form") form: NgForm;

  formPost: Post = {
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
    this.postService.editTaskEvent.subscribe((updatePost: Post) => {
      this.togglePostEvent(updatePost);
    });
  }

  private togglePostEvent(updatePost: Post) {
    this.form.resetForm();
    this.formPost = updatePost;
  }

  onAddPost(): void {
    this.spinner.show();
    const addNewPost = this.postService.addFormPost(this.formPost);
    this.postService.addPost(addNewPost).subscribe((request: Post) => {
      addNewPost.id = request.id;
      this.onAddNewPost.emit(addNewPost);
      this.onCancel();
      this.spinner.hide();
      }, error => {
      this.spinner.hide();
      this.toastr.error(error.message, error);
    });
  }

  onEdit(): void {
    this.spinner.show();
    const addNewPost = this.postService.addFormPost(this.formPost);
    this.postService.updatePost(addNewPost).subscribe((updatedPost: Post) => {
      this.spinner.hide();
      this.onEditPost.emit(updatedPost);
      this.onCancel();
      },error => {
        this.spinner.hide();
        this.toastr.error("Post was not updated", "Error");
      }
    );
  }

  onCancel(): void {
    this.form.resetForm();
    this.postService.emitEditEvent({ title: '', body: '', userId: 1 });
  }
}
