import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
providedIn: 'root'
})
export class HttpService {

public serverName = environment.apiUrl;

constructor(private http: HttpClient, private authService: AuthService) {}

private getHttpOptions() {
return {
headers: new HttpHeaders({
'Content-Type': 'application/json',
'Authorization': `Bearer ${this.authService.getToken()}`
})
};
}

Login(data: any): Observable<any> {
return this.http.post(`${this.serverName}/api/user/login`, data);
}

registerUser(data: any): Observable<any> {
return this.http.post(`${this.serverName}/api/user/register`, data);
}

deleteHospital(id: number): Observable<any> {
return this.http.delete(
`${this.serverName}/api/hospital/${id}`,
{ ...this.getHttpOptions(), responseType: 'text' as 'json' }
);
}

getEquipmentById(id: any): Observable<any> {
return this.http.get(
`${this.serverName}/api/hospital/equipment/${id}`,
this.getHttpOptions()
);
}

getEquipmentBySupplierId(supplierId: any): Observable<any> {
return this.http.get(
`${this.serverName}/api/supplier/equipment/${supplierId}`,
this.getHttpOptions()
);
}

orderEquipment(data: any, equipmentId: any): Observable<any> {
return this.http.post(
`${this.serverName}/api/hospital/order?equipmentId=${equipmentId}`,
data,
this.getHttpOptions()
);
}

UpdateOrderStatus(status: any, orderId: any): Observable<any> {
return this.http.put(
`${this.serverName}/api/supplier/order/update/${orderId}?newStatus=${status}`,
{},
this.getHttpOptions()
);
}

scheduleMaintenance(data: any, equipmentId: any): Observable<any> {
return this.http.post(
`${this.serverName}/api/hospital/maintenance/schedule?equipmentId=${equipmentId}`,
data,
this.getHttpOptions()
);
}

getMaintenance(): Observable<any> {
return this.http.get(
`${this.serverName}/api/technician/maintenance`,
this.getHttpOptions()
);
}

deleteMaintenance(id: number): Observable<any> {
return this.http.delete(
`${this.serverName}/api/technician/maintenance/${id}`,
{ ...this.getHttpOptions(), responseType: 'text' as 'json' }
);
}

updateMaintenance(data: any, id: any): Observable<any> {
return this.http.put(
`${this.serverName}/api/technician/maintenance/update/${id}`,
data,
{ ...this.getHttpOptions(), responseType: 'text' as 'json' }
);
}

deleteOrder(id: number): Observable<any> {
return this.http.delete(
`${this.serverName}/api/supplier/order/${id}`,
{ ...this.getHttpOptions(), responseType: 'text' as 'json' }
);
}

createHospital(data: any): Observable<any> {
return this.http.post(
`${this.serverName}/api/hospital/create`,
data,
this.getHttpOptions()
);
}

getHospital(): Observable<any> {
return this.http.get(
`${this.serverName}/api/hospitals`,
this.getHttpOptions()
);
}

getAllUsers(): Observable<any> {
return this.http.get(
`${this.serverName}/api/users`,
this.getHttpOptions()
);
}

getAllOrders(): Observable<any> {
return this.http.get(
`${this.serverName}/api/orders`,
this.getHttpOptions()
);
}

addEquipment(data: any, hospitalId: any, supplierId: any, quantity: number = 1): Observable<any> {
return this.http.post(
`${this.serverName}/api/hospital/equipment?hospitalId=${hospitalId}&supplierId=${supplierId}&quantity=${quantity}`,
data,
this.getHttpOptions()
);
}

getorders(supplierId: any): Observable<any> {
return this.http.get(
`${this.serverName}/api/supplier/orders/${supplierId}`,
this.getHttpOptions()
);
}

getCaptcha(): Observable<any> {
return this.http.get(`${this.serverName}/api/captcha/generate`);
}

}
