"use strict";
// Neste arquivo conversores, vamos sempre converter uma
// resposta de consulta do Oracle para um tipo que desejarmos
// portanto o intuito desse arquivo typescript é reunir funções
// que convertam de "linha do oracle" para um array javascript onde
// cada elemento represente um elemento de um tipo.
Object.defineProperty(exports, "__esModule", { value: true });
exports.rowsToAssentos = exports.rowsToTrechos = exports.rowsToVoos = exports.rowsToAeroportos = exports.rowsToAeronaves = void 0;
function rowsToAeronaves(oracleRows) {
    // vamos converter um array any (resultados do oracle)
    // em um array de Aeronave
    let aeronaves = [];
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            const aeronave = {
                ID_AERONAVE: registro[0],
                MODELO: registro[1],
                FABRICANTE: registro[2],
                ANO_FABRICACAO: registro[3],
                COMPANHIA: registro[4],
                TOTAL_ASSENTOS: registro[5],
            };
            // inserindo o novo Array convertido.
            aeronaves.push(aeronave);
        });
    }
    return aeronaves;
}
exports.rowsToAeronaves = rowsToAeronaves;
function rowsToAeroportos(oracleRows) {
    // vamos converter um array any (resultados do oracle)
    // em um array de Aeroporto
    let aeroportos = [];
    let aeroporto;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            aeroporto = {
                ID_AEROPORTO: registro[0],
                SIGLA: registro[1],
                NOME: registro[2],
                CIDADE: registro[3],
                PAIS: registro[4],
            };
            // inserindo o novo Array convertido.
            aeroportos.push(aeroporto);
        });
    }
    return aeroportos;
}
exports.rowsToAeroportos = rowsToAeroportos;
function rowsToVoos(oracleRows) {
    // vamos converter um array any (resultados do oracle)
    // em um array de Aeroporto
    let voos = [];
    let voo;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
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
            // inserindo o novo Array convertido.
            voos.push(voo);
        });
    }
    return voos;
}
exports.rowsToVoos = rowsToVoos;
function rowsToTrechos(oracleRows) {
    // vamos converter um array any (resultados do oracle)
    // em um array de Aeroporto
    let Trechos = [];
    let trecho;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            trecho = {
                ID_TRECHO: registro[0],
                FK_ID_ORIGEM: registro[1],
                FK_ID_DESTINO: registro[2],
            };
            // inserindo o novo Array convertido.
            Trechos.push(trecho);
        });
    }
    return Trechos;
}
exports.rowsToTrechos = rowsToTrechos;
function rowsToAssentos(oracleRows) {
    // vamos converter um array any (resultados do oracle)
    // em um array de Aeroporto
    let Assentos = [];
    let assento;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            assento = {
                ID_ASSENTO: registro[0],
                STATUS: registro[1],
                REFERENCIA: registro[2],
                FK_ID_AERONAVE: registro[3],
            };
            // inserindo o novo Array convertido.
            Assentos.push(assento);
        });
    }
    return Assentos;
}
exports.rowsToAssentos = rowsToAssentos;
