import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';

interface IsOp {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  nombreUs = '';
  pass = '';
  //idEmpleado = '';
  nombreEmpleado='';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();
  selectedValue: boolean;
  isOp: IsOp[] = [
    {value: false, viewValue: 'Administrador'},
    {value: true, viewValue: 'Planta'},
  ];
  grupoAp: FormGroup;

  
  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }
  
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      'nombreUs' : [null, Validators.required],
      'pass' : [null, Validators.required],
      isOp:new FormControl()
      
    });
    
  }

  onFormSubmit(form: NgForm) {
    this.authService.register(form)
      .subscribe(res => {
        console.log(res);
        this.router.navigate(['login']);
      }, (err) => {
        console.log(err);
        //alert(err.error);
      });
  }

}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}