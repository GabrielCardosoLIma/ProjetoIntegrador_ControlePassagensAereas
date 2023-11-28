import { Aeronaves } from "./types/Aeronaves";
import { Aeroportos } from "./types/Aeroportos";
import { Assentos } from "./types/Assentos";
import { Voos } from "./types/Voos";
import { Trechos } from "./types/Trechos";

export function rowsToAeronaves(
  oracleRows: unknown[] | undefined
): Array<Aeronaves> {
  // vamos converter um array any (resultados do oracle)
  // em um array de Aeronave
  let aeronaves: Array<Aeronaves> = [];

  if (oracleRows !== undefined) {
    oracleRows.forEach((registro: any) => {
      const aeronave: Aeronaves = {
        ID_AERONAVE: registro[0],
        MODELO: registro[1],
        FABRICANTE: registro[2],
        ANO_FABRICACAO: registro[3],
        COMPANHIA: registro[4],
        TOTAL_ASSENTOS: registro[5],
      } as Aeronaves;

      // inserindo o novo Array convertido.
      aeronaves.push(aeronave);
    });
  }

  return aeronaves;
}

export function rowsToAeroportos(
  oracleRows: unknown[] | undefined
): Array<Aeroportos> {
  // vamos converter um array any (resultados do oracle)
  // em um array de Aeroporto
  let aeroportos: Array<Aeroportos> = [];
  let aeroporto;
  if (oracleRows !== undefined) {
    oracleRows.forEach((registro: any) => {
      aeroporto = {
        ID_AEROPORTO: registro[0],
        SIGLA: registro[1],
        NOME: registro[2],
        CIDADE: registro[3],
        PAIS: registro[4],
      } as Aeroportos;

      // inserindo o novo Array convertido.
      aeroportos.push(aeroporto);
    });
  }
  return aeroportos;
}

export function rowsToVoos(oracleRows: unknown[] | undefined): Array<Voos> {
  // vamos converter um array any (resultados do oracle)
  // em um array de Aeroporto
  let voos: Array<Voos> = [];
  let voo;
  if (oracleRows !== undefined) {
    oracleRows.forEach((registro: any) => {
      voo = {
        ID_VOO: registro[0],
        HORA_DATA_CHEGADA_IDA: registro[1],
        HORA_DATA_SAIDA_IDA: registro[2],
        HORA_DATA_CHEGADA_VOLTA: registro[3],
        HORA_DATA_SAIDA_VOLTA: registro[4],
        TIPO: registro[5],
        FK_ID_TRECHO: registro[6],
        FK_ID_AERONAVE: registro[7],
        PRECO: registro[8],
      } as Voos;

      // inserindo o novo Array convertido.
      voos.push(voo);
    });
  }
  return voos;
}

export function rowsToTrechos(
  oracleRows: unknown[] | undefined
): Array<Trechos> {
  // vamos converter um array any (resultados do oracle)
  // em um array de Aeroporto
  let Trechos: Array<Trechos> = [];
  let trecho;
  if (oracleRows !== undefined) {
    oracleRows.forEach((registro: any) => {
      trecho = {
        ID_TRECHO: registro[0],
        FK_ID_ORIGEM: registro[1],
        FK_ID_DESTINO: registro[2],
      } as Trechos;

      // inserindo o novo Array convertido.
      Trechos.push(trecho);
    });
  }
  return Trechos;
}

export function rowsToAssentos(
  oracleRows: unknown[] | undefined
): Array<Assentos> {
  // vamos converter um array any (resultados do oracle)
  // em um array de Aeroporto
  let Assentos: Array<Assentos> = [];
  let assento;
  if (oracleRows !== undefined) {
    oracleRows.forEach((registro: any) => {
      assento = {
        ID_ASSENTO: registro[0],
        STATUS: registro[1],
        REFERENCIA: registro[2],
        FK_ID_AERONAVE: registro[3],
      } as Assentos;

      // inserindo o novo Array convertido.
      Assentos.push(assento);
    });
  }
  return Assentos;
}