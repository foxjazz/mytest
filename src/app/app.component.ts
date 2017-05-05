import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {CallManager} from "./callManager";
import {FinData} from "./finData";
interface ICommentD {description: string; }

class Xol implements ICommentD {
  public description: string;

}


@Component({
  selector: 'app-root',
  providers: [CallManager],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private ar: ActivatedRoute, private cm: CallManager) {
    this.ol = new Xol();
    this.ol.description = "init";
    this.fd = {fromAddress: "", id: ""};
    this.cm.setUri();

  }

  token: string;
  get inCall(){
    return this.cm.inCall;
  }

  ol: Xol;
  myname: Xol;
  fd: FinData;
  ee: string;
  userId: string;
  obj: string;
  cmdata: string;
  jtoken: string;
  commentList: Array<Xol>;
  answer: string;
  header: string;
  private subscription: Subscription;

  getCmData(){
    this.cmdata = "token: " + this.cm.token + " userId=" + this.cm.userId;
  }
  getTestUd(){
    this.cm.getTestUserDialog("null").subscribe(r => {
     this.fd = r;
    });
  }


  checkToken(){
    this.jtoken = "Basic " + btoa('jdickinson:isFriday!3');
    this.header = "Basic " + this.token;
    if (this.jtoken === this.header) {
      this.answer = "true";
    }else{
      this.answer = "false";
    }

  }

  get getol(): string {
          return this.ol.description;

  }
  changeIt() {
    this.ol = this.commentList[2];
  }
  hangUp() {

    this.cm.dropCall();

  }
  changeItToOne() {
    console.log("changed to one");
    this.ol = this.commentList[0];
    this.obj = JSON.stringify(this.ol);
  }
  makeCall(s: string){
    console.log("started a call")
    if (s == null && s.length === 0) {
      s = "97203138707";
    }
    this.cm.token = this.token;
    console.log("vader: makeCall:" + s);
    this.cm.makeCall(s, "29700");
    this.header = this.cm.header;
  }


  onCommentSelect(e: any){
    this.obj = JSON.stringify(this.ol);
    this.myname = this.ol;
    this.ee = e;
  }

  ngOnInit() {

    if (this.cm == null) {
      this.ee = "cm: undefined";
    }
    else{
      this.ee = "cm is  defined";
    }
    this.subscription = this.ar.queryParams.subscribe(
      (queryParam: any) => {
        this.userId = queryParam['userName'];
        this.cm.userId = this.userId;
        this.token = queryParam['token'];
        this.cm.token = this.token;
        this.ee = "token=" + this.token;
      }
    );
    this.commentList = new Array<Xol>();
    const o = new Xol();
    let o2: Xol;
    o.description = "data 1";
    this.commentList.push(o);
    o2 = Object.assign({}, o);
    o2.description = "data 2";
    this.commentList.push(o2);
    o2 = Object.assign({}, o);
    o2.description = "data 3";
    this.commentList.push(o2);
  }

}
