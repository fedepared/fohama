import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { TokenInterceptor } from "./interceptors/token.interceptors";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatListModule,  
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
  } from '@angular/material';
  import { MatTooltipModule } from '@angular/material/tooltip';
  import {MatSnackBarModule} from '@angular/material/snack-bar';
  import {MatSelectModule} from '@angular/material/select';
  import {MatToolbarModule} from '@angular/material/toolbar';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { EmpleadosComponent,CourseDialogComponent} from './empleados/empleados.component';
  import { NavBarComponent } from './nav-bar/nav-bar.component';
  import {MatSidenavModule} from '@angular/material/sidenav';
  import {MatDialogModule} from '@angular/material/dialog';
  import {MatGridListModule} from '@angular/material/grid-list';
  import { TransformadoresComponent, CourseDialog2Component,CourseDialog4Component, ShowInfoComponent } from './transformadores/transformadores.component';
import { ClientesComponent,CourseDialog3Component } from './clientes/clientes.component';
import { TimerComponent, DialogFinalizarProceso, SnackBarComponent } from './timer/timer.component';
import * as $ from "../../node_modules/jquery/dist/jquery.min.js";
import * as moment from 'moment';
  
  @NgModule({
    declarations: [AppComponent, LoginComponent, RegisterComponent, TransformadoresComponent, EmpleadosComponent, NavBarComponent,CourseDialogComponent,DialogFinalizarProceso,CourseDialog2Component, ClientesComponent,CourseDialog3Component,CourseDialog4Component, TimerComponent,SnackBarComponent,ShowInfoComponent],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule,MatInputModule,
      MatPaginatorModule,MatProgressSpinnerModule, MatSortModule, MatTableModule, MatIconModule, MatButtonModule, MatCardModule,
      MatFormFieldModule,FormsModule, ReactiveFormsModule, MatToolbarModule,MatSidenavModule,MatListModule,MatSelectModule,MatDialogModule,MatGridListModule,MatSnackBarModule,MatTooltipModule],
      providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ],
  entryComponents:[CourseDialogComponent,DialogFinalizarProceso,EmpleadosComponent,CourseDialog2Component,CourseDialog3Component,TransformadoresComponent,ClientesComponent,CourseDialog4Component,SnackBarComponent,ShowInfoComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
