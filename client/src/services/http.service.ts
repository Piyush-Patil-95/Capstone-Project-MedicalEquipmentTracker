import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public serverName=environment.apiUrl;
//todo: complete missing code.. 
  constructor(private http:HttpClient){}

  getHospital():Observable<any>{
    return this.http.get<any>(`${this.serverName}/hospital`)
  }

  createHospital(hospital:any):Observable<any>{
    return this.http.post<any>(`${this.serverName}/hospital`, hospital);
  }

  addEquipment(equipment:any):Observable<any>{
    return this.http.post<any>(`${this.serverName}/equipment`, equipment);
  }
  
}
