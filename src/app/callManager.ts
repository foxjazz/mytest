
import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/timer';
import {PXML, FinData} from './finData';
import {startTimeRange} from "@angular/core/src/profile/wtf_impl";

@Injectable()
export class CallManager {

  constructor(private http: Http) {
    this.baseURI = "https://uccx-001-app-prod.statebridgecompany.com:8445/finesse/api/";
    this.fd = {fromAddress: "", id: ""};
  }
  token: string;
  withUri: string;
  dialogId: string;
  userId: string;
  ext: string;
  loanid: string;
  inCall: boolean;
  header: string;
  status: string;
  private position: number;
  private dialogUri: string;
  private fd: FinData;
  private timeractive: boolean;
  private baseURI: string;
  private result: string;
  setUri(){
    this.dialogUri = this.baseURI + "User/" + this.userId + "/Dialogs";
  }

  createAuthorizationHeader(headers: Headers) {
    let v: string;
    v = "Basic " + this.token;
    /*else {
      v = "Basic " + btoa('jdickinson:isFriday!3');*/
    this.header = v;
    headers.append('Authorization', v);
  }
  private handleError(error: any) {
    let errMsg: string;
    errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    this.result = errMsg;
    return Observable.throw(errMsg);
  }




  public dropCall() {
    this.inCall = false;
    let data: string;
    data = "<Dialog>" +
      "<requestedAction>DROP</requestedAction>" +
      "<targetMediaAddress>" + this.ext + "</targetMediaAddress>" +
      "</Dialog>"
    this.withUri = this.baseURI + "Dialog/" + this.dialogId;
    this.put(data).subscribe(p => {
      console.log(p);
    });
  }

  getUser(): Observable<string> {
    let uri = this.baseURI + 'User/' + this.userId;
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    const options = new RequestOptions( { headers: headers } );
    return this.http.get(uri, options)
      .map((res: Response) => {
        const pxml = new PXML(res["_body"]);
        const ext1 = pxml.getElement("extension");
        this.ext = ext1;
        console.log("Extension: " + ext1);
        return ext1;
    });
  }
  private tempData;
  makeCall(number: string, loanid: string){
    this.setUri();
    this.position = 0;
    this.inCall = true;
    this.dialogId = "";
    this.getUser().subscribe(ext => {
      console.log("user data ext " + ext);
      this.tempData = "<Dialog>" +
        "<requestedAction>MAKE_CALL</requestedAction>" +
        "<fromAddress>" + ext + "</fromAddress>" +
        "<toAddress>" + number + "</toAddress>" +
        "</Dialog>";
      let mcall = this.baseURI + "User/" + this.userId + "/Dialogs";
      console.log("vader:callData: " + this.tempData);
      this.post(mcall, this.tempData).subscribe(p => {
        console.log("make call:" + p);
        this.startPollingDialogs(loanid);
      });
    });


  }

  callVariable(): string{
    let d: string;
    d = "<Dialog>" +
      "<requestedAction>UPDATE_CALL_DATA</requestedAction>" +
      "<mediaProperties>" +
      "<wrapUpReason>Calling out</wrapUpReason>" +
      "<callvariables>" +
      "<CallVariable>" +
      "<name>callVariable2</name>" +
      "<value>M-Call Out</value>" +
      "</CallVariable>" +
      "<CallVariable>" +
      "<name>callVariable1</name>" +
      "<value>" + this.loanid + "</value>" +
      "</CallVariable>" +
      "</callvariables>" +
      "</mediaProperties>" +
      "</Dialog>";
    return d;
  }



  public post(u: string, data: string) : Observable<Response> {
    // this won't actually work because the StarWars API doesn't
    // is read-only. But it would look like this:
    const uri = u;

    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.createAuthorizationHeader(headers);
    const options = new RequestOptions( { headers: headers } );
    console.log("posting: " + uri);
    console.log("vader:options: " + JSON.stringify(options));
    return this.http.post(uri, data, options)
      .map(x => {
        try {
          return x.json();
        }catch (e) {
          console.log(e);
          return x;
        }
      });
  }

  public put(data: string): Observable<any> {
    // this won't actually work because the StarWars API doesn't
    // is read-only. But it would look like this:
    //Basic amRpY2tpbnNvbjppc0ZyaWRheTEz
    console.log("vaderxx: " + data);
    let headers: Headers;
    let options: RequestOptions;
    let p: string;
    p = this.withUri;
    console.log("vaderx2" + p);
    headers = new Headers({'Content-Type': 'application/xml'});
    this.createAuthorizationHeader(headers);
    options = new RequestOptions({headers});
    return this.http.put(p, data, options)
      .map((res: Response) => {
        this.result = JSON.stringify(res);
        return this.result;
      })
      .catch(this.handleError);
  }

  startPollingDialogs(lid: string){
    this.loanid = lid;
    this.status = "started";
    this.inCall = true;
    this.fd.id = "";
    this.position = 0;
    this.timeractive = true;
    const r = Observable.timer(2000, 2000).subscribe(_ => {
      if ( this.position < 2) {
        this.getUserDialogs().subscribe(p => {
          if (p != null && p.id != null && p.id.length > 0) {
            if(this.position === 0) {
              this.position++;
            }
            console.log("vader:polling: " + this.position);
            this.fd = p;
            this.dialogId = p.id;
            this.withUri = this.baseURI + "Dialog/" + p.id;
            if (this.timeractive) {
              this.timeractive = false; //one shot it
              this.put(this.callVariable()).subscribe(t => {
                console.log("vader:putCallVariable" + t);
              });
            }
          } else {
            console.log("vader:else:" + p);
            if(this.position === 1) {
              console.log("vader:polling p:" + this.position)
              this.position++;  //detected hangup
              this.inCall = false;
              r.unsubscribe();
            }
            if(this.position === 0) {
              console.log("vader:polling p:" + this.position)
              this.inCall = true;
            }
          }
        });
      }


    });

  }
  public getUserDialogs(): Observable<FinData> {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    const options = new RequestOptions( { headers: headers } );
    return this.http.get(this.dialogUri, options)
      .map(r => {
        console.log("getUserDialog: " + r);
        let pxml = new PXML(r["_body"]);
        let fa: string;
        let id: string;
        fa = pxml.getElement("fromAddress");
        console.log("fromAddress: " + fa);
        id = pxml.getElement("id");
        console.log("dialogId: " + id);
        let fd: FinData;
        fd = {fromAddress: fa, id: id}
        return fd;
      } );
  }
  public getTestUserDialog(str: string): Observable<FinData> {
    const uri = "http://localhost:51438/api/Inx";
    return this.http.get(uri + "/" + str)
      .map(r => {

        let pxml = new PXML(r["_body"]);

        let fa: string;
        let id: string;
        fa = pxml.getElement("fromAddress");
        id = pxml.getElement("id");
        let fd1: FinData;
        fd1 = {fromAddress: fa, id: id}
        return fd1;
      } );
  }
  /*private save(){
   this.put(this.makeCall(this.number)).subscribe(r => {
   this.result = r;
   console.log(this.result);
   });
   }*/
}
/**
 * Created by jdickinson on 5/3/2017.
 */
