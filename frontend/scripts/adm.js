/*--------------- TABELA DE AERONAVES ------------------------- */

// Funcao que verifica se preencheu o modelo.
function preencheuModelo() {
  let resultado = false;
  const modeloInformado = document.getElementById("modelo").value.trim();

  if (modeloInformado.length > 0) {
    // Capitaliza a primeira letra de cada palavra
    const modeloCapitalizado = modeloInformado
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Atualiza o valor do campo de entrada com o modelo capitalizado
    document.getElementById("modelo").value = modeloCapitalizado;

    resultado = true;
  }

  return resultado;
}


// Função que verifica se selecionou ou não o fabricante.
function selecionouFabricante() {
  let resultado = false;
  var listaFabricantes = document.getElementById("comboFabricantes");
  var valorSelecionado = listaFabricantes.value;
  if (valorSelecionado !== "0") {
    resultado = true;
  }
  return resultado;
}

// Função que verifica se preencheu a companhia
function preencherCompanhia() {
  let resultado = false;
  var companhiaInformada = document.getElementById("companhia").value;
  if (companhiaInformada.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Função que verifica se preencheu o ano
function preencheuAno() {
  let resultado = false;
  var strAno = document.getElementById("anoFab").value;
  if (strAno.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Função que verifica se o ano está em um intervalo válido
function anoValido() {
  let resultado = false;
  var strAno = document.getElementById("anoFab").value;
  const ano = parseInt(strAno);
  if (ano >= 1990 && ano <= 2023) {
    resultado = true;
  }
  return resultado;
}

// Funcao que verifica se preencheu o total de assentos
function preencheuTotalAssentos() {
  let resultado = false;
  const strAssentos = document.getElementById("totalAssentos").value;
  if (strAssentos.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Funcao que verifica se o total de assentos é valido
function totalAssentosValido() {
  let resultado = false;
  const strAssentos = document.getElementById("totalAssentos").value;
  const assentos = parseInt(strAssentos);
  if (assentos >= 100 && assentos <= 360) {
    resultado = true;
  }
  return resultado;
}

// Funcao para exibir mensagem de status
function showStatusMessage(msg, error) {
  var pStatus = document.getElementById("status");
  if (error === true) {
    pStatus.className = "statusError";
  } else {
    pStatus.className = "statusSuccess";
  }
  pStatus.textContent = msg;
}

// Função para enviar uma requisição PUT para cadastrar aeronave
function fetchInserir(body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch("http://localhost:3000/inserirAeronave", requestOptions).then(
    (T) => T.json()
  );
}

// Função para inserir uma aeronave
function inserirAeronave() {
  if (!preencheuModelo()) {
    showStatusMessage("Preencha o modelo.", true);
    return;
  }

  if (!selecionouFabricante()) {
    showStatusMessage("Selecione o fabricante.", true);
    return;
  }

  if (!preencherCompanhia()) {
    showStatusMessage("Preencha a companhia da aeronave.", true);
    return;
  }

  if (!preencheuAno()) {
    showStatusMessage("Preencha o ano de fabricação.", true);
    return;
  }

  if (!anoValido()) {
    showStatusMessage("Ano inválido (min: 1990 max:2023).", true);
    return;
  }

  if (!preencheuTotalAssentos()) {
    showStatusMessage("Preencha o total de assentos.", true);
    return;
  }

  if (!totalAssentosValido()) {
    showStatusMessage("Total de assentos inválido (min: 100 max: 360).", true);
    return;
  }

  // Após os campos serem validados, a aeronave será cadastrada
  const fabricante = document.getElementById("comboFabricantes").value;
  const modelo = document.getElementById("modelo").value;
  const anoFab = document.getElementById("anoFab").value;
  const companhia = document.getElementById("companhia").value;
  const totalAssentos = document.getElementById("totalAssentos").value;

  // Envia uma requisição para cadastrar aeronave, usando a função fetchInserir
  fetchInserir({
    FABRICANTE: fabricante,
    MODELO: modelo,
    TOTAL_ASSENTOS: totalAssentos,
    ANO_FABRICACAO: anoFab,
    COMPANHIA: companhia,
  })
    .then((customResponse) => {
      // Trata a resposta da requisição (sucesso ou erro)
      if (customResponse.status === "SUCCESS") {
        showStatusMessage("Aeronave cadastrada... ", false);
        exibirAeronaves();
      } else {
        showStatusMessage(
          "Erro ao cadastrar aeronave...: " + customResponse.message,
          true
        );
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      // Trata os erros durante a requisição
      showStatusMessage(
        "Erro técnico ao cadastrar... Contate o suporte.",
        true
      );
      console.log("Falha grave ao cadastrar." + e);
    });
}

// Função que faz uma requisição para obter a lista de aeronaves
function requestListaDeAeronaves() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  return fetch("http://localhost:3000/listarAeronaves", requestOptions).then(
    (T) => T.json()
  );
}

// Função que faz uma requisição para excluir uma aeronave
function requestExcluirAeronave(body) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch("http://localhost:3000/excluirAeronave", requestOptions).then(
    (T) => T.json()
  );
}

// Função que preenche a tabela de aeronaves
function preencherTabela(aeronaves) {
  // acessando a referencia pelo id do tbody
  const tblBody = document.getElementById("dados-aeronave");

  tblBody.innerHTML = "";

  let aeronave = "";
  // cria as celulas da tabela
  for (let i = 0; i < aeronaves.length; i++) {
    aeronave = aeronaves[i];
    console.log("Dados da aeronave: " + aeronave);

    // Cria uma nova linha (tr) para a aeronave na tabela
    if (aeronave.ID_AERONAVE != undefined) {
      const row = document.createElement("tr");

      if (i % 2 === 0) row.className = "evenRow";
      else row.className = "oddRow";

      row.innerHTML = `<td class="leftText">${aeronave.ID_AERONAVE}</td>
              <td class="leftText">${aeronave.MODELO}</td>
              <td class="leftText">${aeronave.FABRICANTE}</td>
              <td class="rightText">${aeronave.ANO_FABRICACAO}</td>
              <td class="rightText">${aeronave.COMPANHIA}</td>
              <td class="rightText">${aeronave.TOTAL_ASSENTOS}</td>
              <td class="centerText">
                <span class="material-symbols-outlined delete_icon" onclick="excluirAeronave(${aeronave.ID_AERONAVE});">
                delete
                </span>
              </td>`;

      // Adiciona a linha à tabela representando a aeronave
      tblBody.appendChild(row);
    }
  }
}

// Função para excluir uma aeronava, usa como base o id
function excluirAeronave(c) {
  console.log("Clicou no excluir aeronave: " + c);
  // Faz a requisição para excluir a aeronave
  requestExcluirAeronave({ ID_AERONAVE: c })
    .then((customResponse) => {
      // Trata a resposta da requisição
      if (customResponse.status === "SUCCESS") {
        location.reload();
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      // Trata os erros durante a requisição
      console.log("Não foi possível excluir." + e);
    });
}

// Função que exibe a lista de aeronaves
function exibirAeronaves() {
  console.log("Entrou no exibir...");
  // Requisição para obter a lista de aeronaves
  requestListaDeAeronaves()
    .then((customResponse) => {
      if (customResponse.status === "SUCCESS") {
        // verifica o playload
        console.log("Deu certo a busca de aeronaves");
        console.log("Payload:" + JSON.stringify(customResponse.payload));
        // chamada da função de preencher a tabela
        preencherTabela(JSON.parse(JSON.stringify(customResponse.payload)));
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      console.log("Não foi possível exibir." + e);
    });
}

/*--------------- TABELA DE AEROPORTOS ------------------------- */

// Função que verifica se preencheu o nome
function preencheuNome() {
  let resultado = false;
  const modeloInformado = document.getElementById("nome").value;
  if (modeloInformado.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Função que verifica se preencheu a sigla
function preencheuSigla() {
  let resultado = false;
  const siglaInformada = document.getElementById("sigla").value;
  if (siglaInformada.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Função que verifica se preencheu a cidade
function preencheuCidade() {
  let resultado = false;
  const cidadeInformada = document.getElementById("cidade").value;
  if (cidadeInformada.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Função que verifica se preencheu o país
function preencheuPais() {
  let resultado = false;
  const paisInformado = document.getElementById("pais").value;
  if (paisInformado.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Função para exibir mensagem de status
function showStatusMessage2(msg, error) {
  var pStatus = document.getElementById("status2");
  if (error === true) {
    pStatus.className = "statusError";
  } else {
    pStatus.className = "statusSuccess";
  }
  pStatus.textContent = msg;
}

// Função para enviar uma requisição PUT para cadastrar aeroporto
function fetchInserirAeroporto(body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch("http://localhost:3000/inserirAeroporto", requestOptions).then(
    (T) => T.json()
  );
}

// Função para inserir um aeroporto
function inserirAeroporto() {
  if (!preencheuNome()) {
    showStatusMessage2("Preencha o nome.", true);
    return;
  }

  if (!preencheuSigla()) {
    showStatusMessage2("Preencha a sigla.", true);
    return;
  }

  if (!preencheuCidade()) {
    showStatusMessage2("Preencha a cidade.", true);
    return;
  }

  if (!preencheuPais()) {
    showStatusMessage2("Preencha o país.", true);
    return;
  }

  // Após os campos serem validados, o aeroporto será cadastrado
  const nome = document.getElementById("nome").value;
  const sigla = document.getElementById("sigla").value;
  const cidade = document.getElementById("cidade").value;
  const pais = document.getElementById("pais").value;

  // Envia uma requisição para cadastrar aeroporto, usando a função fetchInserirAeroporto
  fetchInserirAeroporto({
    NOME: nome,
    SIGLA: sigla,
    CIDADE: cidade,
    PAIS: pais,
  })
    .then((customResponse) => {
      // Trata a resposta da requisição
      if (customResponse.status === "SUCCESS") {
        showStatusMessage2("Aeroporto cadastrado... ", false);
        exibirAeroportos();
      } else {
        showStatusMessage2(
          "Erro ao cadastrar aeroporto...: " + customResponse.message,
          true
        );
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      // Trata os erros durante a requisição
      showStatusMessage2(
        "Erro técnico ao cadastrar... Contate o suporte.",
        true
      );
      console.log("Falha grave ao cadastrar." + e);
    });
  // .finally(() => exibirAeroportos());
}

// Função que faz uma requisição para obter a lista de aeroportos
function requestListaDeAeroportos() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch("http://localhost:3000/listarAeroportos", requestOptions).then(
    (T) => T.json()
  );
}

// Função que faz uma requisição para excluir aeroporto
function requestExcluirAeroporto(body) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return fetch("http://localhost:3000/excluirAeroporto", requestOptions).then(
    (T) => T.json()
  );
}

// Função que preenche a tabela de aeroportos
function preencherTabelaAeroporto(aeroportos) {
  const tblBody = document.getElementById("dados-aeroporto");

  tblBody.innerHTML = "";

  let aeroporto = "";

  // cria as celulas da tabela
  for (let i = 0; i < aeroportos.length; i++) {
    aeroporto = aeroportos[i];
    console.log("Dados do aeroporto: " + aeroporto);

    // cria uma nova linha para o aeroporto
    if (aeroporto.ID_AEROPORTO != undefined) {
      const row = document.createElement("tr");

      if (i % 2 === 0) row.className = "evenRow";
      else row.className = "oddRow";

      row.innerHTML = `<td>${aeroporto.ID_AEROPORTO}</td>
              <td>${aeroporto.NOME}</td>
              <td>${aeroporto.SIGLA}</td>
              <td>${aeroporto.CIDADE}</td>
              <td>${aeroporto.PAIS}</td>
              <td>
              <span class="material-symbols-outlined delete_icon" onclick="excluirAeroporto('${aeroporto.NOME}');">
              delete
              </span>
              </td>`;

      // Adiciona a linha à tabela, representando a aeronave
      tblBody.appendChild(row);
    }
  }
}

// Função para excluir um aeroporto, usa como base o id
function excluirAeroporto(c) {
  console.log("Clicou no excluir aeroporto: " + c);
  // Requisição para excluir o aeroporto
  requestExcluirAeroporto({ NOME: `${c}` })
    .then((customResponse) => {
      // trata a resposta da requisição
      if (customResponse.status === "SUCCESS") {
        exibirAeroportos();
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      console.log("Não foi possível excluir." + e);
    });
}

// Função que exibe a lista de aeroportos
function exibirAeroportos() {
  console.log("Entrou no exibir...");
  // Requisição para obter a lista de aeroportos
  requestListaDeAeroportos()
    .then((customResponse) => {
      if (customResponse.status === "SUCCESS") {
        // verifica o playload
        console.log("Payload:" + JSON.stringify(customResponse.payload));
        // chamada da função de preencher a tabela
        preencherTabelaAeroporto(
          JSON.parse(JSON.stringify(customResponse.payload))
        );
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      console.log("Não foi possível exibir." + e);
    });
}

/*--------------- TABELA DE TRECHOS ------------------------- */

// Função que verifica se preencheu o id do trecho
function preencheuID() {
  let resultado = false;
  const idInformado = document.getElementById("id_trecho").value;
  if (idInformado.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Função que verifica se preencheu a origem
function preencheuOrigem() {
  let resultado = false;
  const origemInformada = document.getElementById("origem").value;
  if (origemInformada.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Função que verifica se preencheu o destino
function preencheuDestino() {
  let resultado = false;
  const destinoInformado = document.getElementById("destino").value;
  if (destinoInformado.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Funcao para exibir mensagem de status
function showStatusMessage3(msg, error) {
  var pStatus = document.getElementById("status3");
  if (error === true) {
    pStatus.className = "statusError";
  } else {
    pStatus.className = "statusSuccess";
  }
  pStatus.textContent = msg;
}

// Função para enviar uma requisição PUT para cadastrar trecho
function fetchInserirTrecho(body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch("http://localhost:3000/inserirTrecho", requestOptions).then(
    (T) => T.json()
  );
}

// Função para inserir um trecho
function inserirTrecho() {
  if (!preencheuID()) {
    showStatusMessage3("Preencha o ID do trecho.", true);
    return;
  }

  if (!preencheuOrigem()) {
    showStatusMessage3("Preencha o ID do aeroporto de origem.", true);
    return;
  }

  if (!preencheuDestino()) {
    showStatusMessage3("Preencha o ID do aeroporto de destino.", true);
    return;
  }

  // Após os campos serem validados, o trecho será cadastrado
  const id_trecho = document.getElementById("id_trecho").value;
  const origem = document.getElementById("origem").value;
  const destino = document.getElementById("destino").value;

  // Envia uma requisição para cadastrar trecho
  fetchInserirTrecho({
    ID_TRECHO: id_trecho,
    FK_ID_ORIGEM: origem,
    FK_ID_DESTINO: destino,
  })
    .then((customResponse) => {
      // Trata a resposta da requisição
      if (customResponse.status === "SUCCESS") {
        showStatusMessage3("Trecho cadastrado... ", false);
        exibirTrechos();
      } else {
        showStatusMessage3(
          "Erro ao cadastrar trecho...: " + customResponse.message,
          true
        );
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      // Trata os erros durante a requisição
      showStatusMessage3(
        "Erro técnico ao cadastrar... Contate o suporte.",
        true
      );
      console.log("Falha grave ao cadastrar." + e);
    });
}

// Função que faz uma requisição para obter a lista de trechos
function requestListaDeTrechos() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch("http://localhost:3000/listarTrechos", requestOptions).then(
    (T) => T.json()
  );
}

// Função que faz uma requisição para excluir trecho
function requestExcluirTrecho(body) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return fetch("http://localhost:3000/excluirTrecho", requestOptions).then(
    (T) => T.json()
  );
}

// Função que preenche a tabela de trechos
function preencherTabelaTrecho(trechos) {
  // acessando a referencia pelo id do tbody
  const tblBody = document.getElementById("dados-trechos");

  tblBody.innerHTML = "";

  let trecho = "";

  // cria as celulas da tabela
  for (let i = 0; i < trechos.length; i++) {
    trecho = trechos[i];
    console.log("Dados da trecho: " + trecho);
    // row representa a linha da tabela (um novo tr)

    // Cria uma nova linha (tr) para o novo trecho na tabela
    if (trecho.ID_TRECHO != undefined) {
      const row = document.createElement("tr");

      row.innerHTML = ` <td>${trecho.ID_TRECHO}</td>
            <td>${trecho.FK_ID_ORIGEM}</td>
            <td>${trecho.FK_ID_DESTINO}</td>
            <td>
              <span class="material-symbols-outlined delete_icon" onclick="excluirTrecho(${trecho.ID_TRECHO});">
              delete
              </span>
            </td>`;

      // Adiciona a linha à tabela representando o trecho
      tblBody.appendChild(row);
    }
  }
}

// Função para excluir um trecho, usa como base o id
function excluirTrecho(c) {
  console.log("Clicou no excluir aeronave: " + c);
  // Faz a requisição para excluir o trecho
  requestExcluirTrecho({ ID_TRECHO: c })
    .then((customResponse) => {
      // Trata a resposta da requisição
      if (customResponse.status === "SUCCESS") {
        exibirTrechos();
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      // Trata os erros durante a requisição
      console.log("Não foi possível excluir." + e);
    });
}

// Função que exibe a lista de trechos
function exibirTrechos() {
  console.log("Entrou no exibir...");
  // Requisição para obter a lista de trechos
  requestListaDeTrechos()
    .then((customResponse) => {
      if (customResponse.status === "SUCCESS") {
        // vverifica o playload
        console.log("Deu certo a busca de aeronaves");
        console.log("Payload:" + JSON.stringify(customResponse.payload));
        // chamada da função de preencher a tabela de trechos
        preencherTabelaTrecho(
          JSON.parse(JSON.stringify(customResponse.payload))
        );
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      console.log("Não foi possível exibir." + e);
    });
}

/*--------------- TABELA DE VOOS ------------------------- */

// Função que verifica se preencheu id do voo
function preencheuIDVoo() {
  let resultado = false;
  const idInformado = document.getElementById("id_voo").value;
  if (idInformado.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Função que verifica se preencheu id do voo
function selecionouTipoVoo() {
  let resultado = false;
  var listaTipo = document.getElementById("tipo");
  var valorSelecionado = listaTipo.value;
  if (valorSelecionado !== "0") {
    resultado = true;
  }
  return resultado;
}

// Função que verifica se preencheu a data de saida
function selecionouDataSaida() {
  let resultado = false;
  var strData = document.getElementById("saida").value;
  if (strData.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Função que verifica se preencheu a data de chegada
function selecionouDataChegada() {
  let resultado = false;
  var strData = document.getElementById("chegada").value;
  if (strData.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Função apra verificar se preencheu o id do trecho
function preencheuIDTrechoVoo() {
  let resultado = false;
  var id = document.getElementById("id_trechoVoo").value;
  if (id.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Função que verifica se preencheu o id da aeronave
function preencheuIDAeronaveVoo() {
  let resultado = false;
  var id = document.getElementById("id_aeronave").value;
  if (id.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Função que verifica se preencheu o preco
function preencheuPreco() {
  let resultado = false;
  var preco = document.getElementById("preco").value;
  if (preco.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Funcao para exibir mensagem de status
function showStatusMessage4(msg, error) {
  var pStatus = document.getElementById("status4");
  if (error === true) {
    pStatus.className = "statusError";
  } else {
    pStatus.className = "statusSuccess";
  }
  pStatus.textContent = msg;
}

// Função para enviar uma requisição PUT para cadastrar voo
function fetchInserirVoo(body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch("http://localhost:3000/inserirVoo", requestOptions).then((T) =>
    T.json()
  );
}

// Função para inserir um voo
function inserirVoo() {
  if (!preencheuIDVoo()) {
    showStatusMessage4("Preencha o id do voo.", true);
    return;
  }

  if (!selecionouTipoVoo()) {
    showStatusMessage4("Selecione o tipo de voo.", true);
    return;
  }

  if (!selecionouDataSaida()) {
    showStatusMessage4("Preencha a data de saída.", true);
    return;
  }

  if (!selecionouDataChegada()) {
    showStatusMessage4("Preencha a data de chegada.", true);
    return;
  }

  if (!preencheuIDTrechoVoo()) {
    showStatusMessage4("Preencha o ID do trecho do voo.", true);
    return;
  }

  if (!preencheuIDAeronaveVoo()) {
    showStatusMessage4("Preencha o ID da aeronave do voo.", true);
    return;
  }

  if (!preencheuPreco()) {
    showStatusMessage4("Preencha o preço do voo.", true);
    return;
  }

  function formatarDataHora(input) {
    // Criar um objeto Date com base na string de entrada
    const dataHora = new Date(input);

    // Extrair componentes de data e hora
    const ano = dataHora.getFullYear();
    const mes = String(dataHora.getMonth() + 1).padStart(2, "0"); // Adicionar zero à esquerda se necessário
    const dia = String(dataHora.getDate()).padStart(2, "0");
    const hora = String(dataHora.getHours()).padStart(2, "0");
    const minutos = String(dataHora.getMinutes()).padStart(2, "0");

    // Formatar a string de saída
    const saida = `${ano}-${mes}-${dia} ${hora}:${minutos}:00`;

    return saida;
  }

  // Após os campos serem validados e a data e hora formatados, a aeronave será cadastrada
  const id_voo = document.getElementById("id_voo").value;
  const saida = document.getElementById("saida").value;
  const chegada = document.getElementById("chegada").value;
  const id_trecho = document.getElementById("id_trechoVoo").value;
  const id_aeronave = document.getElementById("id_aeronave").value;
  const tipo = document.getElementById("tipo").value;
  const preco = document.getElementById("preco").value;

  // Envia uma requisição para cadastrar voo, usando a função fetchInserirVoo
  fetchInserirVoo({
    ID_VOO: id_voo,
    HORA_DATA_CHEGADA_IDA: formatarDataHora(chegada),
    HORA_DATA_SAIDA_IDA: formatarDataHora(saida),
    HORA_DATA_CHEGADA_VOLTA: formatarDataHora(chegada),
    HORA_DATA_SAIDA_VOLTA: formatarDataHora(saida),
    TIPO: tipo,
    FK_ID_TRECHO: id_trecho,
    FK_ID_AERONAVE: id_aeronave,
    PRECO: preco,
  })
    .then((customResponse) => {
      if (customResponse.status === "SUCCESS") {
        showStatusMessage3("Trecho cadastrado... ", false);
        exibirVoos();
      } else {
        showStatusMessage3(
          "Erro ao cadastrar trecho...: " + customResponse.message,
          true
        );
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      showStatusMessage(
        "Erro técnico ao cadastrar... Contate o suporte.",
        true
      );
      console.log("Falha grave ao cadastrar." + e);
    });
}

// Função que faz uma requisição para obter a lista de voos
function requestListaDeVoos() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch("http://localhost:3000/listarVoos", requestOptions).then((T) =>
    T.json()
  );
}

// Função que faz uma requisição para excluir um voo
function requestExcluirVoo(body) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return fetch("http://localhost:3000/excluirVoo", requestOptions).then((T) =>
    T.json()
  );
}

// Função que preenche a tabela de voos
function preencherTabelaVoo(voos) {
  // acessando a referencia pelo id do tbody
  const tblBody = document.getElementById("dados-voos");

  tblBody.innerHTML = "";

  let voo = "";
  // cria as celulas da tabela
  for (let i = 0; i < voos.length; i++) {
    voo = voos[i];
    console.log("Dados da voo: " + voo);

    // Cria uma nova linha (tr) para a aeronave na tabela
    if (voo.ID_VOO != undefined) {
      const row = document.createElement("tr");

      function formatarDataHora(input) {
        // Criar um objeto Date com base na string de entrada
        const dataHora = new Date(input);

        // Extrair componentes de data e hora
        const ano = dataHora.getFullYear();
        const mes = String(dataHora.getMonth() + 1).padStart(2, "0"); // Adicionar zero à esquerda se necessário
        const dia = String(dataHora.getDate()).padStart(2, "0");
        const hora = String(dataHora.getHours()).padStart(2, "0");
        const minutos = String(dataHora.getMinutes()).padStart(2, "0");

        // Formatar a string de saída
        const saida = `${ano}-${mes}-${dia} ${hora}:${minutos}:00`;

        return saida;
      }

      row.innerHTML = ` <td>${voo.ID_VOO}</td>
            <td>${voo.TIPO}</td>
            <td>${formatarDataHora(voo.HORA_DATA_SAIDA_IDA)}</td>
            <td>${formatarDataHora(voo.HORA_DATA_SAIDA_VOLTA)}</td>
            <td>${voo.FK_ID_TRECHO}</td>
            <td>${voo.FK_ID_AERONAVE}</td>
            <td>${voo.PRECO}</td>
            <td>
              <span class="material-symbols-outlined delete_icon" onclick="excluirVoo(${
                voo.ID_VOO
              });">
              delete
              </span>
            </td>`;

      // Adiciona a linha à tabela representando o voo
      tblBody.appendChild(row);
    }
  }
}

// Função que exclui um voo usando como base o id do voo
function excluirVoo(c) {
  console.log("Clicou no excluir aeronave: " + c);
  // Faz a requisição para excluir a aeronave
  requestExcluirVoo({ ID_VOO: c })
    .then((customResponse) => {
      // Trata a resposta da requisição
      if (customResponse.status === "SUCCESS") {
        exibirVoos();
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      // Trata os erros durante a requisição
      console.log("Não foi possível excluir." + e);
    });
}

// Função que exibe a lista de voos
function exibirVoos() {
  console.log("Entrou no exibir...");
  // Requisição para obter a lista de voos
  requestListaDeVoos()
    .then((customResponse) => {
      if (customResponse.status === "SUCCESS") {
        // verifica o playload
        console.log("Deu certo a busca de voos");
        console.log("Payload:" + JSON.stringify(customResponse.payload));
        // chamada da função de preencher a tabela
        preencherTabelaVoo(JSON.parse(JSON.stringify(customResponse.payload)));
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      console.log("Não foi possível exibir." + e);
    });
}

/*--------------- TABELA DE ASSENTOS ------------------------- */

// Funcao que verifica se preencheu id da aeronave.
function preencheuFkIdAeronave() {
  let resultado = false;
  const fk_id_aeronave = document.getElementById("fk_id_aeronave").value;
  if (fk_id_aeronave.length > 0) {
    resultado = true;
  }
  return resultado;
}

// Funcao para exibir mensagem de status
function showStatusMessage5(msg, error) {
  var pStatus = document.getElementById("status5");
  if (error === true) {
    pStatus.className = "statusError";
  } else {
    pStatus.className = "statusSuccess";
  }
  pStatus.textContent = msg;
}

// Função que faz uma requisição para obter a lista de assentos
function requestListaDeAssentos(body) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch("http://localhost:3000/listarAssentos", requestOptions).then(
    (T) => T.json()
  );
}

// Função que preenche a tabela de assentos
function preencherTabelaAssentos(Assentos) {

  const tblBody = document.getElementById("dados-assentos");

  tblBody.innerHTML = "";

  let assento = "";
  for (let i = 0; i < Assentos.length; i++) {
    assento = Assentos[i];
    console.log("Dados do assento: " + assento);


    const row = document.createElement("tr");

      if (i % 2 === 0) row.className = "evenRow";
      else row.className = "oddRow";

      // Preenche as células da linha com os dados do assento
      row.innerHTML = `<td class="leftText">${assento.ID_ASSENTO}</td>
              <td class="leftText">${assento.STATUS}</td>
              <td class="leftText">${assento.REFERENCIA}</td>
              <td class="rightText">${assento.FK_ID_AERONAVE}</td>`;

      // Adiciona a linha à tabela representando o assento
      tblBody.appendChild(row);
  }
}

// Função que exibe a lista de assentos
function exibirAssentos() {

  if (!preencheuFkIdAeronave()) {
    showStatusMessage5("Preencha o id da aeronave.", true);
    return;
  }

  var pStatus = document.getElementById("status5");
  pStatus.style.display = 'none';

  const fk_id_aeronave = document.getElementById("fk_id_aeronave").value;
  console.log("Entrou no exibir...");

  // Requisição da lista de aeronaves
  requestListaDeAssentos({ FK_ID_AERONAVE: fk_id_aeronave })
    .then((customResponse) => {
      if (customResponse.status === "SUCCESS") {
        console.log("Deu certo a busca de assentos");
        console.log("Payload:" + JSON.stringify(customResponse.payload));
        // chamada da função de preencher os assentos
        preencherTabelaAssentos(
          JSON.parse(JSON.stringify(customResponse.payload))
        );
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      console.log("Não foi possível exibir." + e);
    });
}
