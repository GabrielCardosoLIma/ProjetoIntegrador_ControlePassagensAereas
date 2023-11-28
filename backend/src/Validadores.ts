import { Aeronaves } from "./types/Aeronaves";
import { Aeroportos } from "./types/Aeroportos";

export function aeronaveValida(aero: Aeronaves) {
  let valida = false;
  let mensagem = "";

  if(aero.FABRICANTE === undefined){
    mensagem = "FABRICANTE não informado";
  }

  if(aero.FABRICANTE !== 'Embraer' && aero.FABRICANTE !== 'Airbus' && aero.FABRICANTE !== 'Boeing'){
    mensagem = "FABRICANTE deve ser: Embraer, Airbus ou Boeing.";
  }

  if(aero.MODELO === undefined){
    mensagem = "Modelo não informado.";
  }

  if(aero.TOTAL_ASSENTOS === undefined){
    mensagem = "Total de assentos não informado";
  }

  if((aero.TOTAL_ASSENTOS !== undefined) && (aero.TOTAL_ASSENTOS < 100 || aero.TOTAL_ASSENTOS > 1000)){
    mensagem = "Total de assentos é inválido";
  }

  if(aero.ANO_FABRICACAO === undefined){
    mensagem = "Ano de fabricação não informado";
  }

  if((aero.ANO_FABRICACAO!== undefined) && (aero.ANO_FABRICACAO < 1990 || aero.ANO_FABRICACAO > 2026)){
    mensagem = "Ano de fabricação deve ser entre 1990 e 2026";
  }

  // se passou em toda a validação.
  if(mensagem === ""){
    valida = true;
  }

  return [valida, mensagem] as const;
}


export function aeroportoValida(aeroporto: Aeroportos) {

  let valida = false;
  let mensagem = "";

  if(aeroporto.NOME === undefined){
    mensagem = "Nome não informado";
  }

  if(aeroporto.SIGLA === undefined){
    mensagem = "Sigla não informada.";
  }

  if(aeroporto.CIDADE === undefined){
    mensagem = "Cidade não informada.";
  }

  if(aeroporto.PAIS === undefined){
    mensagem = "País não informado";
  }

  // se passou em toda a validação.
  if(mensagem === ""){
    valida = true;
  }

  return [valida, mensagem] as const;
}