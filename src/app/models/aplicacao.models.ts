export interface AplicacaoModel {
    id_porca: string;
    nome_vacina: string;
    lote_vacina: string;
    dose_aplicada_ml: number;
    data_aplicacao: string;
    nome_aplicador: string;
}

export interface AplicacaoPayload {
    id_porca: string;
    nome: string;
    lote_vacina: string;
    data_validade: string;
    doses_total_ml: number;
    dose_aplicada_ml: number;
    data_aplicacao: string;
    id_usuario?: number;
}