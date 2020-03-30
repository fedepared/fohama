import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  nombreUs = '';
  pass = '';
  matcher = new ErrorStateMatcher();
  isLoadingResults = false;  
  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'nombreUs' : [null, Validators.required],
      'pass' : [null, Validators.required]
    });
  }

  onFormSubmit(form: NgForm) {
    this.authService.login(form)
      .subscribe(res => {
        console.log(res);
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.router.navigate(['empleados']);
        }
      }, (err) => {
        console.log(err);
      });
  }

  register() {
    this.router.navigate(['register']);
  }

}

//Managing form validation

    export class MyErrorStateMatcher implements ErrorStateMatcher {
      isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
      }

}
