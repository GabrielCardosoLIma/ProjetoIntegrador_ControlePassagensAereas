import { Aeronaves } from "./types/Aeronaves";
import { Aeroportos } from "./types/Aeroportos";
import { Assentos } from "./types/Assentos";
import { Voos } from "./types/Voos";
import { Trechos } from "./types/Trechos";

// Função para converter as linhas de dados em objetos do tipo Aeronaves
export function rowsToAeronaves(
  oracleRows: unknown[] | undefined
): Array<Aeronaves> {
  // Inicializa um array vazio para armazenar os objetos Aeronaves
  let aeronaves: Array<Aeronaves> = [];

  if (oracleRows !== undefined) {
    oracleRows.forEach((registro: any) => {
      // Cria um objeto do tipo Aeronaves a partir das propriedades do registro
      const aeronave: Aeronaves = {
        ID_AERONAVE: registro[0],
        MODELO: registro[1],
        FABRICANTE: registro[2],
        ANO_FABRICACAO: registro[3],
        TOTAL_ASSENTOS: registro[4],
      } as Aeronaves;

      // Adiciona o objeto Aeronaves ao array
      aeronaves.push(aeronave);
    });
  }

  // Retorna o array contendo os objetos Aeronaves
  return aeronaves;
}

// Função para converter as linhas de dados em objetos do tipo Aeroportos
export function rowsToAeroportos(
  oracleRows: unknown[] | undefined
): Array<Aeroportos> {
  // Inicializa um array vazio para armazenar os objetos Aeroportos
  let aeroportos: Array<Aeroportos> = [];
  let aeroporto;
  if (oracleRows !== undefined) {
    oracleRows.forEach((registro: any) => {
      // Cria um objeto do tipo aeroportos a partir das propriedades do registro
      aeroporto = {
        ID_AEROPORTO: registro[0],
        SIGLA: registro[1],
        NOME: registro[2],
        CIDADE: registro[3],
        PAIS: registro[4],
      } as Aeroportos;

      // Adiciona o objeto Aeroportos ao array
      aeroportos.push(aeroporto);
    });
  }
  // Retorna o array contendo os objetos Aeroportos
  return aeroportos;
}

// Função para converter as linhas de dados em objetos do tipo Voos
export function rowsToVoos(oracleRows: unknown[] | undefined): Array<Voos> {
  // Inicializa um array vazio para armazenar os objetos Voos
  let voos: Array<Voos> = [];
  let voo;
  if (oracleRows !== undefined) {
    oracleRows.forEach((registro: any) => {
      // Cria um objeto do tipo voos a partir das propriedades do registro
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

      // Adiciona o objeto voos ao array
      voos.push(voo);
    });
  }
  // Retorna o array contendo os objetos Voos
  return voos;
}

// Função para converter as linhas de dados em objetos do tipo Trechos
export function rowsToTrechos(
  oracleRows: unknown[] | undefined
): Array<Trechos> {
  // Inicializa um array vazio para armazenar os objetos Trechos
  let Trechos: Array<Trechos> = [];
  let trecho;
  if (oracleRows !== undefined) {
    oracleRows.forEach((registro: any) => {
      // Cria um objeto do tipo Trechos a partir das propriedades do registro
      trecho = {
        ID_TRECHO: registro[0],
        FK_ID_ORIGEM: registro[1],
        FK_ID_DESTINO: registro[2],
      } as Trechos;

      // Adiciona o objeto trechos ao array
      Trechos.push(trecho);
    });
  }
  // Retorna o array contendo os objetos Trechos
  return Trechos;
}

// Função para converter as linhas de dados em objetos do tipo Assentos
export function rowsToAssentos(
  oracleRows: unknown[] | undefined
): Array<Assentos> {
  // Inicializa um array vazio para armazenar os objetos Assentos
  let Assentos: Array<Assentos> = [];
  let assento;
  if (oracleRows !== undefined) {
    oracleRows.forEach((registro: any) => {
      // Cria um objeto do tipo Assentos a partir das propriedades do registro
      assento = {
        ID_ASSENTO: registro[0],
        STATUS: registro[1],
        REFERENCIA: registro[2],
        FK_ID_AERONAVE: registro[3],
      } as Assentos;

      // Adiciona o objeto assentos ao array
      Assentos.push(assento);
    });
  }
  // Retorna o array contendo os objetos Assentos
  return Assentos;
}
