import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticatedResponse } from 'src/app/_interfaces/authenticatedResponse';
import { LoginModel } from 'src/app/_interfaces/loginModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  invalidLogin: boolean = false;
  credentials: LoginModel = { username: 'johndoe', password: 'def@123' };

  constructor(private router: Router, private http: HttpClient) { }
  login = (form: NgForm) => {
    if (form.valid) {
      this.http.post<AuthenticatedResponse>("https://localhost:7118/api/auth/login", this.credentials, {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      })
        .subscribe({
          next: (response: AuthenticatedResponse) => {
            debugger;
            const token = response.token;
            localStorage.setItem("jwt", token);
            this.invalidLogin = false;
            this.router.navigate(["employee-list"]);
          },
          error: (err: HttpErrorResponse) => this.invalidLogin = true
        })
    }
  }

}
