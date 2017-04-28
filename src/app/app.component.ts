import { Component, OnInit} from '@angular/core';
interface ICommentD{description: string;}

class Xol implements ICommentD {
  public description: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    this.ol = new Xol();
    this.ol.description = "init";
  }

  get getol(): string {
          return this.ol.description;

  }
  changeIt() {
    this.ol = this.commentList[2];
  }
  changeItToOne() {
    console.log("changed to one");
    this.ol = this.commentList[0];
  }
  ol: Xol;
  myname: string;
  ee: string;

  obj: string;
  commentList: Array<ICommentD>;
  onCommentSelect(e: any){
    this.obj = JSON.stringify(this.ol);
    this.myname = this.ol.description;
    this.ee = e;
  }

  ngOnInit(){
    this.myname = "";
    this.commentList = new Array<ICommentD>();
    this.commentList.push({description: "data 1"});
    this.commentList.push({description: "data 2"});
    this.commentList.push({description: "data 3"});
  }

}
