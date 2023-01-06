import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { Employee } from '../_interfaces/employee';
import { NotificationModel } from '../_interfaces/notificationModel';
// import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  url = `${environment.urlAddress}employee/`;
  notificationsUrl = `${environment.urlAddress}notifications/`;

  constructor(private http: HttpClient) { }

  employeeGet(): Observable<Employee[]> {
    debugger;
    return this.http.get<Employee[]>(`${this.url}GetEmployees`);
  }

  employeeGetById(id: number): Observable<Employee> {

    const params = new HttpParams()
      .set('id', id.toString());

    return this.http.get<Employee>(`${this.url}GetEmployeeByID`, { params: params });
  }

  employeeSearch(name: string): Observable<Employee[]> {

    const params = new HttpParams()
      .set('name', name.toString());

    return this.http.get<Employee[]>(`${this.url}SearchEmployee`, { params: params });
  }

  insertEmployee(Employee: Employee): Observable<void> {
    return this.http.post<void>(`${this.url}InsertEmployee`, Employee);
  }

  updateEmployee(Employee: Employee): Observable<void> {
    return this.http.post<void>(`${this.url}UpdateEmployee`, Employee);
  }

  deleteEmployee(id: number): Observable<any> {
    const params = new HttpParams()
      .set('id', id.toString());
    return this.http.post<any>(`${this.url}DeleteEmployee`, {}, { params: params });
  }

  sendNotification(notification: NotificationModel): Observable<void> {
    return this.http.post<void>(`${this.notificationsUrl}SendNotification`, notification);
  }
}
