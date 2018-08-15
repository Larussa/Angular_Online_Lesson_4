import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from "../../models/Post";
import { ToastrService } from 'node_modules/ngx-toastr';
import { NgxSpinnerService } from 'node_modules/ngx-spinner';
import { CommentsService } from './../../services/comments.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})

export class PostItemComponent implements OnInit {
  @Input('post') postItem: Post;
  @Output() deletePost: EventEmitter<number> = new EventEmitter();
  @Output () editPost: EventEmitter<Post> = new EventEmitter();
  editPostId: number;

  constructor(
    public commentService: CommentsService,
    public postService: PostsService,
    public toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.postService.editTaskEvent.subscribe((post: Post) => {
      if ( post.id === this.postItem.id ) {
        this.editPostId = post.id;
      } else {
        this.editPostId = 0;
      }
    });
  }

  onDelete(id: number): void {
    this.deletePost.emit(id);
  }

  onEdit(post: Post): void {
    const updatePost = {
      title: post.title,
      body: post.body,
      userId: post.userId,
      id: post.id
    };
    this.editPost.emit(updatePost);
  }

  onCancel(): void {
    this.editPost.emit({title: '', body: '', userId: 1});
  }

  getPostComments(post: Post): void {
    if (post.comments) {
      post.comments = null;
    } else {
      this.spinner.show();
      this.commentService.getComments(post.id).subscribe((request: Comment[]) => {
        post.comments = request;
        this.spinner.hide();
      }, error => {
        this.toastr.error(error.message, error);
        this.spinner.hide();
      });
    }
  }
}
