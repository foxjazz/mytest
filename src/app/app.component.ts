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
    this.obj = JSON.stringify(this.ol);
  }
  ol: Xol;
  myname: Xol;
  ee: string;

  obj: string;
  commentList: Array<Xol>;
  onCommentSelect(e: any){
    this.obj = JSON.stringify(this.ol);
    this.myname = this.ol;
    this.ee = e;
  }

  ngOnInit(){

    this.commentList = new Array<Xol>();
    let o = new Xol();
    let o2: Xol;
    o.description = "data 1";
    this.commentList.push(o);
    o2 = Object.assign({},o);
    o2.description = "data 2";
    this.commentList.push(o2);
    o2 = Object.assign({},o);
    o2.description = "data 3";
    this.commentList.push(o2);
  }

}
