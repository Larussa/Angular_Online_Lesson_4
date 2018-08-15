import { Component, OnInit } from '@angular/core';
import { PostsService } from "../../services/posts.service";
import { Post } from "../../models/Post";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})

export class PostsComponent implements OnInit {
  public posts: Post[];
  constructor(
    private postService: PostsService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.spinner.show();
    this.postService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
      this.spinner.hide();
    },error => {
      this.toastr.error(error.message, "Error");
      this.spinner.hide();
    });
  }

  onEdit (post: Post): void {
    this.postService.emitEditEvent(post);
  }

  updatePost(post: Post): void {
    this.postService.editPost(post).subscribe((updatedPost: Post) => {
      this.posts.forEach( post => {
        if (post.id === updatedPost.id) {
          Object.assign(post, updatedPost);
        }
      });
      this.toastr.success('post deleted success','message');
    }, error => {
      this.toastr.error("Post was not deleted", "Error");
      this.spinner.hide();
    });
    this.onEdit({title: '', body: '', userId: 1});
  }

  onDelete(id: number): void {
    this.spinner.show();
    this.postService.deletePost(id).subscribe((data: Object) => {
      this.posts = this.posts.filter(filteredPost => filteredPost.id !== id);
      this.postService.emitEditEvent({userId: 1, title: '', body: ''});
      this.spinner.hide();
      this.toastr.success('post deleted success','message');
    }, error => {
      this.toastr.error("Post was not deleted", "Error");
      this.spinner.hide();
    });
  }
}
