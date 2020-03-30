import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { TransformadoresComponent } from '../app/transformadores/transformadores.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { ClientesComponent } from './clientes/clientes.component';
import { TimerComponent } from './timer/timer.component';

const routes: Routes = [
  {path:'login',component:LoginComponent,data:{title:'Login'}},
  {path:'register',component:RegisterComponent,data:{title:'Registro'}},
  {path:'transformadores',component:TransformadoresComponent},
  {path: 'empleados', component:EmpleadosComponent},
  {path: 'clientes',component:ClientesComponent },
  {path: 'temporizador', component:TimerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
