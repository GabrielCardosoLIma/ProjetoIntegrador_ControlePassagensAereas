"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rowsToAssentos = exports.rowsToTrechos = exports.rowsToVoos = exports.rowsToAeroportos = exports.rowsToAeronaves = void 0;
// Função para converter as linhas de dados em objetos do tipo Aeronaves
function rowsToAeronaves(oracleRows) {
    // Inicializa um array vazio para armazenar os objetos Aeronaves
    let aeronaves = [];
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            // Cria um objeto do tipo Aeronaves a partir das propriedades do registro
            const aeronave = {
                ID_AERONAVE: registro[0],
                MODELO: registro[1],
                FABRICANTE: registro[2],
                ANO_FABRICACAO: registro[3],
                TOTAL_ASSENTOS: registro[4],
            };
            // Adiciona o objeto Aeronaves ao array
            aeronaves.push(aeronave);
        });
    }
    // Retorna o array contendo os objetos Aeronaves
    return aeronaves;
}
exports.rowsToAeronaves = rowsToAeronaves;
// Função para converter as linhas de dados em objetos do tipo Aeroportos
function rowsToAeroportos(oracleRows) {
    // Inicializa um array vazio para armazenar os objetos Aeroportos
    let aeroportos = [];
    let aeroporto;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            // Cria um objeto do tipo aeroportos a partir das propriedades do registro
            aeroporto = {
                ID_AEROPORTO: registro[0],
                SIGLA: registro[1],
                NOME: registro[2],
                CIDADE: registro[3],
                PAIS: registro[4],
            };
            // Adiciona o objeto Aeroportos ao array
            aeroportos.push(aeroporto);
        });
    }
    // Retorna o array contendo os objetos Aeroportos
    return aeroportos;
}
exports.rowsToAeroportos = rowsToAeroportos;
// Função para converter as linhas de dados em objetos do tipo Voos
function rowsToVoos(oracleRows) {
    // Inicializa um array vazio para armazenar os objetos Voos
    let voos = [];
    let voo;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
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
            };
            // Adiciona o objeto voos ao array
            voos.push(voo);
        });
    }
    // Retorna o array contendo os objetos Voos
    return voos;
}
exports.rowsToVoos = rowsToVoos;
// Função para converter as linhas de dados em objetos do tipo Trechos
function rowsToTrechos(oracleRows) {
    // Inicializa um array vazio para armazenar os objetos Trechos
    let Trechos = [];
    let trecho;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            // Cria um objeto do tipo Trechos a partir das propriedades do registro
            trecho = {
                ID_TRECHO: registro[0],
                FK_ID_ORIGEM: registro[1],
                FK_ID_DESTINO: registro[2],
            };
            // Adiciona o objeto trechos ao array
            Trechos.push(trecho);
        });
    }
    // Retorna o array contendo os objetos Trechos
    return Trechos;
}
exports.rowsToTrechos = rowsToTrechos;
// Função para converter as linhas de dados em objetos do tipo Assentos
function rowsToAssentos(oracleRows) {
    // Inicializa um array vazio para armazenar os objetos Assentos
    let Assentos = [];
    let assento;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            // Cria um objeto do tipo Assentos a partir das propriedades do registro
            assento = {
                ID_ASSENTO: registro[0],
                STATUS: registro[1],
                REFERENCIA: registro[2],
                FK_ID_AERONAVE: registro[3],
            };
            // Adiciona o objeto assentos ao array
            Assentos.push(assento);
        });
    }
    // Retorna o array contendo os objetos Assentos
    return Assentos;
}
exports.rowsToAssentos = rowsToAssentos;
