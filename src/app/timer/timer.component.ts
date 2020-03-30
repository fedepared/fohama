import { Component, OnInit,Inject } from '@angular/core';
import { EtapaService } from '../services/etapa.service';
import { EmpleadoService } from '../services/empleado.service';
import { TransformadoresService } from '../services/transformadores.service';
import { Transformadores } from '../models/transformadores';
import { Etapa } from '../models/etapa';
import { Empleado } from '../models/empleado';
import { TipoEtapa } from '../models/tipoEtapa';
import { TipoEtapaService } from '../services/tipo-etapa.service';
import { tiempo } from '../models/tiempo';
import * as moment from 'moment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ok } from 'assert';
import { DomElementSchemaRegistry, ResourceLoader } from '@angular/compiler';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { VistaService } from '../services/vista.service';
import { Vista } from '../models/Vista';
import { Timer } from 'easytimer.js';
import * as $ from 'jquery';


interface ComboTipoEtapa{
  id:number;
  nombreEtapa:string;
  value:string;
  viewValue:string;
}

interface ComboTransformadores{
  id:number;
  oTe:number;
  oPe:string;
  potencia:number;
  rangoInicio:number;
  rangoFin:number;
  value:string;
  viewValue:string;
}

interface ComboEmpleado{
  id:number;
  nombreEmpleado:string;
  value:string;
  viewValue:string;
}

export interface DialogData {
  ok:boolean;
  empleadoValue: string;
  transfoValue: string;
  etapaValue:string;
}




@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  id: NodeJS.Timer;
  tiempoParc: string;
  mensajeSnack: string;
  

  constructor(private tipoEtapaService:TipoEtapaService,private empleadoService:EmpleadoService,private transformadoresService:TransformadoresService, private etapaService:EtapaService,public dialog:MatDialog, private getVistaService:VistaService, private _snackBar: MatSnackBar) { }

  dataTransfo:Transformadores[]=[];
  dataTipoEtapa:TipoEtapa[]=[];
  dataEmpleados:Empleado[]=[];
  dataEtapas:Etapa[]=[];
  dataEtapa:Etapa;

  comboTransfo:ComboTransformadores[];
  comboTipoEtapa:ComboTipoEtapa[];
  comboidTipoEtapaSelected:number;
  comboNombreTipoEtapaSelected:string;
  comboEmpleados:ComboEmpleado[];
  vista:Vista[]=[];
  proceso:ComboTipoEtapa;
  empleado:ComboEmpleado;
  transfo:ComboTransformadores;
  arreglo:TipoEtapa[]=[];
  play=true;
  isLoadingResults = true;
  getFechaInicio:Date;
  getFechaFin:Date;
  now:string;
  contador= new tiempo;
  contadorPausado=new tiempo;
  isPause=false;
  isStop=false;
  comienzo=true;
  empleadoValue: string;
  transfoValue: string;
  etapaValue:string;
  ok=false;
  class:boolean;
  durationInSeconds=3;
  tiempoReloj:string;
  tiempo:Timer;
  arrTiempos:Timer[];

  ngOnInit() {
    // this.getTipoEtapas();
    this.getTransformadores();
    this.getEmpleados();
    this.getEtapas();
    this.actualTime();    
    this.tiempoReloj="00:00:00";
    this.tiempo = new Timer();
    this.arrTiempos=[];
    
  }

  getTipoEtapasXTransfo(id){
    this.transformadoresService.getTipoEtapasXTransfo(id)
    .subscribe(res => {
      console.log(res);
       this.comboTipoEtapa =(<any[]>res).map(v => {
        return {
            id:v.idTipoEtapa,nombreEtapa:v.nombreEtapa,value:v.nombreEtapa,viewValue:v.nombreEtapa
           }
         })
        console.log("combo Tipos de Etapas", this.comboTipoEtapa);
    },
    err=>{
      console.log(err);
    })
  };

  actualTime(){
    setInterval(()=>{
      moment.locale('es');
      this.now=moment().format('D MMMM YYYY, h:mm:ss a');
    },1000)
    
  }

  
  getTipoEtapas(){
    
    this.tipoEtapaService.getTipoEtapas()
      .subscribe(tipoEtapa => {
        this.arreglo = tipoEtapa;
        return this.arreglo;
        // this.comboTipoEtapa =(<any[]>tipoEtapa).map(v => {
        //   return {
        //     id:v.idTipoEtapa,nombreEtapa:v.nombreEtapa,value:v.nombreEtapa,viewValue:v.nombreEtapa
        //   }
        // })
        // console.log("combo Tipos de Etapas", this.comboTipoEtapa);
        
        this.isLoadingResults = false;
      }, err => {
        console.log(err);
        this.isLoadingResults = false;
      });
    }

  getEmpleados(): void {
    this.empleadoService.getEmpleados()
    .subscribe(empleados => {
      this.dataEmpleados = empleados;
      console.log(this.dataEmpleados);
      this.comboEmpleados =(<any[]>empleados).map(v => {
        return {
          id:v.idEmpleado,nombreEmpleado:v.nombreEmp,value:v.nombreEmp,viewValue:v.nombreEmp
        }
      })

      this.isLoadingResults = false;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }
  getTransformadores(): void {
    this.transformadoresService.getTransformadores()
      .subscribe(transfo => {
        this.dataTransfo = transfo;
        console.log(this.dataTransfo);
        let cont:number=0;
        for (let i = 0; i < this.dataTransfo.length; i++) {
          let oPe = this.dataTransfo[i].oPe;
         
          for (let j = 1; j < this.dataTransfo.length; j++) {
            if(this.dataTransfo[j].oPe==oPe){
         
              cont++;
            }
          }
          for(let k=0;k<this.dataTransfo.length;k++){
            if(this.dataTransfo[k].oPe==oPe){
         
              this.dataTransfo[k].rangoFin=cont;
            }
          }
          oPe=null;
          cont=0;
        }
        this.comboTransfo = (<any[]>transfo).map(v=>{
          return{
            id:v.idTransfo,oTe:v.oTe,oPe:v.oPe,potencia:v.potencia,rangoInicio:v.rangoInicio,rangoFin:v.rangoFin,value:`oT:${v.oTe} | oP:${v.oPe} | rango: ${v.rangoInicio}/${v.rangoFin}`, viewValue:`oT:${v.oTe} | oP:${v.oPe} | rango: ${v.rango}`
          }
        })
        this.isLoadingResults = false;
      }, err => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

  select(transfo){
    console.log(transfo);
    let arrVista=new Array;
    let transfoResult=new Object();
    let TipoEtapas=new Array<TipoEtapa>();
    TipoEtapas=[];
    this.getTipoEtapasXTransfo(transfo.id);
 
    
  }

  getEtapas(): void {
    this.etapaService.getEtapas()
      .subscribe(etapas => {
        this.dataEtapas = etapas;
        this.isLoadingResults = false;
      }, err => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

  start(){
    
    if((this.proceso && this.empleado && this.transfo) != undefined){
      this.play=!this.play;
      this.isPause=!this.isPause;
      this.isStop=true;
      this.class=true;
      this.mensajeSnack=`Proceso iniciado`
      this.openSnackBar(this.mensajeSnack);           
      this.tiempo.start();
      this.id=setInterval(()=>{
        this.tiempoReloj=this.tiempo.getTimeValues().toString();
      },1000)
      

      if(this.comienzo==true){
        this.getFechaInicio=new Date();
        this.dataEtapa=new Etapa();
        this.dataEtapa.idTipoEtapa=this.proceso.id;
        this.dataEtapa.idEmpleado=this.empleado.id;
        this.dataEtapa.idTransfo=this.transfo.id;
        this.dataEtapa.dateIni=this.getFechaInicio;
    
        this.etapaService.addEtapa(this.dataEtapa).subscribe(
          (res) => {
            console.log(res.idEtapa);
            let idEtapa=res.idEtapa;
            this.dataEtapa.idEtapa=idEtapa;
                this.isLoadingResults = false;
          },
          err => {
            console.log(err);
            this.isLoadingResults = false;
          }
        );
        this.comienzo=false;
      }
      
    }

    console.log("proceso",this.proceso);
    console.log("empleado",this.empleado);
    console.log("transfo",this.transfo);
    
  }

  pause(){
    this.tiempo.pause();
    let parcial=this.tiempo.getTimeValues().toString();
    this.tiempoReloj=parcial;
    clearInterval(this.id);
    this.mensajeSnack=`Proceso pausado`
    this.openSnackBar(this.mensajeSnack);
    this.isPause=!this.isPause;
    this.play=!this.play;
    this.contadorPausado=this.contador;
    this.dataEtapa.tiempoParc=parcial;
    this.updateEtapa(this.dataEtapa);
  }

  updateEtapa(data) {
    this.isLoadingResults = true;
    this.etapaService.updateEtapa(data.idEtapa,data).subscribe(
      res => {
        this.isLoadingResults = false;
        console.log("DATA UPDATED",res);
        // this.router.navigate(['/supplier']);
      },
      err => {
        console.log(err);
        this.isLoadingResults = false;
      }
    );
    
  }

  addProceso(){
    let tiempo = new Timer();
    this.arrTiempos.push(tiempo);
    console.log(this.arrTiempos);
  }

  stop(){
    clearInterval(this.id);
    this.openDialog();
    this.isStop=!this.isStop;
    this.isPause=false;
    this.play=true;

  }

  openDialog(){
    const dialogRef=this.dialog.open(DialogFinalizarProceso,{
      width:'300px',
      data: {ok:this.ok,empleadoValue: this.empleado.nombreEmpleado,transfoValue:`oP: ${this.transfo.oPe} | oT: ${this.transfo.oTe} | rango: ${this.transfo.rangoInicio}/${this.transfo.rangoFin} `,etapaValue:this.proceso.nombreEtapa}
    })
    
    
    dialogRef.afterClosed().subscribe((confirmado:Boolean)=>{
      if(confirmado){
        this.getFechaFin=new Date();
        console.log(this.getFechaFin);
        console.log(this.dataEtapa);
        this.dataEtapa.dateFin=this.getFechaFin;
        this.contadorPausado=this.contador;
        this.dataEtapa.tiempoFin=this.tiempoReloj;
        this.dataEtapa.isEnded=true;
        this.dataEtapa.tiempoParc="Finalizada";
        console.log(this.dataEtapa);
        this.updateEtapa(this.dataEtapa);
        this.proceso=null;
        this.transfo=null;
        this.empleado=null;
        this.comienzo=true;
        this.class=false;
        this.mensajeSnack=`Proceso finalizado`;
        this.openSnackBar(this.mensajeSnack);
        // this.dataEtapa=new Etapa();

        
      }
      else{
        console.log("No cancelado");
      }
    })
   
  }

  openSnackBar(mensaje) {
    this._snackBar.open(mensaje,"mensaje", {
       duration: this.durationInSeconds * 1000,
      });
  }

}

@Component({
  selector: 'finalizar-proceso',
  templateUrl: 'finalizar-proceso.html',
})

export class DialogFinalizarProceso {

  ok:boolean;
  constructor(
    public dialogRef: MatDialogRef<DialogFinalizarProceso>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.ok=data.ok;
    }
    ngOnInit() {
      
    }

  onClick(){
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}



@Component({
  selector: 'snack-bar-component',
  templateUrl: 'snack-bar.html',
  styles: [],
})
export class SnackBarComponent {
  mensaje:string='';
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.mensaje=data.mensaje;
   }
}

