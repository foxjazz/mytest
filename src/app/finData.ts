/**
 * Created by jdickinson on 5/3/2017.
 */
export interface FinData {fromAddress: string; id: string;};
export class PXML{
  constructor(d: string){
    this.data = d;
  }
  private data: string;
  private res: string;
  getElement(el: string): string {

    this.res = "";
    let start: number;
    let end: number;
      start = this.data.indexOf("<" + el + ">");
      start += el.length + 2;
      end = this.data.indexOf("</" + el, start);

      try {
        this.res = this.data.substr(start, end - start);
        return this.res;
      } catch (e) {
       return "";
      }
  }
}

