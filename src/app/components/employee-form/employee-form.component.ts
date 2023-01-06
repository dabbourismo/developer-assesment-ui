import { Component,Inject, OnInit  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, map } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';
import { NotificationDialogService } from 'src/app/services/notification-dialog.service';
import { Employee } from 'src/app/_interfaces/employee';


@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  public employeesForm!: FormGroup;

  constructor(public dialogRef: MatDialogRef<EmployeeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public notificationsService: NotificationDialogService,
    public httpService: EmployeeService) { }

    ngOnInit(): void {
      debugger;
      this.employesFormCreate();
      if (this.data.id != 0) {
        this.employeeGetById(this.data.id);
      }
    }

    //Form Values -------
  public employesFormCreate() {
    this.employeesForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.maxLength(200), Validators.minLength(3)]),
      phone: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]),
    });
  }

  public onSubmit = (formValues: any) => {
    if (this.employeesForm.valid) {
      if (this.data.id != 0) {
        this.employeesUpdate(formValues);
      }
      else {
        this.employeesCreate(formValues);
      }
    }
  }

  //Database -------
  private employeesCreate = (formValues: { name: any; phone:any;}) => {
    let employee: Employee = {
      name: formValues.name,
      phone: formValues.phone,
    }
    this.httpService.insertEmployee(employee).pipe(
      finalize(() => {
        this.notificationsService.success('Employee added successfully');
        this.dialogRef.close({event:'Add'})
      })
    ).subscribe();
  }

  public employeesUpdate = (formValues:any) => {
    let employee: Employee = {
      id: formValues.id,
      name: formValues.name,
      phone: formValues.phone,
    }
    this.httpService.updateEmployee(employee).pipe(
      finalize(() => {
        this.notificationsService.success('Employee updated successfully');
        this.dialogRef.close({event:'Update'})
      })
    ).subscribe();
  }

  employeeGetById(id: number) {
    debugger;
    this.httpService.employeeGetById(id).pipe(
      map(response => {
        debugger;
        this.employeesForm.get('id')!.setValue(response.id);
        this.employeesForm.get('name')!.setValue(response.name);
        this.employeesForm.get('phone')!.setValue(response.phone);
      })
    ).subscribe();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.employeesForm.controls[controlName].hasError(errorName);
  }

  public closeDialog() : void {
    this.dialogRef.close({event:'Cancel'});
  }
}
