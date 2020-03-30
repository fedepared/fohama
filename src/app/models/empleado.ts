import { Etapa } from './etapa';
import {EtapaEmpleado} from './etapaEmpleado';

export class Empleado {
    idEmpleado: number;
    nombreEmp: string;
    tiempoIni: Date;
    tiempoFin: Date;
    tiempoTot: Date;

    idEtapaEmpleado: EtapaEmpleado;
    idEtapa: Etapa;

    nombreEtapaEmpleado:Etapa[];
}