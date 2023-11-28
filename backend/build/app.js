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
const OracleConnAtribs_1 = require("./OracleConnAtribs");
const Conversores_1 = require("./Conversores");
const Validadores_1 = require("./Validadores");
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
app.get("/", (req, res) => {
    res.send("Bem-vindo à minha aplicação!");
});
app.listen(port, () => {
    console.log("Servidor HTTP rodando...");
});
// servicos de backend
app.get("/listarAeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
        // não mais um array dentro de array.
        let resultadoConsulta = yield connection.execute(`SELECT * FROM TB_Aeronaves`);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
        if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
            cr.payload = (0, Conversores_1.rowsToAeronaves)(resultadoConsulta.rows);
        }
        else {
            // o array está vazio
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
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.put("/inserirAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que
    // chega na requisição para um tipo nosso!
    const aero = req.body;
    // antes de prosseguir, vamos validar a aeronave!
    // se não for válida já descartamos.
    let [valida, mensagem] = (0, Validadores_1.aeronaveValida)(aero);
    if (!valida) {
        // já devolvemos a resposta com o erro e terminamos o serviço.
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        // continuamos o processo porque passou na validação.
        let connection;
        try {
            const cmdInsertAero = `INSERT INTO TB_Aeronaves 
      (ID_AERONAVE, MODELO, FABRICANTE, ANO_FABRICACAO, COMPANHIA, TOTAL_ASSENTOS)
      VALUES
      (SEQ_AERONAVES.NEXTVAL, :1, :2, :3, :4, :5)`;
            const dados = [
                aero.MODELO,
                aero.FABRICANTE,
                aero.ANO_FABRICACAO,
                aero.COMPANHIA,
                aero.TOTAL_ASSENTOS,
            ];
            connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
            let resInsert = yield connection.execute(cmdInsertAero, dados);
            // importante: efetuar o commit para gravar no Oracle.
            yield connection.commit();
            // obter a informação de quantas linhas foram inseridas.
            // neste caso precisa ser exatamente 1
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
            //fechar a conexao.
            if (connection !== undefined) {
                yield connection.close();
            }
            res.send(cr);
        }
    }
}));
app.delete("/excluirAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // excluindo a aeronave pelo código dela:
    const ID_AERONAVE = req.body.ID_AERONAVE;
    console.log("ID_AERONAVE recebido: " + ID_AERONAVE);
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // conectando
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const cmdDeleteAero = `DELETE TB_Aeronaves WHERE ID_AERONAVE = :1`;
        const dados = [ID_AERONAVE];
        let resDelete = yield connection.execute(cmdDeleteAero, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas.
        // neste caso precisa ser exatamente 1
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
        // fechando a conexao
        if (connection !== undefined)
            yield connection.close();
        // devolvendo a resposta da requisição.
        res.send(cr);
    }
}));
app.put("/alterarAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    const aero = req.body;
    try {
        // Construa sua consulta SQL de atualização com valores posicionais
        const query = `UPDATE TB_AERONAVES 
                   SET MODELO = :1, 
                       FABRICANTE = :2, 
                       ANO_FABRICACAO = :3, 
                       QTDE_ASSENTOS = :4
                   WHERE ID_AERONAVE = :5`;
        const dados = [
            aero.MODELO,
            aero.FABRICANTE,
            aero.ANO_FABRICACAO,
            aero.TOTAL_ASSENTOS,
            aero.ID_AERONAVE,
        ];
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        let resInsert = yield connection.execute(query, dados);
        yield connection.commit();
        const rowsInserted = resInsert.rowsAffected;
        if (rowsInserted !== undefined && rowsInserted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeronave alterada.";
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
        //fechar a conexao.
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.get("/listarTrechos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
        // não mais um array dentro de array.
        let resultadoConsulta = yield connection.execute(`SELECT * FROM TB_TRECHOS`);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
        if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
            cr.payload = (0, Conversores_1.rowsToTrechos)(resultadoConsulta.rows);
        }
        else {
            // o array está vazio
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
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.put("/inserirTrecho", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que
    // chega na requisição para um tipo nosso!
    const trecho = req.body;
    // continuamos o processo porque passou na validação.
    let connection;
    try {
        const cmdInsertTre = `INSERT INTO TB_TRECHOS 
      (ID_TRECHO, FK_ID_ORIGEM, FK_ID_DESTINO)
      VALUES
      (:1, :2, :3)`;
        const dados = [trecho.ID_TRECHO, trecho.FK_ID_ORIGEM, trecho.FK_ID_DESTINO];
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        let resInsert = yield connection.execute(cmdInsertTre, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas.
        // neste caso precisa ser exatamente 1
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
        //fechar a conexao.
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.delete("/excluirTrecho", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // excluindo a aeronave pelo código dela:
    const ID_TRECHO = req.body.ID_TRECHO;
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // conectando
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const cmdDeleteTre = `DELETE TB_TRECHOS WHERE ID_TRECHO = :1`;
        const dados = [ID_TRECHO];
        let resDelete = yield connection.execute(cmdDeleteTre, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas.
        // neste caso precisa ser exatamente 1
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
        // fechando a conexao
        if (connection !== undefined)
            yield connection.close();
        // devolvendo a resposta da requisição.
        res.send(cr);
    }
}));
app.put("/alterarTrecho", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    const trecho = req.body;
    try {
        // Construa sua consulta SQL de atualização com valores posicionais
        const query = `UPDATE TB_TRECHOS 
                   SET FK_ID_ORIGEM = :1, 
                       FK_ID_DESTINO = :2
                   WHERE ID_TRECHO = :3`;
        const dados = [trecho.FK_ID_ORIGEM, trecho.FK_ID_DESTINO, trecho.ID_TRECHO];
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        let resInsert = yield connection.execute(query, dados);
        yield connection.commit();
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
        //fechar a conexao.
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.get("/listarVoos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
        // não mais um array dentro de array.
        let resultadoConsulta = yield connection.execute(`SELECT * FROM TB_Voo`);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
        if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
            cr.payload = (0, Conversores_1.rowsToVoos)(resultadoConsulta.rows);
        }
        else {
            // o array está vazio
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
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.put("/inserirVoo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que
    // chega na requisição para um tipo nosso!
    const voo = req.body;
    let connection;
    try {
        const cmdInsertAero = `INSERT INTO TB_VOO 
    (ID_VOO, HORA_DATA_SAIDA_IDA, HORA_DATA_SAIDA_VOLTA, HORA_DATA_CHEGADA_IDA, HORA_DATA_CHEGADA_VOLTA, TIPO, PRECO, FK_ID_AERONAVE, FK_ID_TRECHO)
    VALUES
    (:1, TO_DATE(:2, 'YYYY-MM-DD HH24:MI:SS'), TO_DATE(:3, 'YYYY-MM-DD HH24:MI:SS'), TO_DATE(:4, 'YYYY-MM-DD HH24:MI:SS'), TO_DATE(:5, 'YYYY-MM-DD HH24:MI:SS'), :6, :7, :8, :9)`;
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
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        let resInsert = yield connection.execute(cmdInsertAero, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas.
        // neste caso precisa ser exatamente 1
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
        //fechar a conexao.
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.delete("/excluirVoo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // excluindo a aeronave pelo código dela:
    const ID_VOO = req.body.ID_VOO;
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // conectando
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const cmdDeleteVoo = `DELETE TB_VOO WHERE ID_VOO = :1`;
        const dados = [ID_VOO];
        let resDelete = yield connection.execute(cmdDeleteVoo, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas.
        // neste caso precisa ser exatamente 1
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
        // fechando a conexao
        if (connection !== undefined)
            yield connection.close();
        // devolvendo a resposta da requisição.
        res.send(cr);
    }
}));
app.put("/alterarVoos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    const voo = req.body;
    try {
        // Construa sua consulta SQL de atualização com valores posicionais
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
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        let resInsert = yield connection.execute(query, dados);
        yield connection.commit();
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
        //fechar a conexao.
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.get("/listarAeroportos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
        // não mais um array dentro de array.
        let resultadoConsulta = yield connection.execute(`SELECT * FROM TB_AEROPORTOS`);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
        if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
            cr.payload = (0, Conversores_1.rowsToAeroportos)(resultadoConsulta.rows);
        }
        else {
            // o array está vazio
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
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.put("/inserirAeroporto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que
    // chega na requisição para um tipo nosso!
    const aeroporto = req.body;
    // continuamos o processo porque passou na validação.
    let connection;
    try {
        const cmdInsertAeroporto = `INSERT INTO TB_AEROPORTOS 
      (ID_AEROPORTO, SIGLA, NOME, CIDADE, PAIS)
      VALUES
      (SEQ_AEROPORTOS.NEXTVAL, :1, :2, :3, :4)`;
        const dados = [
            aeroporto.SIGLA,
            aeroporto.NOME,
            aeroporto.CIDADE,
            aeroporto.PAIS,
        ];
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        let resInsert = yield connection.execute(cmdInsertAeroporto, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas.
        // neste caso precisa ser exatamente 1
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
        //fechar a conexao.
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.delete("/excluirAeroporto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // excluindo a aeronave pelo código dela:
    const NOME = req.body.NOME;
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // conectando
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const cmdDeleteAero = `DELETE TB_AEROPORTOS WHERE NOME = :1`;
        const dados = [NOME];
        let resDelete = yield connection.execute(cmdDeleteAero, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas.
        // neste caso precisa ser exatamente 1
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
        // fechando a conexao
        if (connection !== undefined)
            yield connection.close();
        // devolvendo a resposta da requisição.
        res.send(cr);
    }
}));
app.put("/alterarAeroporto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    const aeroporto = req.body;
    try {
        // Construa sua consulta SQL de atualização com valores posicionais
        const query = `UPDATE TB_AEROPORTOS 
                   SET CIDADE = :1, 
                   PAIS = :2, 
                       SIGLA = :3
                       WHERE NOME = :4`;
        const dados = [
            aeroporto.CIDADE,
            aeroporto.PAIS,
            aeroporto.SIGLA,
            aeroporto.NOME,
        ];
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        let resInsert = yield connection.execute(query, dados);
        yield connection.commit();
        const rowsInserted = resInsert.rowsAffected;
        if (rowsInserted !== undefined && rowsInserted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeroporto alterado.";
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
        //fechar a conexao.
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.post("/listarTrechosViagem", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const ORIGEM = req.body.ORIGEM;
        const DESTINO = req.body.DESTINO;
        // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
        // não mais um array dentro de array.
        let resultadoConsultaOrigem = yield connection.execute(`SELECT ID_AEROPORTO FROM TB_AEROPORTOS WHERE CIDADE = '${ORIGEM}'`);
        let resultadoConsultaDestino = yield connection.execute(`SELECT ID_AEROPORTO FROM TB_AEROPORTOS WHERE CIDADE = '${DESTINO}'`);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        if (resultadoConsultaOrigem.rows &&
            resultadoConsultaOrigem.rows.length > 0) {
            cr.payload = [
                resultadoConsultaOrigem.rows[0],
                resultadoConsultaDestino.rows[0],
            ];
            try {
                let resultadoConsultaTrecho = yield connection.execute(`SELECT ID_TRECHO FROM TB_TRECHOS WHERE FK_ID_ORIGEM = '${cr.payload[0][0]}' AND FK_ID_DESTINO = '${cr.payload[1][0]}'`);
                // Transforma resultadoConsultaTrecho.rows em um array simples
                const trechosSimples = resultadoConsultaTrecho.rows.map((row) => row[0]);
                // Atribui ao cr.payload
                cr.payload = trechosSimples;
            }
            catch (error) { }
        }
        else {
            // o array está vazio
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
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.post("/listarViagens", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const listaDeTrecho = req.body;
        const resultadosCompletos = [];
        for (const idTrecho of listaDeTrecho) {
            try {
                // Consulta para obter informações do voo e do aeroporto associado ao trecho
                let resultadoConsultaTrecho = yield connection.execute(`SELECT V.*, A_ORIGEM.*, A_DESTINO.* 
          FROM TB_VOO V
          JOIN TB_TRECHOS T ON V.FK_ID_TRECHO = T.ID_TRECHO
          JOIN TB_AEROPORTOS A_ORIGEM ON T.FK_ID_ORIGEM = A_ORIGEM.ID_AEROPORTO
          JOIN TB_AEROPORTOS A_DESTINO ON T.FK_ID_DESTINO = A_DESTINO.ID_AEROPORTO
          WHERE V.FK_ID_TRECHO = ${idTrecho}`);
                if (resultadoConsultaTrecho.rows &&
                    resultadoConsultaTrecho.rows.length > 0) {
                    // Adiciona o resultado ao array
                    resultadosCompletos.push(resultadoConsultaTrecho.rows[0]);
                }
            }
            catch (error) {
                console.error(`Erro ao consultar trecho ${idTrecho}:`, error.message);
                // Se desejar, você pode lidar com erros aqui
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
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.post("/totalAssentos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const vooData = req.body.vooData;
        let resultadoConsulta = yield connection.execute(`SELECT TOTAL_ASSENTOS FROM TB_AERONAVES WHERE ID_AERONAVE = :1`, [vooData[7]]);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
            cr.payload = resultadoConsulta.rows[0][0];
        }
        else {
            // o array está vazio
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
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
// Rota para listar todos os trechos de viagem
app.post("/listarAssentos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Objeto para armazenar a resposta personalizada
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    const ID = req.body.FK_ID_AERONAVE;
    try {
        // Conectar ao banco de dados Oracle
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Consultar todos os assentos na tabela TB_Assento com base no ID da aeronave
        let resultadoConsulta = yield connection.execute(`SELECT *
      FROM TB_Assento
      WHERE fk_id_aeronave = :id`, [ID]);
        // Configurar resposta de sucesso
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        // Verificar se há resultados para a consulta
        if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
            // Transformar os resultados em um formato mais adequado, se houver resultados
            cr.payload = (0, Conversores_1.rowsToAssentos)(resultadoConsulta.rows);
        }
        else {
            // Configurar payload para um array vazio se não houver resultados
            cr.payload = [];
        }
    }
    catch (e) {
        // Tratar erros na conexão ao banco de dados Oracle
        if (e instanceof Error) {
            cr.message = e.message;
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        // Fechar a conexão com o banco de dados, se estiver aberta
        if (connection !== undefined) {
            yield connection.close();
        }
        // Enviar a resposta ao cliente
        res.send(cr);
    }
}));
app.post("/gerarReferencia", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const ID_ASSENTO = req.body.ID;
        const REFERENCIA_ASSENTO = req.body.REFERENCIA;
        console.log(ID_ASSENTO);
        // console.log(REFERENCIA_ASSENTO);
        let resultadoAtualizacao = yield connection.execute(`UPDATE TB_ASSENTO SET REFERENCIA = :1 WHERE ID_ASSENTO = :2`, [REFERENCIA_ASSENTO, ID_ASSENTO]);
        // Realiza o commit para efetivar as alterações
        yield connection.commit();
        console.log(resultadoAtualizacao.rows);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        if (resultadoAtualizacao.rows && resultadoAtualizacao.rows.length > 0) {
            cr.payload = resultadoAtualizacao.rows;
        }
        else {
            // o array está vazio
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
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
        console.log(cr);
    }
}));
app.post("/obterIDs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        connection = yield ora.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const ID_AERONAVE = req.body.ID;
        let resultadoAtualizacao = yield connection.execute(`SELECT ID_ASSENTO FROM TB_ASSENTO WHERE FK_ID_AERONAVE = :1`, [ID_AERONAVE]);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        if (resultadoAtualizacao.rows && resultadoAtualizacao.rows.length > 0) {
            // Utilize flat() para converter o array de arrays em um array plano
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
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
