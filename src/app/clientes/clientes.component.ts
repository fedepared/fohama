import { Component, OnInit, Inject } from '@angular/core';
import { Cliente } from '../models/cliente';
import { ClienteService } from '../services/cliente.service';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher} from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig
} from "@angular/material/dialog";

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  data: Cliente[] = [];
  displayedColumns: string[] = ['idCliente', 'nombreCli'];
  isLoadingResults = true;

  constructor(private clienteService: ClienteService, private authService:AuthService, private router:Router,public dialog:MatDialog,private route:ActivatedRoute) { }

  ngOnInit() {
    this.getClientes();
  }

  getClientes(): void {
    this.clienteService.getClientes()
      .subscribe(cliente => {
        this.data = cliente;
        console.log(cliente);
        console.log(this.data);
        this.isLoadingResults = false;
      }, err => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

  dialogAddCli(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      titulo: "Agregar Cliente",
      labelButton:"Agregar"
    };
    dialogConfig.width= '300px';
    // dialogConfig.height='100%'
    this.dialog.open(CourseDialog3Component, dialogConfig);
    const dialogRef = this.dialog.open(CourseDialog3Component, dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if (data != undefined) {
        this.onFormSubmit(data, this.dialog);
      } else {
        this.dialog.closeAll();
        this.getClientes();
      }
    });
  }

  onFormSubmit(form: NgForm, dialog: MatDialog){
    this.isLoadingResults = true;
    this.clienteService.addCliente(form).subscribe(
      (res) => {
        
        this.isLoadingResults = false;
        dialog.closeAll();
        this.getClientes();
      },
      err => {
        console.log(err);
        this.isLoadingResults = false;
      }
    );
  }

}

@Component({
  selector: "add-cliente",
  templateUrl: "add-cliente.html"
})

export class CourseDialog3Component{

  form: FormGroup;
  // idCliente:number;
  nombreCli:string;
  titulo:string;
  labelButton:string;

  matcher = new MyErrorStateMatcher();
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialog3Component>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
      this.titulo=data.titulo;
      this.labelButton=data.labelButton;
      // this.idCliente=data.idCliente;
      this.nombreCli=data.nombreCli;
    
  }

  ngOnInit() {
    this.form = this.fb.group({
      // idCliente:[this.idCliente],
      nombreCli:[this.nombreCli,[Validators.required]],
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
