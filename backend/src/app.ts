import express, { Request, Response } from "express";

import { Aeronaves } from "./types/Aeronaves";
import { Voos } from "./types/Voos";
import { Trechos } from "./types/Trechos";
import { Aeroportos } from "./types/Aeroportos";

import { oraConnAttribs } from "./OracleConnAtribs";
import { CustomResponse } from "./CustomResponse";
import {
  rowsToAeronaves,
  rowsToAeroportos,
  rowsToAssentos,
  rowsToTrechos,
  rowsToVoos,
} from "./Conversores";
import { aeronaveValida } from "./Validadores";

const ora = require("oracledb");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Bem-vindo à minha aplicação!");
});

app.listen(port, () => {
  console.log("Servidor HTTP rodando...");
});

// servicos de backend
app.get("/listarAeronaves", async (req: Request, res: Response) => {
  let cr: CustomResponse = { status: "ERROR", message: "", payload: undefined };
  let connection;
  try {
    connection = await ora.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    let resultadoConsulta = await connection.execute(
      `SELECT * FROM TB_Aeronaves`
    );

    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
    if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
      cr.payload = rowsToAeronaves(resultadoConsulta.rows);
    } else {
      // o array está vazio
      cr.payload = [{}];
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

app.put("/inserirAeronave", async (req: Request, res: Response) => {
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // UAU! Agora com um tipo definido podemos simplesmente converter tudo que
  // chega na requisição para um tipo nosso!
  const aero: Aeronaves = req.body as Aeronaves;

  // antes de prosseguir, vamos validar a aeronave!
  // se não for válida já descartamos.
  let [valida, mensagem] = aeronaveValida(aero);
  if (!valida) {
    // já devolvemos a resposta com o erro e terminamos o serviço.
    cr.message = mensagem;
    res.send(cr);
  } else {
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

      connection = await ora.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(cmdInsertAero, dados);

      // importante: efetuar o commit para gravar no Oracle.
      await connection.commit();

      // obter a informação de quantas linhas foram inseridas.
      // neste caso precisa ser exatamente 1
      const rowsInserted = resInsert.rowsAffected;
      if (rowsInserted !== undefined && rowsInserted === 1) {
        cr.status = "SUCCESS";
        cr.message = "Aeronave inserida.";
      }
    } catch (e) {
      if (e instanceof Error) {
        cr.message = e.message;
        console.log(e.message);
      } else {
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      //fechar a conexao.
      if (connection !== undefined) {
        await connection.close();
      }
      res.send(cr);
    }
  }
});

app.delete("/excluirAeronave", async (req: Request, res: Response) => {
  // excluindo a aeronave pelo código dela:
  const ID_AERONAVE = req.body.ID_AERONAVE as number;

  console.log("ID_AERONAVE recebido: " + ID_AERONAVE);

  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // conectando
  let connection;
  try {
    connection = await ora.getConnection(oraConnAttribs);
    const cmdDeleteAero = `DELETE TB_Aeronaves WHERE ID_AERONAVE = :1`;
    const dados = [ID_AERONAVE];

    let resDelete = await connection.execute(cmdDeleteAero, dados);

    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();

    // obter a informação de quantas linhas foram inseridas.
    // neste caso precisa ser exatamente 1
    const rowsDeleted = resDelete.rowsAffected;
    if (rowsDeleted !== undefined && rowsDeleted === 1) {
      cr.status = "SUCCESS";
      cr.message = "Aeronave excluída.";
    } else {
      cr.message =
        "Aeronave não excluída. Verifique se o código informado está correto.";
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    // fechando a conexao
    if (connection !== undefined) await connection.close();

    // devolvendo a resposta da requisição.
    res.send(cr);
  }
});

app.put("/alterarAeronave", async (req: Request, res: Response) => {
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  let connection;

  const aero: Aeronaves = req.body as Aeronaves;

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

    connection = await ora.getConnection(oraConnAttribs);
    let resInsert = await connection.execute(query, dados);

    await connection.commit();

    const rowsInserted = resInsert.rowsAffected;
    if (rowsInserted !== undefined && rowsInserted === 1) {
      cr.status = "SUCCESS";
      cr.message = "Aeronave alterada.";
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    //fechar a conexao.
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

app.get("/listarTrechos", async (req: Request, res: Response) => {
  let cr: CustomResponse = { status: "ERROR", message: "", payload: undefined };
  let connection;
  try {
    connection = await ora.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    let resultadoConsulta = await connection.execute(
      `SELECT * FROM TB_TRECHOS`
    );

    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
    if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
      cr.payload = rowsToTrechos(resultadoConsulta.rows);
    } else {
      // o array está vazio
      cr.payload = [{}];
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

app.put("/inserirTrecho", async (req: Request, res: Response) => {
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // UAU! Agora com um tipo definido podemos simplesmente converter tudo que
  // chega na requisição para um tipo nosso!
  const trecho: Trechos = req.body as Trechos;

  // continuamos o processo porque passou na validação.
  let connection;
  try {
    const cmdInsertTre = `INSERT INTO TB_TRECHOS 
      (ID_TRECHO, FK_ID_ORIGEM, FK_ID_DESTINO)
      VALUES
      (:1, :2, :3)`;
    const dados = [trecho.ID_TRECHO, trecho.FK_ID_ORIGEM, trecho.FK_ID_DESTINO];

    connection = await ora.getConnection(oraConnAttribs);
    let resInsert = await connection.execute(cmdInsertTre, dados);

    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();

    // obter a informação de quantas linhas foram inseridas.
    // neste caso precisa ser exatamente 1
    const rowsInserted = resInsert.rowsAffected;
    if (rowsInserted !== undefined && rowsInserted === 1) {
      cr.status = "SUCCESS";
      cr.message = "Trecho inserido.";
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    //fechar a conexao.
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

app.delete("/excluirTrecho", async (req: Request, res: Response) => {
  // excluindo a aeronave pelo código dela:
  const ID_TRECHO = req.body.ID_TRECHO as number;

  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // conectando
  let connection;
  try {
    connection = await ora.getConnection(oraConnAttribs);
    const cmdDeleteTre = `DELETE TB_TRECHOS WHERE ID_TRECHO = :1`;
    const dados = [ID_TRECHO];

    let resDelete = await connection.execute(cmdDeleteTre, dados);

    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();

    // obter a informação de quantas linhas foram inseridas.
    // neste caso precisa ser exatamente 1
    const rowsDeleted = resDelete.rowsAffected;
    if (rowsDeleted !== undefined && rowsDeleted === 1) {
      cr.status = "SUCCESS";
      cr.message = "Trecho excluído.";
    } else {
      cr.message =
        "Trecho não excluído. Verifique se o código informado está correto.";
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    // fechando a conexao
    if (connection !== undefined) await connection.close();

    // devolvendo a resposta da requisição.
    res.send(cr);
  }
});

app.put("/alterarTrecho", async (req: Request, res: Response) => {
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  let connection;

  const trecho: Trechos = req.body as Trechos;

  try {
    // Construa sua consulta SQL de atualização com valores posicionais
    const query = `UPDATE TB_TRECHOS 
                   SET FK_ID_ORIGEM = :1, 
                       FK_ID_DESTINO = :2
                   WHERE ID_TRECHO = :3`;
    const dados = [trecho.FK_ID_ORIGEM, trecho.FK_ID_DESTINO, trecho.ID_TRECHO];

    connection = await ora.getConnection(oraConnAttribs);
    let resInsert = await connection.execute(query, dados);

    await connection.commit();

    const rowsInserted = resInsert.rowsAffected;
    if (rowsInserted !== undefined && rowsInserted === 1) {
      cr.status = "SUCCESS";
      cr.message = "Trecho alterado.";
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    //fechar a conexao.
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

app.get("/listarVoos", async (req: Request, res: Response) => {
  let cr: CustomResponse = { status: "ERROR", message: "", payload: undefined };
  let connection;
  try {
    connection = await ora.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    let resultadoConsulta = await connection.execute(`SELECT * FROM TB_Voo`);

    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
    if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
      cr.payload = rowsToVoos(resultadoConsulta.rows);
    } else {
      // o array está vazio
      cr.payload = [{}];
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

app.put("/inserirVoo", async (req: Request, res: Response) => {
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // UAU! Agora com um tipo definido podemos simplesmente converter tudo que
  // chega na requisição para um tipo nosso!
  const voo: Voos = req.body as Voos;

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

    connection = await ora.getConnection(oraConnAttribs);
    let resInsert = await connection.execute(cmdInsertAero, dados);

    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();

    // obter a informação de quantas linhas foram inseridas.
    // neste caso precisa ser exatamente 1
    const rowsInserted = resInsert.rowsAffected;
    if (rowsInserted !== undefined && rowsInserted === 1) {
      cr.status = "SUCCESS";
      cr.message = "Voo inserido.";
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    //fechar a conexao.
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

app.delete("/excluirVoo", async (req: Request, res: Response) => {
  // excluindo a aeronave pelo código dela:
  const ID_VOO = req.body.ID_VOO as number;

  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // conectando
  let connection;
  try {
    connection = await ora.getConnection(oraConnAttribs);
    const cmdDeleteVoo = `DELETE TB_VOO WHERE ID_VOO = :1`;
    const dados = [ID_VOO];

    let resDelete = await connection.execute(cmdDeleteVoo, dados);

    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();

    // obter a informação de quantas linhas foram inseridas.
    // neste caso precisa ser exatamente 1
    const rowsDeleted = resDelete.rowsAffected;
    if (rowsDeleted !== undefined && rowsDeleted === 1) {
      cr.status = "SUCCESS";
      cr.message = "Trecho excluído.";
    } else {
      cr.message =
        "Voo não excluído. Verifique se o código informado está correto.";
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    // fechando a conexao
    if (connection !== undefined) await connection.close();

    // devolvendo a resposta da requisição.
    res.send(cr);
  }
});

app.put("/alterarVoos", async (req: Request, res: Response) => {
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  let connection;

  const voo: Voos = req.body as Voos;

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

    connection = await ora.getConnection(oraConnAttribs);
    let resInsert = await connection.execute(query, dados);

    await connection.commit();

    const rowsInserted = resInsert.rowsAffected;
    if (rowsInserted !== undefined && rowsInserted === 1) {
      cr.status = "SUCCESS";
      cr.message = "Trecho alterado.";
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    //fechar a conexao.
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

app.get("/listarAeroportos", async (req: Request, res: Response) => {
  let cr: CustomResponse = { status: "ERROR", message: "", payload: undefined };
  let connection;
  try {
    connection = await ora.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    let resultadoConsulta = await connection.execute(
      `SELECT * FROM TB_AEROPORTOS`
    );

    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
    if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
      cr.payload = rowsToAeroportos(resultadoConsulta.rows);
    } else {
      // o array está vazio
      cr.payload = [{}];
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

app.put("/inserirAeroporto", async (req: Request, res: Response) => {
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // UAU! Agora com um tipo definido podemos simplesmente converter tudo que
  // chega na requisição para um tipo nosso!
  const aeroporto: Aeroportos = req.body as Aeroportos;

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

    connection = await ora.getConnection(oraConnAttribs);
    let resInsert = await connection.execute(cmdInsertAeroporto, dados);

    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();

    // obter a informação de quantas linhas foram inseridas.
    // neste caso precisa ser exatamente 1
    const rowsInserted = resInsert.rowsAffected;
    if (rowsInserted !== undefined && rowsInserted === 1) {
      cr.status = "SUCCESS";
      cr.message = "Aeroporto inserido.";
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    //fechar a conexao.
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

app.delete("/excluirAeroporto", async (req: Request, res: Response) => {
  // excluindo a aeronave pelo código dela:
  const NOME = req.body.NOME as string;

  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // conectando
  let connection;
  try {
    connection = await ora.getConnection(oraConnAttribs);
    const cmdDeleteAero = `DELETE TB_AEROPORTOS WHERE NOME = :1`;
    const dados = [NOME];

    let resDelete = await connection.execute(cmdDeleteAero, dados);

    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();

    // obter a informação de quantas linhas foram inseridas.
    // neste caso precisa ser exatamente 1
    const rowsDeleted = resDelete.rowsAffected;
    if (rowsDeleted !== undefined && rowsDeleted === 1) {
      cr.status = "SUCCESS";
      cr.message = "Aeroporto excluído.";
    } else {
      cr.message =
        "Aeroporto não excluído. Verifique se o código informado está correto.";
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    // fechando a conexao
    if (connection !== undefined) await connection.close();

    // devolvendo a resposta da requisição.
    res.send(cr);
  }
});

app.put("/alterarAeroporto", async (req: Request, res: Response) => {
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  let connection;

  const aeroporto: Aeroportos = req.body as Aeroportos;

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

    connection = await ora.getConnection(oraConnAttribs);
    let resInsert = await connection.execute(query, dados);

    await connection.commit();

    const rowsInserted = resInsert.rowsAffected;
    if (rowsInserted !== undefined && rowsInserted === 1) {
      cr.status = "SUCCESS";
      cr.message = "Aeroporto alterado.";
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    //fechar a conexao.
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

app.post("/listarTrechosViagem", async (req: Request, res: Response) => {
  let cr: CustomResponse = { status: "ERROR", message: "", payload: undefined };
  let connection;
  try {
    connection = await ora.getConnection(oraConnAttribs);

    const ORIGEM = req.body.ORIGEM as string;
    const DESTINO = req.body.DESTINO as string;

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    let resultadoConsultaOrigem = await connection.execute(
      `SELECT ID_AEROPORTO FROM TB_AEROPORTOS WHERE CIDADE = '${ORIGEM}'`
    );

    let resultadoConsultaDestino = await connection.execute(
      `SELECT ID_AEROPORTO FROM TB_AEROPORTOS WHERE CIDADE = '${DESTINO}'`
    );

    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";

    if (
      resultadoConsultaOrigem.rows &&
      resultadoConsultaOrigem.rows.length > 0
    ) {
      cr.payload = [
        resultadoConsultaOrigem.rows[0],
        resultadoConsultaDestino.rows[0],
      ];

      try {
        let resultadoConsultaTrecho = await connection.execute(
          `SELECT ID_TRECHO FROM TB_TRECHOS WHERE FK_ID_ORIGEM = '${cr.payload[0][0]}' AND FK_ID_DESTINO = '${cr.payload[1][0]}'`
        );

        // Transforma resultadoConsultaTrecho.rows em um array simples
        const trechosSimples = resultadoConsultaTrecho.rows.map(
          (row: number[]) => row[0]
        );

        // Atribui ao cr.payload
        cr.payload = trechosSimples;
      } catch (error) {}
    } else {
      // o array está vazio
      cr.payload = [{}];
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

app.post("/listarViagens", async (req: Request, res: Response) => {
  let cr: CustomResponse = { status: "ERROR", message: "", payload: undefined };
  let connection;

  try {
    connection = await ora.getConnection(oraConnAttribs);

    const listaDeTrecho = req.body as number[];
    const resultadosCompletos = [];

    for (const idTrecho of listaDeTrecho) {
      try {
        // Consulta para obter informações do voo e do aeroporto associado ao trecho
        let resultadoConsultaTrecho = await connection.execute(
          `SELECT V.*, A_ORIGEM.*, A_DESTINO.* 
          FROM TB_VOO V
          JOIN TB_TRECHOS T ON V.FK_ID_TRECHO = T.ID_TRECHO
          JOIN TB_AEROPORTOS A_ORIGEM ON T.FK_ID_ORIGEM = A_ORIGEM.ID_AEROPORTO
          JOIN TB_AEROPORTOS A_DESTINO ON T.FK_ID_DESTINO = A_DESTINO.ID_AEROPORTO
          WHERE V.FK_ID_TRECHO = ${idTrecho}`
        );

        if (
          resultadoConsultaTrecho.rows &&
          resultadoConsultaTrecho.rows.length > 0
        ) {
          // Adiciona o resultado ao array
          resultadosCompletos.push(resultadoConsultaTrecho.rows[0]);
        }
      } catch (error: any) {
        console.error(`Erro ao consultar trecho ${idTrecho}:`, error.message);
        // Se desejar, você pode lidar com erros aqui
      }
    }

    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    cr.payload = resultadosCompletos;
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

app.post("/totalAssentos", async (req: Request, res: Response) => {
  let cr: CustomResponse = { status: "ERROR", message: "", payload: undefined };
  let connection;
  try {
    connection = await ora.getConnection(oraConnAttribs);

    const vooData = req.body.vooData;

    let resultadoConsulta = await connection.execute(
      `SELECT TOTAL_ASSENTOS FROM TB_AERONAVES WHERE ID_AERONAVE = :1`,
      [vooData[7]]
    );

    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";

    if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
      cr.payload = resultadoConsulta.rows[0][0];
    } else {
      // o array está vazio
      cr.payload = undefined;
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  } finally {
    if (connection !== undefined) {
      await connection.close();
    }

    res.send(cr);
  }
});

// Rota para listar todos os trechos de viagem
app.post("/listarAssentos", async (req: Request, res: Response) => {
  // Objeto para armazenar a resposta personalizada
  let cr: CustomResponse = { status: "ERROR", message: "", payload: undefined };
  let connection;

  const ID = req.body.FK_ID_AERONAVE as number;

  try {
    // Conectar ao banco de dados Oracle
    connection = await ora.getConnection(oraConnAttribs);

    // Consultar todos os assentos na tabela TB_Assento com base no ID da aeronave
    let resultadoConsulta = await connection.execute(
      `SELECT *
      FROM TB_Assento
      WHERE fk_id_aeronave = :id`,
      [ID]
    );

    // Configurar resposta de sucesso
    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";

    // Verificar se há resultados para a consulta
    if (resultadoConsulta.rows && resultadoConsulta.rows.length > 0) {
      // Transformar os resultados em um formato mais adequado, se houver resultados
      cr.payload = rowsToAssentos(resultadoConsulta.rows);
    } else {
      // Configurar payload para um array vazio se não houver resultados
      cr.payload = [];
    }
  } catch (e) {
    // Tratar erros na conexão ao banco de dados Oracle
    if (e instanceof Error) {
      cr.message = e.message;
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  } finally {
    // Fechar a conexão com o banco de dados, se estiver aberta
    if (connection !== undefined) {
      await connection.close();
    }
    // Enviar a resposta ao cliente
    res.send(cr);
  }
});

app.post("/gerarReferencia", async (req: Request, res: Response) => {
  let cr: CustomResponse = { status: "ERROR", message: "", payload: undefined };
  let connection;
  try {
    connection = await ora.getConnection(oraConnAttribs);

    const ID_ASSENTO = req.body.ID as number;
    const REFERENCIA_ASSENTO = req.body.REFERENCIA as string;

    console.log(ID_ASSENTO);
    // console.log(REFERENCIA_ASSENTO);

    let resultadoAtualizacao = await connection.execute(
      `UPDATE TB_ASSENTO SET REFERENCIA = :1 WHERE ID_ASSENTO = :2`,
      [REFERENCIA_ASSENTO, ID_ASSENTO]
    );

    await connection.commit();

    console.log(resultadoAtualizacao.rows);

    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";

    if (resultadoAtualizacao.rows && resultadoAtualizacao.rows.length > 0) {
      cr.payload = resultadoAtualizacao.rows;
    } else {
      // o array está vazio
      cr.payload = undefined;
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
      cr.message = e.message;
    } else {
      console.error(e);
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  } finally {
    if (connection !== undefined) {
      await connection.close();
    }

    res.send(cr);
    console.log(cr);
  }
});

app.post("/obterIDs", async (req: Request, res: Response) => {
  let cr: CustomResponse = { status: "ERROR", message: "", payload: undefined };
  let connection;
  try {
    connection = await ora.getConnection(oraConnAttribs);

    const ID_AERONAVE = req.body.ID;

    let resultadoAtualizacao = await connection.execute(
      `SELECT ID_ASSENTO FROM TB_ASSENTO WHERE FK_ID_AERONAVE = :1`,
      [ID_AERONAVE]
    );

    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";

    if (resultadoAtualizacao.rows && resultadoAtualizacao.rows.length > 0) {
      // Utilize flat() para converter o array de arrays em um array plano
      cr.payload = resultadoAtualizacao.rows.flat();
    } else {
      // O array está vazio
      cr.payload = undefined;
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  } finally {
    if (connection !== undefined) {
      await connection.close();
    }

    res.send(cr);
  }
});