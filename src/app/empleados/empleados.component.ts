import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig
} from "@angular/material/dialog";
import { Component, OnInit, Inject } from "@angular/core";
import { Empleado } from "../models/empleado";
import { EmpleadoService } from "../services/empleado.service";
import { AuthService } from "../services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  NgForm,
  FormControl,
  FormGroupDirective,
  Validators
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material";

@Component({
  selector: "app-empleados",
  templateUrl: "./empleados.component.html",
  styleUrls: ["./empleados.component.css"]
})
export class EmpleadosComponent implements OnInit {
  data: Empleado[] = [];
  displayedColumns: string[] = [ "accion","idEmpleado", "nombreEmp"];
  isLoadingResults = true;
  titulo:String;
  empleadoForm: FormGroup;
  formBuilder: any;
  nombreEmp = "";
  idEmpleado: number;
  empleado: Empleado = {
    idEmpleado: null,
    nombreEmp: "",
    tiempoFin: null,
    tiempoIni: null,
    tiempoTot: null,
    idEtapa: null,
    idEtapaEmpleado: null,
    nombreEtapaEmpleado: null
  };
  constructor(
    private empleadoService: EmpleadoService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getEmpleados();
  }

  getEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe(
      empleado => {
        this.data = empleado;
        console.log(empleado);
        console.log(this.data);
        this.isLoadingResults = false;
      },
      err => {
        console.log(err);
        this.isLoadingResults = false;
      }
    );
  }

  getEmpleado(id: number) {
    this.empleadoService.getEmpleado(id).subscribe(data => {
      this.idEmpleado = data.idEmpleado;
    });
  }

  onUpdateSubmit(form: NgForm) {
    this.isLoadingResults = true;
    if(this.nombreEmp!==""){
      this.empleadoService.updateEmpleado(this.idEmpleado, form).subscribe(
        res => {
          this.isLoadingResults = false;
          // this.router.navigate(['/supplier']);
        },
        err => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
    }
  }

  deleteEmpleado(id: number) {
    this.isLoadingResults = true;
    this.empleadoService.deleteEmpleado(id)
      .subscribe(res => {
          this.isLoadingResults = false;
          // this.router.navigate(['/supplier']);
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

  dialogDeleteEmp(obj): void{
    obj.titulo="Borrar empleado?";
    obj.labelButton="borrar"
    this.getEmpleado(obj.idEmpleado);

    this.dialog.open(CourseDialogComponent,{data:obj});
    const dialogRef3 = this.dialog.open(CourseDialogComponent,{data:obj});
    
    dialogRef3.afterClosed().subscribe(res =>{
      if((res!=null))
      {
        this.deleteEmpleado(res.idEmpleado);
      }
      this.dialog.closeAll();
      this.getEmpleados();
    })
  }

  dialogEditEmp(obj): void {
    obj.titulo="Editar empleado";
    obj.labelButton="Guardar"
    this.getEmpleado(obj.idEmpleado);
    this.dialog.open(CourseDialogComponent, { data:obj});
    const dialogRef2 = this.dialog.open(CourseDialogComponent, { data:obj});
    dialogRef2.afterClosed().subscribe(res =>{
      this.onUpdateSubmit(res);
      this.dialog.closeAll();
      this.getEmpleados();
    })
  }

  dialogAddEmp(): void {
    this.titulo="Agregar Empleado";
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      titulo: "Agregar empleado",
      labelButton:"Agregar"
    };
    this.dialog.open(CourseDialogComponent, dialogConfig);
    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if (data != undefined) {
        this.onFormSubmit(data, this.dialog);
      } else {
        this.dialog.closeAll();
        this.getEmpleados();
      }
    });
  }

  onFormSubmit(form: NgForm, dialog: MatDialog) {
    this.isLoadingResults = true;
    this.empleadoService.addEmpleado(form).subscribe(
      (res: { [x: string]: any }) => {
        const empleado = res["empleadoResponse"];
        const idEmpleado = empleado["idEmpleado"];
        this.isLoadingResults = false;
        // this.router.navigate(['/supplier-details', id]);
        dialog.closeAll();
        this.getEmpleados();
      },
      err => {
        console.log(err);
        this.isLoadingResults = false;
      }
    );
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["login"]);
  }
}

@Component({
  selector: "alta-empleados",
  templateUrl: "alta-empleados.html"
})
export class CourseDialogComponent {
  
  form: FormGroup;
  idEmpleado: number;
  nombreEmp: string;
  matcher = new MyErrorStateMatcher();
  titulo:string;
  labelButton:string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.titulo=data.titulo;
    this.labelButton=data.labelButton;
    
    this.idEmpleado = data.idEmpleado;
    this.nombreEmp = data.nombreEmp;
    
  }

  ngOnInit() {
    this.form = this.fb.group({
      nombreEmp: [this.nombreEmp, [Validators.required]],
      idEmpleado: [this.idEmpleado, [Validators.required]]
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
