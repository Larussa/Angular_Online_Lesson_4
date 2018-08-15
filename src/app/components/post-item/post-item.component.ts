import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from "../../models/Post";
import { ToastrService } from 'node_modules/ngx-toastr';
import { NgxSpinnerService } from 'node_modules/ngx-spinner';
import { CommentsService } from './../../services/comments.service';
import { PostsService } from '../../services/posts.service';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})

export class PostItemComponent implements OnInit {
  @Input('post') postItem: Post;
  @Output() deletePost: EventEmitter<number> = new EventEmitter();
  public itIsEdit: boolean = false;

  constructor(
    public commentService: CommentsService,
    public postService: PostsService,
    public toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.postService.editTaskEvent
      .pipe(filter(() => this.itIsEdit)).subscribe((updatePost: Post) => {
        this.togglePostEvent(updatePost);
      });
  }
  private togglePostEvent(updatePost: Post) {
    if (this.postItem.id !== updatePost.id) {
      this.itIsEdit = false;
    }
  }

  onDelete(id: number) {
    this.deletePost.emit(id);
  }

  onEdit(post: Post): void {
    this.itIsEdit = true;
     this.postService.emitEditEvent(this.postService.addFormPost(post));
  }

  onCancel(post: Post): void {
    this.postService.emitEditEvent({userId: 2, title: '', body: ''});
  }

  public getPostComments(post: Post): void {
    if (post.comments) {
      post.comments = null;
    } else {
      this.spinner.show();
      this.commentService.getComments(post.id).subscribe((request: Comment[]) => {
        post.comments = request;
        this.spinner.hide();
      }, error => {
        this.toastr.error(error.message, error);
      });
    }
  }
}
