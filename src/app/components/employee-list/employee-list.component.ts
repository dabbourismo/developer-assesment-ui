import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { finalize, map, switchMap } from 'rxjs';
import { DialogService } from 'src/app/services/dialog.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { NotificationDialogService } from 'src/app/services/notification-dialog.service';
import { Employee } from 'src/app/_interfaces/employee';
import { NotificationModel } from 'src/app/_interfaces/notificationModel';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { SignalrService } from '../signalr/signalr.service';
const jwtHelper = new JwtHelperService();
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  //Datatable
  public displayedColumns = ['name','phone', 'update', 'delete'];
  public dataSource = new MatTableDataSource<Employee>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchText: string = '';


  // MatPaginator Inputs
  length = 100; // total number of records
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private router: Router, private httpService: EmployeeService,
    private confirmDialogService: DialogService,
    private notificationService: NotificationDialogService,
    public dialog: MatDialog,
    private signalr:SignalrService
  ) { }

  ngOnInit(): void {
    this.employeesGet();
    this.signalr.startConnection();
    this.signalr.onRecieveServerNotification();
    this.signalr.messageReceived.subscribe(message => {
      console.log('Message is',message);
      this.notificationService.delete(`Notification is ${message}`);
    });
  }

  ngAfterViewInit(): void {
    this.applySortingAndPaging();
  }

  private employeesGet() {
    this.httpService.employeeGet()
      .pipe(map(response => this.dataSource.data = response))
      .subscribe();
  }


  public onDeleteClick(id: number) {
    const dialogRef = this.confirmDialogService.openConfirmDialog('Are you sure you want to delete this employee?');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.httpService.deleteEmployee(id).pipe(
          switchMap(response => this.httpService.employeeGet().pipe(map(response => this.dataSource.data = response))),
          finalize(() => this.notificationService.delete('Employee Deleted Successfully'))
        ).subscribe();
      }
    });
  }

// For Editing
  openDialog(id: number): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '350px',
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result != null && (result.event == 'Add' || result.event == 'Update')) {
        //console.log('operation ', result);
        this.employeesGet();
      }
    });
  }


  applySortingAndPaging(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



  isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("jwt");
    if (token && !jwtHelper.isTokenExpired(token)) {
      return true;
    }
    return false;
  }

  logOut = () => {
    localStorage.removeItem("jwt");
    this.router.navigate([""]);
    this.signalr.stopConnection();
  }

   sendNotification = () => {
    let notification: NotificationModel = {
     userId:'5',
     message:'this is a notification'
    }
    this.httpService.sendNotification(notification).subscribe();
  }
}
