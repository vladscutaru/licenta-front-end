export interface Cerere {
    id?: number;
    idStudent: number;
    nume: string;
    prenume: string;
    facultate: string;
    an: number;
    oras: string;
    judet: string;
    telefon: string;
    email: string;
    orfan: boolean;
    situatieSocialaPrecara: boolean;
    situatieMedicalaSpeciala: boolean;
    arhiva: string;
    cazat: boolean;
    camin: any;
    etaj: number;
    camera: number;
    confirmat: boolean;
    status: string;
}

export const PENDING_STATUS = "pending";
export const DENIED_STATUS = "denied";
export const ACCEPTED_STATUS = "accepted";