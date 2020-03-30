import { Component, OnInit, Inject,ViewChild } from '@angular/core';
import { Transformadores } from '../models/transformadores';
import { TransformadoresService } from '../services/transformadores.service';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher, MatSort} from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig
} from "@angular/material/dialog";
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente';
import { TipoTransfo} from '../models/tipoTransfo';
import { ProtractorBrowser, promise } from 'protractor';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource, MatTable} from '@angular/material/table';
import { EtapaService } from '../services/etapa.service';
import { Etapa } from '../models/etapa';
import { TipoEtapaService } from '../services/tipo-etapa.service';
import {TipoEtapa} from '../models/tipoEtapa';
import { async } from '@angular/core/testing';
import { isRegExp } from 'util';
import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EtapaTransfo } from '../models/etapaTransfo';
import {MatTooltipModule} from '@angular/material/tooltip';  
import { AutofillMonitor } from '@angular/cdk/text-field';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { TransformadoresEtapas } from '../models/transformadoresEtapas';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Address } from 'cluster';
import { VistaService } from '../services/vista.service';
import { Vista } from '../models/Vista';
import { TipoTransfoService } from '../services/tipoTransfo';

@Component({
  selector: 'app-transformadores',
  templateUrl: './transformadores.component.html',
  styleUrls: ['./transformadores.component.css']
})
export class TransformadoresComponent implements OnInit {
  // @ViewChild('outerSort', { static: true }) sort: MatSort;
  // @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  // @ViewChildren('innerTables') innerTables: QueryList<MatTable<TransformadoresEtapas>>;
  dataExcel:TransformadoresEtapas[];
  data: Transformadores[]=[];
  expandedElement: EtapaTransfo | null;
  displayedColumns: string[] = [
    'accion',
    'potencia', 
    'oPe', 
    'rango', 
    'oTe', 
    'nombreCli', 
    'observaciones', 
     'Documentacion', 
     'PrensayugosEnviados', 
     'PrensayugosProducidos', 
     'Nucleo', 
     'BobinaBT1', 
     'BobinaBT2', 
     'BobinaBT3', 
     'BobinaAT1', 
     'BobinaAT2', 
     'BobinaAT3', 
     'Conex', 
     'Horno', 
     'CortePlegado', 
     'Tapa', 
     'Cuba', 
     'Radiadores', 
     'Tintas', 
     'Granallado', 
     'Pintura', 
     'Encubado', 
     'Laboratorio', 
     'Hermeticidad', 
     'Terminacion', 
     'Despacho' 
  ];
  isLoadingResults = true;
  data3:Cliente[]=[];
  data4:Etapa[]=[];
  diego:ComboClientes[];
  idTransfo:number;
  durationInSeconds=3;
  data2:Transformadores;
  data5:Etapa[]=[];
  data6:TipoEtapa[]=[];
  data7:EtapaTransfo[]=[];
  mensajeSnack:string;
  asincronia: any;
  arrayBool:boolean;
  muestre:boolean=false;
  vista:Vista[];
  dataTipoTransfo:ComboTipoTransfo[];
  data8TipoTransfo:TipoTransfo[]=[];
  
  constructor(private transformadoresService: TransformadoresService, private clientesService: ClienteService, private authService: AuthService, private router: Router, public dialog: MatDialog,
    private route: ActivatedRoute,private _snackBar: MatSnackBar,private etapaService: EtapaService, private tipoEtapaService: TipoEtapaService, private getVistaService:VistaService, private tipoTransfoService: TipoTransfoService) { 
     
    }
    

  ngOnInit() {
    
    this.getDataExcel();
    this.getTransformadores();
    this.getClientes();
    this.getTipoTransfo();
    this.getVista();
    // this.dataSource = new MatTableDataSource(this.usersData);
    // this.displayedColumns.sort = this.sort;
    
    
  }

  getVista(){
    this.getVistaService.getVista()
      .subscribe(resVista => {
        this.vista = resVista;
        let cont:number=0;
        for (let i = 0; i < this.vista.length; i++) {
          let oPe = this.vista[i].oPe;
         
          for (let j = 1; j < this.vista.length; j++) {
            if(this.vista[j].oPe==oPe){
         
              cont++;
            }
          }
          for(let k=0;k<this.vista.length;k++){
            if(this.vista[k].oPe==oPe){
         
              this.vista[k].rangoFin=cont;
         
            }
          }
          oPe=null;
          cont=0;
        }
        
        this.isLoadingResults = false;
      }, err => {
        
        this.isLoadingResults = false;
      });
  }


  mostrar(){
    this.muestre=true;
  }





  getTransformadores(): void {
    this.transformadoresService.getTransformadores()
      .subscribe(transfo => {
        this.data = transfo;
        // console.log(this.data);
        this.isLoadingResults = false;
      }, err => {
        // console.log(err);
        this.isLoadingResults = false;
      });
  }

  dialogAddTransfo(){
    // this.titulo="Agregar Empleado";
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      titulo: "Agregar Transformador",
      labelButton:"Agregar",
      diego:this.diego,
      dataTipoTransfo:this.dataTipoTransfo

    };
    // console.log("THIS TIPO TRANSFO", this.dataTipoTransfo)
    dialogConfig.width= '300px';
    const dialogRef = this.dialog.open(CourseDialog2Component, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data != undefined) {
        this.data3.forEach((e,i)=>{
          if(data.idCliente==this.data3[i].idCliente){
          
              data.nombreCli=this.data3[i].nombreCli;
            }
        })
        data.fechaCreacion=new Date();
        if((data.cantidad) > 1){
          var nTransfo = data.cantidad;
          let arregloTransfo:Transformadores[]=[];
          for (let i = 0; i < nTransfo; i++) {
            arregloTransfo[i]=data;
          }
          console.log("ARREGLO TRANSFOR:",arregloTransfo);
          this.arraySubmit(arregloTransfo,this.dialog);
          arregloTransfo=[];
          this.isLoadingResults=false;
          setTimeout(()=>{
            this.getVista();
          },1000);
        }
        else{
          this.onFormSubmit(data, this.dialog);
          this.isLoadingResults=false;
          setTimeout(()=>{
            this.getVista();
          },100);
        } 
       
      }
      else{
        this.dialog.closeAll();
        this.getVista();
        
      }
    })
  }

  arraySubmit(array,dialog:MatDialog){
    this.isLoadingResults=true;
    this.transformadoresService.addTransformadores(array).subscribe((res)=>{
      if(res!=undefined){
        this.isLoadingResults=false;
        this.mensajeSnack=`Transformador agregado`
        this.openSnackBar(this.mensajeSnack);
        this.arrayBool=true;
      }
    },
    err => {
      console.log(err);
      this.mensajeSnack=`No se ha agregado ningún transformador`
      this.openSnackBar(this.mensajeSnack);
      this.isLoadingResults=false;
      this.arrayBool=false;
    }
    )
  }

  onFormSubmit(form: NgForm, dialog: MatDialog) {
    this.isLoadingResults = true;
    this.transformadoresService.addTransformador(form).subscribe(
      (res) => {
        this.isLoadingResults = false;
        this.mensajeSnack=`Transformador agregado`
        this.openSnackBar(this.mensajeSnack);   
      },
      err => {
        this.mensajeSnack=`No se ha agregado ningún transformador`
        this.openSnackBar(this.mensajeSnack);
        console.log(err);
        this.isLoadingResults = false;
      }
    );
  }

  getClientes(): void {
    this.clientesService.getClientes()
    .subscribe(cliente => {
      // console.log("clientes",cliente);
      this.data3=cliente;
      this.diego =(<any[]>cliente).map(v => {
        return {id:v.idCliente,value:v.nombreCli,viewValue:v.nombreCli}
      })
    });
  };

  getTipoTransfo():void{
    this.tipoTransfoService.getTipoTransfo()
    .subscribe(tipoTransfo => {
      // console.log("clientes",cliente);
      this.data8TipoTransfo=tipoTransfo;
      this.dataTipoTransfo =(<any[]>tipoTransfo).map(v => {
        return {id:v.idTipoTransfo,value:v.nombreTipoTransfo,viewValue:v.nombreTipoTransfo}
      })
    });
  }

  getTransformador(id: number) {
    this.transformadoresService.getTransformador(id).subscribe(data => {
      this.idTransfo = data.idTransfo;
      // this.empleadoForm.setValue({
      //   nombreEmp: data.nombreEmp
      // });
    });
  }

  deleteTransformador(id: number) {
    this.isLoadingResults = true;
    this.transformadoresService.deleteTransformador(id)
      .subscribe(res => {
          this.isLoadingResults = false;
          // this.router.navigate(['/supplier']);
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
      
  }

  dialogDeleteTransfo(obj): void{
    obj.titulo="Borrar transformador?";
    obj.labelButton="Borrar";
    obj.diego=this.diego;
    this.getTransformador(obj.idTransfo);
    this.dialog.open(CourseDialog4Component,{data:obj});
    const dialogRef4 = this.dialog.open(CourseDialog4Component,{data:obj});
    dialogRef4.afterClosed().subscribe(res =>{
      if((res!=null))
      {
        this.deleteTransformador(res.idTransfo);
        this.mensajeSnack=`Transformador eliminado`
        this.openSnackBar(this.mensajeSnack);
      }
      this.dialog.closeAll();
      setTimeout(()=>{
        this.getVista();
      },100);
    })
  }

  onUpdateSubmit(form: NgForm) {
    this.isLoadingResults = true;
    if(this.idTransfo!==null){
      this.transformadoresService.updateTransformador(this.idTransfo, form).subscribe(
        () => {
          // console.log("Esto es el form: ", form);
          this.isLoadingResults = false;
          // this.getTransformadores();
          // this.router.navigate(['/supplier']);
        },
        err => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
    }
  }

  dialogEditTransfo(obj): void {
    obj.titulo="Editar Transformador";
    obj.labelButton="Guardar";
    obj.diego=this.diego;
    obj.dataTipoTransfo=this.dataTipoTransfo;
    obj.habilitar=true;
    obj.cancelado=false;
    // console.log("o be jota: ",obj);
    this.getTransformador(obj.idTransfo);
    const dialogRef3 = this.dialog.open(CourseDialog4Component, { data:obj});
    dialogRef3.afterClosed().subscribe(res =>{
      // console.log("detalle a ver:",res);
      if(res.cancelado==false){
        this.onUpdateSubmit(res);
        this.dialog.closeAll();
        this.mensajeSnack=`Transformador modificado`;
        this.openSnackBar(this.mensajeSnack);
        
        // this.getTransformadores();
      }
      this.getVista();
    })
  }

  openSnackBar(mensaje) {
    this._snackBar.open(mensaje,"mensaje", {
       duration: this.durationInSeconds * 1000,
      });
  }

  getEtapas(){
    this.etapaService.getEtapas()
    .subscribe(etapa => {
      this.data4=etapa;
    })
  }

  getTipoEtapas(): Observable<any> {
    return this.tipoEtapaService.getTipoEtapas().pipe(
      tap(tipoEtapa => this.data6 = tipoEtapa)
    )
  }

  getEtapasporTransfo(id:number): Observable<Etapa[]> {
    return this.etapaService.getEtapasPorIdTransfo(id).pipe(
      tap(etapa => this.data5 = etapa)
    );
  }

  onRowClicked(row) {
    this.data2 = row;
    forkJoin([
      this.getEtapasporTransfo(this.data2.idTransfo),
      this.getTipoEtapas()
    ]).subscribe(() => {
      this.asignarEtapaTransfo();
      this.openDialogEtapaTransfo(this.data7);
    });    
  }
    
    asignarEtapaTransfo(){
      this.data7=[];
      this.data5.forEach((e,i)=>{
        let obj = new EtapaTransfo;     
        this.data6.forEach((e,j)=>{
            if(this.data5[i].idTipoEtapa==this.data6[j].idTipoEtapa)
            {
              
              obj.nombreEtapa=this.data6[j].nombreEtapa;
              
            }
          })
        obj.dateIni=this.data5[i].dateIni;
        obj.dateFin=this.data5[i].dateFin;
        obj.tiempoParc=this.data5[i].tiempoParc;
        obj.tiempoFin=this.data5[i].tiempoFin;   
       this.data7.push(obj);
      })
      // console.log(this.data7);
      // this.openDialogEtapaTransfo(this.data7);
    }

    openDialogEtapaTransfo(obj):void{
        
      const dialogRef5 = this.dialog.open(ShowInfoComponent,{
        width:'100%',
        position: {
          left: `100px`,
          
        },
        data:obj,
      })
      dialogRef5.afterClosed().subscribe(result => {
        // console.log('The dialog was closed');
      })
    }
    
    getDataExcel(): void {
      this.transformadoresService.getDataExcel().subscribe(res=>{this.dataExcel=res})
    }
  


    export(){
      console.log(this.dataExcel);
      
    }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

}



interface ComboClientes{
  id:number;
  value:string;
  viewValue:string;
}

interface ComboTipoTransfo{
  id:number;
  value:string;
  viewValue:string;
}


@Component({
  selector: "alta-transformadores",
  templateUrl: "alta-transformadores.html"
})

export class CourseDialog2Component{



  form: FormGroup;
  potencia:number;
  oPe:string;
  oTe:number;
  idTransfo:number;
  idCliente:number;
  nombreCli:string;
  idTipoTransfo:number;
  nombreTipoTransfo:string;
  observaciones:string;
  // rangoInicio:number;
  f:Cliente;
  cantidad:number;
  // rangoFin:number;
  labelButton:string;
  titulo:string;
  data3: Cliente[] = [];
  diego2:ComboClientes[];
  dataTipoTransfo:ComboTipoTransfo[];
  matcher = new MyErrorStateMatcher();
  clientesService: ClienteService;
  selectedCliente: string;
  valueTransfo:TipoTransfo;

  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialog2Component>,
    @Inject(MAT_DIALOG_DATA) data1
  ) {
      this.titulo=data1.titulo;
      this.labelButton=data1.labelButton;
      this.diego2=data1.diego;
      this.potencia=data1.potencia;
      this.oPe=data1.oPe;
      this.dataTipoTransfo=data1.dataTipoTransfo;

      // this.rangoInicio=data1.rangoInicio;
      // this.rangoFin=data1.rangoFin;
      this.oTe=data1.oTe;
      this.cantidad=data1.cantidad;
      this.idCliente=data1.idCliente;
      

      this.observaciones=data1.observaciones;
    
  }

  ngOnInit() {
    
    
    this.form = this.fb.group({
      potencia:[this.potencia,[Validators.required]],
      oPe:[this.oPe,[Validators.required]],
      cantidad:[this.cantidad,[Validators.required]],
      oTe:[this.oTe,[Validators.required]],
      idCliente:[this.idCliente],
      observaciones:[this.observaciones],
      nombreCli:[this.nombreCli],
      idTipoTransfo:[this.idTipoTransfo,[Validators.required]],
      nombreTipoTransfo:[this.nombreTipoTransfo],
      valueTransfo:[this.valueTransfo],
      f:[this.f]
    },);  
  }
  
  

  changeClient(value) {
    return value.id;
  } 

  changeTipoTransfo(valueTransfo){
    return valueTransfo.id;
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }


}


@Component({
  selector: "editar-transformadores",
  templateUrl: "editar-transformadores.html"
})
export class CourseDialog4Component{



  form: FormGroup;
  potencia:number;
  oPe:string;
  oTe:number;
  idTransfo:number;
  idCliente:number;
  nombreCli:string;
  observaciones:string;
  // rangoInicio:number;
  f:Cliente;
  // rangoFin:number;
  labelButton:string;
  titulo:string;
  data3: Cliente[] = [];
  diego2:ComboClientes[];
  matcher = new MyErrorStateMatcher();
  clientesService: ClienteService;
  selectedCliente: string;
  habilitar: boolean;
  cancelado:boolean;
  idTipoTransfo:number;
  nombreTipoTransfo:string;
  dataTipoTransfo:ComboTipoTransfo[];
  valueTransfo:TipoTransfo;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialog4Component>,
    @Inject(MAT_DIALOG_DATA) data1
  ) {
      this.titulo=data1.titulo;
      this.labelButton=data1.labelButton;
      this.diego2=data1.diego;
      this.habilitar=data1.habilitar;
      this.idTransfo=data1.idTransfo;
      this.potencia=data1.potencia;
      this.oPe=data1.oPe;
      this.dataTipoTransfo=data1.dataTipoTransfo;
      this.oTe=data1.oTe;
      this.idCliente=data1.idCliente;
      this.nombreCli=data1.nombreCli;
      this.observaciones=data1.observaciones;
      this.cancelado=data1.cancelado;
    
  }

  ngOnInit() {
    
    
    this.form = this.fb.group({
      idTransfo:[this.idTransfo],
      potencia:[this.potencia,[Validators.required]],
      oPe:[this.oPe,[Validators.required]],
      // rangoInicio:[this.rangoInicio,[Validators.required]],
      // rangoFin:[this.rangoFin,[Validators.required]],
      oTe:[this.oTe,[Validators.required]],
      idCliente:[this.idCliente],
      idTipoTransfo:[this.idTipoTransfo],
      observaciones:[this.observaciones],
      nombreCli:[this.nombreCli],
      cancelado:[this.cancelado]
    });  
    this.disabling();
  }
  
  disabling(){
    if(this.labelButton=="Borrar"){
      this.form.disable();
    }
  }

  changeClient(value) {
    return value;
  } 

  save() {
    this.dialogRef.beforeClose().subscribe(()=>{
      this.diego2.forEach((e,i)=>{
        if(this.form.value.idCliente==this.diego2[i].id){
          this.form.value.nombreCli = this.diego2[i].value;
        }
      })
    })
    this.form.value.cancelado=false;
    this.dialogRef.close(this.form.value);
  }

  close() {
    if(this.labelButton == "Guardar"){
      this.form.value.cancelado=true;
      this.dialogRef.close(this.form.value);
    }
    else if(this.labelButton == "Borrar") 
    {
      this.dialogRef.close();
    }
  }

}

@Component({
  selector: "info-etapa-transformadores",
  templateUrl: "info-etapa-transformadores.html"
})
export class ShowInfoComponent{
  displayedColumns: string[] = ['Nombre de Etapa', 'Fecha Inicio', 'Fecha Fin','Tiempo Parcial', 'Tiempo Fin'];
  dataEtapaPorTransfo:EtapaTransfo[]=[];
  nombreEtapa:string;
  dateIni:Date;
  dateFin:Date;
  tiempoParc:string;
  tiempoFin:string;

  constructor(private dialogRef: MatDialogRef<ShowInfoComponent>,
    @Inject(MAT_DIALOG_DATA) data1)
    {

      
        this.dataEtapaPorTransfo=data1;
    }

    ngOnInit(){
      // console.log(this.dataEtapaPorTransfo);
      this.dataEtapaPorTransfo;
    }

    onNoClick(): void {
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

