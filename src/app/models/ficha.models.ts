export interface FichaModel {
    id_porca: string;
    data_nascimento: string;
    tipo_porca: string;
    lote: {
        id_lote: number;
        codigo_lote: number;
    };
}

export interface FichaListModel {
  id_porca: string;
  tipo_porca: string;
  data_nascimento: string;
  codigo_lote: number;
}