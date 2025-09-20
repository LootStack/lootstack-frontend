export interface Usuario {
    id:number;
    nome:string;
    perfil: 'ADMINISTRADOR' | 'FUNCIONARIO';
}

export interface TokenPayload extends Usuario {
  iat?: number;
  exp?: number;
}