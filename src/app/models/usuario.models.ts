export interface Usuario {
    id:number;
    nome:string;
    perfil: 'ADMINISTRADOR' | 'FUNCIONARIO';
}