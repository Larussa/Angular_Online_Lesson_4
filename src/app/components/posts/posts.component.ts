import {Component, OnInit} from '@angular/core';
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
    this.postService.getPosts().subscribe((request: Post[]) => {
        this.posts = request;
        this.spinner.hide();
      },
      error => console.error(error.message)
    );

  }

  onAddPost(post: Post): void {
    this.posts.unshift(post);
    this.toastr.success("New post was successfully add", "Info", { timeOut: 2000 });
  }

  onEditPost(updatePost: Post): void {
    const updatePostIndex = this.posts.findIndex(el => el.id === updatePost.id);
    if (updatePostIndex === -1) {
      this.toastr.success("post was not edited", "Info", { timeOut: 2000 });
      return;
    } else {
      this.posts[updatePostIndex] = updatePost;
      this.toastr.success("Post was successfully updated", "Info", { timeOut: 2000 });
    }
  }

  onDelete(id: number): void {
    this.spinner.show();
    this.postService.deletePost(id).subscribe((data: Object) => {
      this.posts = this.posts.filter(filteredPost => filteredPost.id != id);
      this.postService.emitEditEvent({userId: 1, title: '', body: ''});
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
      this.toastr.success('post deleted success','message')
    }, error => {
      this.toastr.error("Post was not deleted", "Error", { timeOut: 2000 });
    });
  }
}
