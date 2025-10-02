export interface AplicacaoModel {
  id_porca: string;
  nome_vacina: string;
  codigo_lote_vacina: string;
  dose_aplicada_ml: number;
  data_aplicacao: string;
  nome_aplicador: string;
}

export interface AplicacaoPayload {
  ids_porcas: string[];
  id_lote_vacina: number;
  dose_aplicada_ml: number;
  data_aplicacao: string;
  id_usuario?: number;
}