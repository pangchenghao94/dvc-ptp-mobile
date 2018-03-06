import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthProvider {

  apiURL : string = 'http://192.168.43.169/';
  // apiURL : string = 'http://slimapp/';
  
  constructor(private http: HttpClient, private storage: Storage) { }

  postData(credentials, type){

    return new Promise((resolve, reject) =>{
      
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let url = this.apiURL+type;
      let body = JSON.stringify(credentials);

      this.http
        .post(url, body, {headers: headers})
        .subscribe(
          res   =>{ resolve(res); }, 
          (err) =>{ reject(err); } 
        );
    })
  }

  getData(type){

    return new Promise((resolve, reject) =>{
      let headers = new HttpHeaders();
      let url = this.apiURL+type;

      this.http
        .get(url, {headers: headers})
        .subscribe(
          res   =>{ resolve(res); }, 
          (err) =>{ reject(err); } 
        );
    });
  }

  authenticate(){
    this.storage.get('isLoggedin').then((val) => {
      if(val){
        return true;
      }
      else {
        return false;
      }
    });
  }
}
