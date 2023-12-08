import { Aeronaves } from "./types/Aeronaves";
import { Aeroportos } from "./types/Aeroportos";
import { Trechos } from "./types/Trechos";
import { Voos } from "./types/Voos";
import { Assentos } from "./types/Assentos"

export function aeronaveValida(aero: Aeronaves) {
  let valida = false;
  let mensagem = "";

  if (aero.FABRICANTE === undefined) {
    mensagem = "FABRICANTE não informado";
  }

  if (
    aero.FABRICANTE !== "Embraer" &&
    aero.FABRICANTE !== "Airbus" &&
    aero.FABRICANTE !== "Boeing"
  ) {
    mensagem = "FABRICANTE deve ser: Embraer, Airbus ou Boeing.";
  }

  if (aero.TOTAL_ASSENTOS === undefined) {
    mensagem = "Total de assentos não informado";
  }

  if (
    aero.TOTAL_ASSENTOS !== undefined &&
    (aero.TOTAL_ASSENTOS < 100 || aero.TOTAL_ASSENTOS > 1000)
  ) {
    mensagem = "Total de assentos é inválido";
  }

  if (aero.ANO_FABRICACAO === undefined) {
    mensagem = "Ano de fabricação não informado";
  }

  if (
    aero.ANO_FABRICACAO !== undefined &&
    (aero.ANO_FABRICACAO < 1990 || aero.ANO_FABRICACAO > 2026)
  ) {
    mensagem = "Ano de fabricação deve ser entre 1990 e 2026";
  }

  // se passou em toda a validação.
  if (mensagem === "") {
    valida = true;
  }

  return [valida, mensagem] as const;
}

export function aeroportoValida(aeroporto: Aeroportos) {
  let valida = false;
  let mensagem = "";

  if (aeroporto.NOME === undefined) {
    mensagem = "Nome não informado";
  }

  if (aeroporto.SIGLA === undefined) {
    mensagem = "Sigla não informada.";
  }

  if (aeroporto.CIDADE === undefined) {
    mensagem = "Cidade não informada.";
  }

  if (aeroporto.PAIS === undefined) {
    mensagem = "País não informado";
  }

  // se passou em toda a validação.
  if (mensagem === "") {
    valida = true;
  }

  return [valida, mensagem] as const;
}

export function trechoValida(aeroporto: Trechos) {
  let valida = false;
  let mensagem = "";

  if (aeroporto.ID_TRECHO === undefined) {
    mensagem = "ID do trecho não informado.";
  }

  if (aeroporto.FK_ID_ORIGEM === undefined) {
    mensagem = "FK do ID de origem não informada.";
  }

  if (aeroporto.FK_ID_DESTINO === undefined) {
    mensagem = "FK do ID de destino não informada.";
  }

  // se passou em toda a validação.
  if (mensagem === "") {
    valida = true;
  }

  return [valida, mensagem] as const;
}

export function vooValida(aeroporto: Voos) {
  let valida = false;
  let mensagem = "";

  if (aeroporto.HORA_DATA_CHEGADA_IDA === undefined) {
    mensagem = "Data de chegada da ida não informada.";
  }

  if (aeroporto.HORA_DATA_SAIDA_IDA === undefined) {
    mensagem = "Data de saida da ida não informada.";
  }

  if (aeroporto.HORA_DATA_CHEGADA_VOLTA === undefined) {
    mensagem = "Data de chegada da volta não informada.";
  }

  if (aeroporto.HORA_DATA_SAIDA_VOLTA === undefined) {
    mensagem = "Data de saida da volta não informada.";
  }

  if (aeroporto.TIPO === undefined) {
    mensagem = "Tipo de voo não informado.";
  }

  if (aeroporto.FK_ID_TRECHO === undefined) {
    mensagem = "Fk de id do trecho não informado.";
  }

  if (aeroporto.FK_ID_AERONAVE === undefined) {
    mensagem = "Fk de id da aeronave não informada.";
  }

  if (aeroporto.PRECO === undefined) {
    mensagem = "Preço não informado.";
  }

  // se passou em toda a validação.
  if (mensagem === "") {
    valida = true;
  }

  return [valida, mensagem] as const;
}

export function assentoValida(aeroporto: Assentos) {
  let valida = false;
  let mensagem = "";

  if (aeroporto.FK_ID_AERONAVE === undefined) {
    mensagem = "FK de id da aeronave não informada.";
  }

  // se passou em toda a validação.
  if (mensagem === "") {
    valida = true;
  }

  return [valida, mensagem] as const;
}