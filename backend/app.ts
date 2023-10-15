const oracledb = require('oracledb');

async function connectToOracle() {
  const connection = await oracledb.getConnection({
    user: 'bd190923122',
    password: 'Svyje9',
    connectString: '@BD-ACD'
  });

  console.log('CONECTADO COM SUCESSO!')

  // const result = await connection.execute('SELECT * FROM sua_tabela');
  // console.log(result.rows);

  await connection.close();
}

connectToOracle();

const express = require("express");
var cors = require("cors");
const app = express();
// const router = require("./routes/index");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,DELETE,OPTIONS,POST,PUT"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
  );
  app.use(cors());
  next();
});

app.get("/", function (request, response) {
  response.send("Serviço API Rest iniciada...");
});

// app.use(router);

app.listen(3033, () => {
  console.log(`Servidor iniciado na porta 3033 http://localhost:3033`);
});
