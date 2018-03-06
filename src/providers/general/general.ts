import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class GeneralProvider {

  constructor(public http: HttpClient, private storage: Storage) {
  }

  getAuthObject(){
    return this.storage.get('userData').then((val) => {
      let data: any = {   "token"     : val.token,
                          "user_id"   : val.user_id};
      return data;
    });
  }
}
