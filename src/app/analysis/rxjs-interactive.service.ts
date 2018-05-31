import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()

export class RxjsInteractiveService {

    constructor( private _http: Http) { }

    getAnalysisData ( ) {
        return this._http.get("/assets/data/date.json", { withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }

    /*普通返回处理*/
    private extractData(res: Response) {
        const body = JSON.parse(res["_body"]);
        return body;
    }

    /*异常处理*/
    private handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }
}