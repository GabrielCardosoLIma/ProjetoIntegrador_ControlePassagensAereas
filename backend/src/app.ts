import express, { Request, Response } from "express";
import { Aeronave } from "./types/Aeronave";
import { Voos } from "./types/Voos";
import { Trechos } from "./types/Trechos";
const ora = require("oracledb");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
const port = 3000;

const oracleStr "";

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  app.use(cors());
  next();
});

// o código fornecido será ingênuo.
app.get("/obterAeronaves", async (req: Request, res: Response) => {
  // inicalizando o dotenv
  dotenv.config();

  // o resultado pode ser a lista de aeronaves ou erro.
  let result;

  // primeiro: construir o objeto de CONEXAO.
  const connection = await ora.getConnection({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectionString: oracleStr,
  });

  try {
    // tentando obter os dados...
    result = await connection.execute("SELECT * FROM aeronaves");
  } catch (erro) {
    if (erro instanceof Error) {
      console.log(`O detalhamento do erro é: ${erro.message}`);
    } else {
      console.log("Erro desconhecido.");
    }
    result = {
      error: "Erro ao obter aeronaves.",
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
    res.send(result.rows);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Bem-vindo à minha aplicação!");
});

app.put("/incluirAeronave", async (req, res) => {
  dotenv.config();

  const aero: Aeronave = req.body as Aeronave;

  try {
    // const { MODELO, N_IDENTIFICACAO, FABRICANTE, ANO_FABRICACAO, MAPAASSENTOS } = req.body;

    // Construa sua consulta SQL de inserção com valores posicionais
    const query = `INSERT INTO AERONAVES (MODELO, N_IDENTIFICACAO, FABRICANTE, ANO_FABRICACAO, MAPAASSENTOS) VALUES (:1, :2, :3, :4, :5)`;
    const dados = [
      aero.MODELO,
      aero.N_IDENTIFICACAO,
      aero.FABRICANTE,
      aero.ANO_FABRICACAO,
      aero.MAPAASSENTOS,
    ];

    // Primeiro: construir o objeto de conexão
    const connection = await ora.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectionString: oracleStr,
    });

    // Executar a consulta de inserção com os valores vinculados
    const result = await connection.execute(query, dados);
    await connection.commit();
    // Fechar a conexão
    await connection.close();

    res.send("Aeronave inserida com sucesso!");
  } catch (error) {
    res.status(500).send("Erro ao inserir aeronave: " + error);
  }
});

app.delete("/excluirAeronave", async (req: Request, res: Response) => {
  // Inicializando o dotenv
  dotenv.config();

  const id = req.body.N_IDENTIFICACAO as String;

  // Dados a serem excluídos
  const query = `DELETE FROM aeronaves WHERE N_IDENTIFICACAO = '${id}'`;
  // const dados = [id];

  // Primeiro: construir o objeto de conexão.
  const connection = await ora.getConnection({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectionString: oracleStr,
  });

  try {
    // Tentando excluir os dados...
    await connection.execute(query);
    await connection.commit();

    console.log("Dados excluídos com sucesso!");
  } catch (erro) {
    if (erro instanceof Error) {
      console.log(`O detalhamento do erro é: ${erro.message}`);
    } else {
      console.log("Erro desconhecido ao excluir dados.");
    }
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
    res.send("Dados excluídos com sucesso!");
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Bem-vindo à minha aplicação!");
});

app.put("/alterarAeronave", async (req, res) => {
  dotenv.config();
  const aero: Aeronave = req.body as Aeronave;

  try {
    // Construa sua consulta SQL de atualização com valores posicionais
    const query = `UPDATE AERONAVES 
                   SET MODELO = :1, 
                       FABRICANTE = :2, 
                       ANO_FABRICACAO = :3, 
                       MAPAASSENTOS = :4
                   WHERE N_IDENTIFICACAO = :5`;
    const dados = [
      aero.MODELO,
      aero.FABRICANTE,
      aero.ANO_FABRICACAO,
      aero.MAPAASSENTOS,
      aero.N_IDENTIFICACAO,
    ];

    // Primeiro: construir o objeto de conexão
    const connection = await ora.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectionString: oracleStr,
    });

    // Executar a consulta de atualização com os valores vinculados
    const result = await connection.execute(query, dados);
    await connection.commit();

    // Fechar a conexão
    await connection.close();

    res.send("Aeronave atualizada com sucesso!");
  } catch (error) {
    res.status(500).send("Erro ao atualizar aeronave: " + error);
  }
});

app.listen(port, () => {
  console.log("Servidor HTTP rodando...");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Bem-vindo à minha aplicação!");
});

app.get("/obterVoos", async (req: Request, res: Response) => {
  dotenv.config();

  let resultVoo;

  const connection = await ora.getConnection({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectionString: oracleStr,
  });

  try {
    resultVoo = await connection.execute("SELECT * FROM voos");
    console.log(resultVoo);
  } catch (erro) {
    if (erro instanceof Error) {
      console.log(`O detalhamento do erro é: ${erro.message}`);
    } else {
      console.log("Erro desconhecido.");
    }
    resultVoo = {
      error: "Erro ao obter voos.",
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
    res.send(resultVoo.rows);
  }
});

app.put("/incluirVoos", async (req, res) => {
  dotenv.config();

  const voo: Voos = req.body as Voos;

  try {
    const insertTrecho = `INSERT INTO TRECHOS (ID_TRECHO, ORIGEM, DESTINO) VALUES (:1, :2, :3)`;
    const dadosTrecho = [voo.ID_TRECHO, voo.AERO_ORIGEM, voo.AERO_DESTINO];

    const connection = await ora.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectionString: oracleStr,
    });

    const resultTrecho = await connection.execute(insertTrecho, dadosTrecho);
    await connection.commit();

    try {
      const insertVoo = `INSERT INTO VOOS (N_VOO, DATA_VOO, ID_TRECHO, H_PARTIDA, H_CHEGADA, AERO_ORIGEM, AERO_DESTINO, VALOR_ASS) VALUES (:1, :2, :3, :4, :5, :6, :7, :8)`;
      const dadosVoo = [
        voo.N_VOO,
        voo.DATA_VOO,
        voo.ID_TRECHO,
        voo.H_PARTIDA,
        voo.H_CHEGADA,
        voo.AERO_ORIGEM,
        voo.AERO_DESTINO,
        voo.VALOR_ASS,
      ];

      const resultVoo = await connection.execute(insertVoo, dadosVoo);
      await connection.commit();

      await connection.close();

      res.send("Voo cadastrado com sucesso!");
    } catch (error) {
      res.status(500).send("Erro ao inserir voo: " + error);
    }
  } catch (error) {
    res.status(500).send("Erro ao inserir trecho: " + error);
  }
});


app.delete("/excluirVoos", async (req: Request, res: Response) => {
  // Inicializando o dotenv
  dotenv.config();

  const id = req.body.N_VOO as String;

  // Dados a serem excluídos
  const query = `DELETE FROM VOOS WHERE N_VOO = '${id}'`;
  // const dados = [id];

  // Primeiro: construir o objeto de conexão.
  const connection = await ora.getConnection({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectionString: oracleStr,
  });

  try {
    // Tentando excluir os dados...
    await connection.execute(query);
    await connection.commit();

    console.log("Dados excluídos com sucesso!");
  } catch (erro) {
    if (erro instanceof Error) {
      console.log(`O detalhamento do erro é: ${erro.message}`);
    } else {
      console.log("Erro desconhecido ao excluir dados.");
    }
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
    res.send("Dados excluídos com sucesso!");
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Bem-vindo à minha aplicação!");
});

app.put("/alterarVoos", async (req, res) => {
  dotenv.config();
  const voo: Voos = req.body as Voos;

  try {
    // Construa sua consulta SQL de atualização com valores posicionais
    const query = `UPDATE VOOS 
                   SET DATA_VOO = :1, 
                       ID_TRECHO = :2, 
                       H_PARTIDA = :3, 
                       H_CHEGADA = :4,
                       AERO_ORIGEM = :5,
                       AERO_DESTINO = :6,
                       VALOR_ASS = :7
                   WHERE N_VOO = :8`;
    const dados = [
      voo.DATA_VOO,
      voo.ID_TRECHO,
      voo.H_PARTIDA,
      voo.H_CHEGADA,
      voo.AERO_ORIGEM,
      voo.AERO_DESTINO,
      voo.VALOR_ASS,
      voo.N_VOO,
    ];

    // Primeiro: construir o objeto de conexão
    const connection = await ora.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectionString: oracleStr,
    });

    // Executar a consulta de atualização com os valores vinculados
    const result = await connection.execute(query, dados);
    await connection.commit();

    // Fechar a conexão
    await connection.close();

    res.send("Voo atualizado com sucesso!");
  } catch (error) {
    res.status(500).send("Erro ao atualizar voo: " + error);
  }
});
