"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Importa os atributos de conexão Oracle, resposta personalizada e funções de conversão
const OracleConnAtribs_1 = require("./OracleConnAtribs");
// Importação das funções de conversão
const Conversores_1 = require("./Conversores");
const Validadores_1 = require("./Validadores");
// Importação dos módulos
const ora = require("oracledb");
const cors = require("cors");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
// Rota de teste para verificar se o servidor está respondendo
app.get("/", (req, res) => {
    res.send("Bem-vindo à minha aplicação!");
});
// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log("Servidor HTTP rodando...");
});
// Rota para listar as aeronaves
app.get("/listarAeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        // Estabelece a conexão com o banco de dados
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Executa a consulta SQL para obter todas as aeronaves
        let resultadoConsulta = yield connection.execute(`SELECT * FROM TB_Aeronaves`);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        // Verifica se há linhas na consulta e converte para o tipo Aeronaves
        if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
            cr.payload = (0, Conversores_1.rowsToAeronaves)(resultadoConsulta.rows);
        }
        else {
            // Se não houver linhas, define o payload como um array vazio
            cr.payload = [{}];
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            // Fecha a conexão com o banco de dados, se estiver aberta
            yield connection.close();
        }
        // Envia a resposta (CustomResponse) ao cliente
        res.send(cr);
    }
}));
// Rota para inserir uma nova aeronave
app.put("/inserirAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // Convertendo o corpo da requisição para um tipo Aeronaves
    const aero = req.body;
    // validação da aeronave
    let [valida, mensagem] = (0, Validadores_1.aeronaveValida)(aero);
    if (!valida) {
        // // Se não for válida, retornamos a resposta com o erro e encerramos o serviço.
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        // Se não, continuamos o processo porque passou na validação.
        let connection;
        try {
            // Comando SQL para inserir uma nova aeronave
            const cmdInsertAero = `INSERT INTO TB_Aeronaves 
      (ID_AERONAVE, MODELO, FABRICANTE, ANO_FABRICACAO, TOTAL_ASSENTOS)
      VALUES
      (SEQ_AERONAVES.NEXTVAL, :1, :2, :3, :4)`;
            // Dados a serem inseridos na tabela
            const dados = [
                aero.MODELO,
                aero.FABRICANTE,
                aero.ANO_FABRICACAO,
                aero.TOTAL_ASSENTOS,
            ];
            // Estabelece a conexão com o banco de dados
            connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
            // Comando de inserção
            let resInsert = yield connection.execute(cmdInsertAero, dados);
            // commit
            yield connection.commit();
            // Obtém a informação de quantas linhas foram inseridas
            const rowsInserted = resInsert.rowsAffected;
            if (rowsInserted !== undefined && rowsInserted === 1) {
                cr.status = "SUCCESS";
                cr.message = "Aeronave inserida.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.log(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao oracle. Sem detalhes";
            }
        }
        finally {
            // Fecha a conexão com o banco de dados
            if (connection !== undefined) {
                yield connection.close();
            }
            // Envia a resposta ao cliente
            res.send(cr);
        }
    }
}));
// Rota para excluir a aeronave com base no ID
app.delete("/excluirAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Obtém o ID_AERONAVE do corpo da requisição
    const ID_AERONAVE = req.body.ID_AERONAVE;
    console.log("ID_AERONAVE recebido: " + ID_AERONAVE);
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    try {
        // Estabelece a conexão com o banco de dados
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Comando SQL para excluir uma aeronave com base no ID
        const cmdDeleteAero = `DELETE TB_Aeronaves WHERE ID_AERONAVE = :1`;
        const dados = [ID_AERONAVE];
        // Executa o comando de exclusão
        let resDelete = yield connection.execute(cmdDeleteAero, dados);
        // Commit
        yield connection.commit();
        // Obtém a informação de quantas linhas foram excluídas
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeronave excluída.";
        }
        else {
            cr.message =
                "Aeronave não excluída. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // Fecha a conexão com o banco de dados Oracle, se estiver aberta
        if (connection !== undefined)
            yield connection.close();
        // Envia a resposta ao cliente
        res.send(cr);
    }
}));
// Rota que lida com a requisição de listar trechos do banco de dados
app.get("/listarTrechos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        // Estabelece a conexão com o banco de dados
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Executa a consulta SQL para obter todos os trechos
        let resultadoConsulta = yield connection.execute(`SELECT * FROM TB_TRECHOS`);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        // Converte as linhas do Oracle em objetos do tipo Trechos
        if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
            cr.payload = (0, Conversores_1.rowsToTrechos)(resultadoConsulta.rows);
        }
        else {
            // array vazio
            cr.payload = [{}];
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // Fecha a conexão com o banco de dados Oracle, se estiver aberta
        if (connection !== undefined) {
            yield connection.close();
        }
        // Envia a resposta ao cliente
        res.send(cr);
    }
}));
// Rota que lida com a requisição para inserir um novo trecho
app.put("/inserirTrecho", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // Convertendo o corpo da requisição para um tipo Trechos
    const trecho = req.body;
    let connection;
    try {
        // Constrói a consulta SQL de inserção
        const cmdInsertTre = `INSERT INTO TB_TRECHOS 
      (ID_TRECHO, FK_ID_ORIGEM, FK_ID_DESTINO)
      VALUES
      (:1, :2, :3)`;
        const dados = [trecho.ID_TRECHO, trecho.FK_ID_ORIGEM, trecho.FK_ID_DESTINO];
        // Estabelece a conexão com o banco de dados
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Executa a inserção no banco de dados
        let resInsert = yield connection.execute(cmdInsertTre, dados);
        // commit
        yield connection.commit();
        // Obtém a informação de quantas linhas foram inseridas
        const rowsInserted = resInsert.rowsAffected;
        if (rowsInserted !== undefined && rowsInserted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Trecho inserido.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // Fecha a conexão com o banco de dados Oracle, se estiver aberta
        if (connection !== undefined) {
            yield connection.close();
        }
        // Envia a resposta ao cliente
        res.send(cr);
    }
}));
// Rota que lida com a requisição de excluir trecho
app.delete("/excluirTrecho", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Excluindo o trecho pelo código dele
    const ID_TRECHO = req.body.ID_TRECHO;
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    try {
        // Estabelece a conexão com o banco de dados
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Constrói a consulta SQL de exclusão
        const cmdDeleteTre = `DELETE TB_TRECHOS WHERE ID_TRECHO = :1`;
        const dados = [ID_TRECHO];
        // Executa a exclusão no banco de dados
        let resDelete = yield connection.execute(cmdDeleteTre, dados);
        yield connection.commit();
        // Obtém a informação de quantas linhas foram excluídas
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Trecho excluído.";
        }
        else {
            cr.message =
                "Trecho não excluído. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // Fecha a conexão com o banco de dados
        if (connection !== undefined)
            yield connection.close();
        // Envia a resposta ao cliente
        res.send(cr);
    }
}));
// Rota que lida com a requisição de listar os voos
app.get("/listarVoos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        // Estabelece a conexão com o banco de dados Oracle
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Executa a consulta SQL para obter todos os voos
        let resultadoConsulta = yield connection.execute(`SELECT * FROM TB_Voo`);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        // Converte as linhas do Oracle em resultados do tipo 'Voos'
        if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
            cr.payload = (0, Conversores_1.rowsToVoos)(resultadoConsulta.rows);
        }
        else {
            // O array está vazio
            cr.payload = [{}];
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // Fecha a conexão com o banco de dados
        if (connection !== undefined) {
            yield connection.close();
        }
        // Envia a resposta ao cliente
        res.send(cr);
    }
}));
// Definição da rota para inserção de um novo voo
app.put("/inserirVoo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // Convertendo o corpo da requisição para um tipo Voos
    const voo = req.body;
    let connection;
    try {
        // Comando SQL para inserir um novo voo na tabela TB_VOO
        const cmdInsertAero = `INSERT INTO TB_VOO 
    (ID_VOO, HORA_DATA_SAIDA_IDA, HORA_DATA_SAIDA_VOLTA, HORA_DATA_CHEGADA_IDA, HORA_DATA_CHEGADA_VOLTA, TIPO, PRECO, FK_ID_AERONAVE, FK_ID_TRECHO)
    VALUES
    (:1, TO_DATE(:2, 'YYYY-MM-DD HH24:MI:SS'), TO_DATE(:3, 'YYYY-MM-DD HH24:MI:SS'), TO_DATE(:4, 'YYYY-MM-DD HH24:MI:SS'), TO_DATE(:5, 'YYYY-MM-DD HH24:MI:SS'), :6, :7, :8, :9)`;
        // Array de dados a serem inseridos, correspondendo aos parâmetros do comando SQL
        const dados = [
            voo.ID_VOO,
            voo.HORA_DATA_SAIDA_IDA,
            voo.HORA_DATA_SAIDA_VOLTA,
            voo.HORA_DATA_CHEGADA_IDA,
            voo.HORA_DATA_CHEGADA_VOLTA,
            voo.TIPO,
            voo.PRECO,
            voo.FK_ID_AERONAVE,
            voo.FK_ID_TRECHO,
        ];
        // Conexão com o banco de dados Oracle
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Execução do comando SQL para inserir o novo voo
        let resInsert = yield connection.execute(cmdInsertAero, dados);
        // Commit
        yield connection.commit();
        // Verificação do número de linhas afetadas pela inserção
        const rowsInserted = resInsert.rowsAffected;
        if (rowsInserted !== undefined && rowsInserted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Voo inserido.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // Fecha a conexão com o banco de dados
        if (connection !== undefined) {
            yield connection.close();
        }
        // Envia a resposta ao cliente
        res.send(cr);
    }
}));
// Definição da rota para exclusão de um voo
app.delete("/excluirVoo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // excluindo o pelo id dele
    const ID_VOO = req.body.ID_VOO;
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    try {
        // Conexão com o banco de dados
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Comando SQL para excluir um voo na tabela TB_VOO
        const cmdDeleteVoo = `DELETE TB_VOO WHERE ID_VOO = :1`;
        const dados = [ID_VOO];
        // Execução do comando SQL para excluir o voo
        let resDelete = yield connection.execute(cmdDeleteVoo, dados);
        // Commit
        yield connection.commit();
        // Verificação do número de linhas afetadas pela exclusão
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Trecho excluído.";
        }
        else {
            cr.message =
                "Voo não excluído. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // Fechamento da conexão com o banco de dados
        if (connection !== undefined)
            yield connection.close();
        // Enviando a resposta para o cliente
        res.send(cr);
    }
}));
// Rota para realizar a atualização de informações de um voo
app.put("/alterarVoos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    const voo = req.body;
    try {
        // Construção da consulta SQL para atualização das informações do voo
        const query = `UPDATE TB_TRECHOS 
                   SET HORA_DATA_CHEGADA_IDA = :1, 
                   HORA_DATA_SAIDA_IDA = :2,
                   HORA_DATA_CHEGADA_VOLTA = :3,
                   HORA_DATA_SAIDA_VOLTA = :4,
                   TIPO = :5,
                   FK_ID_TRECHO = :6,
                   FK_ID_AERONAVE = :7,
                   PRECO = :8
                   WHERE ID_VOO = :9`;
        const dados = [
            voo.HORA_DATA_CHEGADA_IDA,
            voo.HORA_DATA_SAIDA_IDA,
            voo.HORA_DATA_CHEGADA_VOLTA,
            voo.HORA_DATA_SAIDA_VOLTA,
            voo.TIPO,
            voo.FK_ID_TRECHO,
            voo.FK_ID_AERONAVE,
            voo.PRECO,
            voo.ID_VOO,
        ];
        // Conexão com o banco de dados
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Execução da consulta SQL para atualização das informações do voo
        let resInsert = yield connection.execute(query, dados);
        // Commit
        yield connection.commit();
        // Verificação do número de linhas afetadas pela atualização
        const rowsInserted = resInsert.rowsAffected;
        if (rowsInserted !== undefined && rowsInserted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Trecho alterado.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // Fechando a conexão com o banco de dados
        if (connection !== undefined) {
            yield connection.close();
        }
        // Enviando a resposta ao cliente
        res.send(cr);
    }
}));
// Rota para obter a lista de aeroportos
app.get("/listarAeroportos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        // Estabelecimento da conexão com o banco de dados
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Execução da consulta SQL para obter a lista de aeroportos
        let resultadoConsulta = yield connection.execute(`SELECT * FROM TB_AEROPORTOS`);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        // Conversão das linhas do Oracle em objetos do tipo Aeroportos
        if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
            cr.payload = (0, Conversores_1.rowsToAeroportos)(resultadoConsulta.rows);
        }
        else {
            // Array vazio
            cr.payload = [{}];
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // Fechamento da conexão com o banco de dados Oracle, se estiver aberta
        if (connection !== undefined) {
            yield connection.close();
        }
        // Envio da resposta ao cliente
        res.send(cr);
    }
}));
// Rota para inserir um novo aeroporto
app.put("/inserirAeroporto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // Conversão do corpo da requisição para o tipo Aeroportos
    const aeroporto = req.body;
    let connection;
    try {
        // Comando SQL para inserir um novo aeroporto na tabela TB_AEROPORTOS
        const cmdInsertAeroporto = `INSERT INTO TB_AEROPORTOS 
      (ID_AEROPORTO, SIGLA, NOME, CIDADE, PAIS)
      VALUES
      (SEQ_AEROPORTOS.NEXTVAL, :1, :2, :3, :4)`;
        // Dados a serem inseridos no novo aeroporto
        const dados = [
            aeroporto.SIGLA,
            aeroporto.NOME,
            aeroporto.CIDADE,
            aeroporto.PAIS,
        ];
        // Conexão com o banco de dados Oracle
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Execução do comando SQL de inserção
        let resInsert = yield connection.execute(cmdInsertAeroporto, dados);
        // Commit
        yield connection.commit();
        // Obtem informação sobre quantas linhas foram inseridas
        const rowsInserted = resInsert.rowsAffected;
        if (rowsInserted !== undefined && rowsInserted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeroporto inserido.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // Fechamento da conexão com o banco de dados
        if (connection !== undefined) {
            yield connection.close();
        }
        // Envio da resposta ao cliente
        res.send(cr);
    }
}));
// Rota para excluir um aeroporto pelo nome
app.delete("/excluirAeroporto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Obtenção do nome do aeroporto a ser excluído a partir do corpo da requisição
    const NOME = req.body.NOME;
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // Inicialização da conexão com o banco de dados
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Comando SQL para excluir um aeroporto
        const cmdDeleteAero = `DELETE TB_AEROPORTOS WHERE NOME = :1`;
        const dados = [NOME];
        // Execução do comando SQL de exclusão
        let resDelete = yield connection.execute(cmdDeleteAero, dados);
        // Commit
        yield connection.commit();
        // Obtenção da informação sobre quantas linhas foram excluídas
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeroporto excluído.";
        }
        else {
            cr.message =
                "Aeroporto não excluído. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // Fechamento da conexão com o banco de dados
        if (connection !== undefined)
            yield connection.close();
        // Envio da resposta ao cliente
        res.send(cr);
    }
}));
// Rota para listar os trechos de uma viagem com base nas cidades de origem e destino
app.post("/listarTrechosViagem", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    // Inicialização da conexão com o banco de dados
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Obtenção das cidades de origem e destino a partir do corpo da requisição
        const ORIGEM = req.body.ORIGEM;
        const DESTINO = req.body.DESTINO;
        // Consulta SQL para obter o ID do aeroporto de origem
        let resultadoConsultaOrigem = yield connection.execute(`SELECT ID_AEROPORTO FROM TB_AEROPORTOS WHERE CIDADE = '${ORIGEM}'`);
        // Consulta SQL para obter o ID do aeroporto de destino
        let resultadoConsultaDestino = yield connection.execute(`SELECT ID_AEROPORTO FROM TB_AEROPORTOS WHERE CIDADE = '${DESTINO}'`);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        if (resultadoConsultaOrigem.rows &&
            resultadoConsultaOrigem.rows.length > 0) {
            // Atribuição do ID do aeroporto de origem e destino ao payload
            cr.payload = [
                resultadoConsultaOrigem.rows[0],
                resultadoConsultaDestino.rows[0],
            ];
            try {
                // Consulta SQL para obter o ID do trecho com base nos aeroportos de origem e destino
                let resultadoConsultaTrecho = yield connection.execute(`SELECT ID_TRECHO FROM TB_TRECHOS WHERE FK_ID_ORIGEM = '${cr.payload[0][0]}' AND FK_ID_DESTINO = '${cr.payload[1][0]}'`);
                // Transforma resultadoConsultaTrecho.rows em um array simples
                const trechosSimples = resultadoConsultaTrecho.rows.map((row) => row[0]);
                // Atribui os IDs dos trechos ao payload
                cr.payload = trechosSimples;
            }
            catch (error) { }
        }
        else {
            // Array vazio
            cr.payload = [{}];
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // Fechamento da conexão com o banco de dados
        if (connection !== undefined) {
            yield connection.close();
        }
        // Envio da resposta ao cliente
        res.send(cr);
    }
}));
// Rota para listar informações completas de viagens com base em uma lista de IDs de trechos
app.post("/listarViagens", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        // Estabelecimento da conexão com o banco de dados
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Obtenção da lista de IDs de trechos a partir do corpo da requisição
        const listaDeTrecho = req.body;
        // Inicialização de um array para armazenar os resultados completos das consultas
        const resultadosCompletos = [];
        // Loop sobre cada ID de trecho na lista
        for (const idTrecho of listaDeTrecho) {
            try {
                // Consulta SQL para obter informações do voo e dos aeroportos associados ao trecho
                let resultadoConsultaTrecho = yield connection.execute(`SELECT V.*, A_ORIGEM.*, A_DESTINO.* 
          FROM TB_VOO V
          JOIN TB_TRECHOS T ON V.FK_ID_TRECHO = T.ID_TRECHO
          JOIN TB_AEROPORTOS A_ORIGEM ON T.FK_ID_ORIGEM = A_ORIGEM.ID_AEROPORTO
          JOIN TB_AEROPORTOS A_DESTINO ON T.FK_ID_DESTINO = A_DESTINO.ID_AEROPORTO
          WHERE V.FK_ID_TRECHO = ${idTrecho}`);
                // Verifica se a consulta retornou resultados
                if (resultadoConsultaTrecho.rows &&
                    resultadoConsultaTrecho.rows.length > 0) {
                    // Adiciona o resultado ao array
                    resultadosCompletos.push(resultadoConsultaTrecho.rows[0]);
                }
            }
            catch (error) {
                console.error(`Erro ao consultar trecho ${idTrecho}:`, error.message);
            }
        }
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        cr.payload = resultadosCompletos;
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        // Fechamento da conexão com o banco de dados
        if (connection !== undefined) {
            yield connection.close();
        }
        // Envio da resposta ao cliente
        res.send(cr);
    }
}));
// Rota para obter o total de assentos disponíveis em uma aeronave com base no ID da aeronave
app.post("/totalAssentos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        // Estabelecimento da conexão com o banco de dados
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Obtenção do ID da aeronave a partir do corpo da requisição
        const vooData = req.body.vooData;
        // Execução da consulta SQL para obter o total de assentos da aeronave
        let resultadoConsulta = yield connection.execute(`SELECT TOTAL_ASSENTOS FROM TB_AERONAVES WHERE ID_AERONAVE = :1`, [vooData[7]]);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        // Verifica se a consulta retornou resultados
        if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
            // Atribui o total de assentos ao payload da resposta
            cr.payload = resultadoConsulta.rows[0][0];
        }
        else {
            // Array vazio
            cr.payload = undefined;
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        // Fechamento da conexão com o banco de dados
        if (connection !== undefined) {
            yield connection.close();
        }
        // Envio da resposta ao cliente
        res.send(cr);
    }
}));
// Rota para obter a lista de assentos associados a uma aeronave com base no ID da aeronave
app.post("/listarAssentos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    // Obtenção do ID da aeronave
    const ID = req.body.FK_ID_AERONAVE;
    try {
        // Estabelecimento da conexão com o banco de dados
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Execução da consulta SQL para obter a lista de assentos associados à aeronave
        let resultadoConsulta = yield connection.execute(`SELECT *
      FROM TB_Assento
      WHERE fk_id_aeronave = :id`, [ID]);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        // Verificar se há resultados para a consulta
        if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
            // Transformar os resultados em um formato mais adequado
            cr.payload = (0, Conversores_1.rowsToAssentos)(resultadoConsulta.rows);
        }
        else {
            // Configurar payload para um array vazio se não houver resultados
            cr.payload = [];
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        // Fechar a conexão com o banco de dados
        if (connection !== undefined) {
            yield connection.close();
        }
        // Enviar a resposta ao cliente
        res.send(cr);
    }
}));
// Rota para gerar e atribuir uma referência a um assento com base no ID do assento
app.post("/gerarReferencia", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    // Inicialização da conexão com o banco de dados
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Obtenção do ID e da nova referência do assento a partir do corpo da requisição
        const ID_ASSENTO = req.body.ID;
        const REFERENCIA_ASSENTO = req.body.REFERENCIA;
        console.log(ID_ASSENTO);
        // Execução da atualização do banco de dados para atribuir a nova referência ao assento
        let resultadoAtualizacao = yield connection.execute(`UPDATE TB_ASSENTO SET REFERENCIA = :1 WHERE ID_ASSENTO = :2`, [REFERENCIA_ASSENTO, ID_ASSENTO]);
        yield connection.commit();
        console.log(resultadoAtualizacao.rows);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        // Verificação se há resultados para a consulta
        if (resultadoAtualizacao.rows && resultadoAtualizacao.rows.length > 0) {
            // Atribuição dos resultados ao payload da resposta
            cr.payload = resultadoAtualizacao.rows;
        }
        else {
            // Array vazio
            cr.payload = undefined;
        }
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e);
            cr.message = e.message;
        }
        else {
            console.error(e);
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        // Fechamento da conexão com o banco de dados
        if (connection !== undefined) {
            yield connection.close();
        }
        // Envio da resposta ao cliente
        res.send(cr);
        console.log(cr);
    }
}));
// Rota para obter os IDs dos assentos associados a uma aeronave específica
app.post("/obterIDs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Obtenção do ID da aeronave a partir do corpo da requisição
        const ID_AERONAVE = req.body.ID;
        // Execução da consulta no banco de dados para obter os IDs dos assentos associados à aeronave
        let resultadoAtualizacao = yield connection.execute(`SELECT ID_ASSENTO FROM TB_ASSENTO WHERE FK_ID_AERONAVE = :1`, [ID_AERONAVE]);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        // Verificação se há resultados para a consulta
        if (resultadoAtualizacao.rows && resultadoAtualizacao.rows.length > 0) {
            cr.payload = resultadoAtualizacao.rows.flat();
        }
        else {
            // O array está vazio
            cr.payload = undefined;
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        // Fechamento da conexão com o banco de dados
        if (connection !== undefined) {
            yield connection.close();
        }
        // Envio da resposta ao cliente
        res.send(cr);
    }
}));
