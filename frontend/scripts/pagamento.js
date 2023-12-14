//puxar o valor da pagina anterior (1-ida e volta ou 2- so ida) estático só para simular
var valorRadio = 2;

if (valorRadio === 1) {
  divVolta.style.display = "none"; //esconde a div de volta
}

// Função que altera as divs da opção de pagamentos (pix ou cartao)
// Se cartão, exibe o formulario de cartao e oculta o de pix
// Senao exibe o de pix e oculta o de cartao
document
  .querySelectorAll('input[name="flexRadioDefault"]')
  .forEach(function (radio) {
    radio.addEventListener("change", function () {
      var opcPag = document.querySelector(
        'input[name="flexRadioDefault"]:checked'
      ).value;

      var cartao = document.querySelector("#f-cartao");
      var pix = document.querySelector("#f-pix");

      if (opcPag === "cartao") {
        cartao.style.display = "block";
        pix.style.display = "none";
      } else {
        cartao.style.display = "none";
        pix.style.display = "flex";
      }
    });
  });

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

// Função para capitalizar a primeira letra e a letra após um espaço
function capitalizarNome(str) {
  return str.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
}

// Função para validar nome
function validarNome(event) {
  var nomeInput = document.querySelector("#nome");
  var nome = nomeInput.value;

  // Remover números do valor do campo
  nome = nome.replace(/\d/g, "");

  // Capitaliza a primeira letra e a letra após um espaço
  nomeInput.value = capitalizarNome(nome);

  var mensagemDiv = document.querySelector("#mensagemValidacao");
  var iconeVerificado = document.querySelector("#iconeVerificado");

  // Verificar se o comprimento do nome é zero
  if (nome.length === 0) {
    mensagemDiv.innerHTML = "";
    iconeVerificado.style.display = "none";
    return false;
  } else if (nome.length < 15) {
    mensagemDiv.innerHTML = "Digite seu nome completo";
    iconeVerificado.style.display = "none";
    return false;
  } else {
    mensagemDiv.innerHTML = "";
    iconeVerificado.style.display = "block";
    return true;
  }
}

// Função para validar o e-mail
function validarEmail() {
  var emailInput = document.querySelector("#email");
  var email = emailInput.value;
  var mensagemDiv = document.querySelector("#mensagemValidacaoEmail");
  var iconeVerificadoEmail = document.querySelector("#iconeVerificadoEmail");

  // Expressão regular para verificar o formato do e-mail
  var regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  // Verificar se o comprimento do e-mail é zero ou dentro da expressão regular
  if (email.length === 0) {
    mensagemDiv.innerHTML = "";
    iconeVerificadoEmail.style.display = "none";
    return false;
  } else if (!regexEmail.test(email)) {
    mensagemDiv.innerHTML = "Digite um e-mail válido";
    iconeVerificadoEmail.style.display = "none";
    return false;
  } else {
    mensagemDiv.innerHTML = "";
    iconeVerificadoEmail.style.display = "block";
    return true;
  }
}

// Função para validar o nome no cartão
function validarNomeCartao(event) {
  var nomeCartaoInput = document.querySelector("#nomeCartao");
  var nomeCartao = nomeCartaoInput.value;

  // Remover números do valor do campo
  nomeCartao = nomeCartao.replace(/\d/g, "");

  // Capitaliza a primeira letra e a letra após um espaço
  nomeCartaoInput.value = capitalizarNome(nomeCartao);

  var mensagemDiv = document.querySelector("#mensagemValidacaoNomeCartao");
  var iconeVerificado = document.querySelector("#iconeVerificadoNomeCartao");

  // Verifica se o comprimento do nome do cartão é zero ou menor que 15
  if (nomeCartao.length === 0) {
    mensagemDiv.innerHTML = "";
    iconeVerificado.style.display = "none";
    return false;
  } else if (nomeCartao.length < 15) {
    mensagemDiv.innerHTML = "Digite o nome como consta no cartão";
    iconeVerificado.style.display = "none";
    return false;
  } else {
    mensagemDiv.innerHTML = "";
    iconeVerificado.style.display = "block";
    return true;
  }
}

// Função para validar o número do cartão
function validarNumeroCartao(event) {
  let res = false;

  var numeroCartaoInput = document.querySelector("#numeroCartao");
  var numeroCartao = numeroCartaoInput.value;

  // Remover caracteres não numéricos do valor do campo
  numeroCartao = numeroCartao.replace(/\D/g, "");

  // Limitar a entrada a 16 caracteres
  if (numeroCartao.length > 16) {
    numeroCartao = numeroCartao.slice(0, 16);
  }

  // Adicionar espaços a cada 4 caracteres
  var numeroFormatado = numeroCartao.replace(/(\d{4})(?=\d)/g, "$1 ");

  var mensagemDiv = document.querySelector("#mensagemValidacaoNumeroCartao");
  var iconeVerificado = document.querySelector("#iconeVerificadoNumeroCartao");

  if (numeroCartao.length === 0) {
    mensagemDiv.innerHTML = "";
    iconeVerificado.style.display = "none";
    res = false;
  } else if (numeroCartao.length < 16) {
    mensagemDiv.innerHTML = "Digite um número de cartão válido.";
    iconeVerificado.style.display = "none";
    res = false;
  } else {
    mensagemDiv.innerHTML = "";
    iconeVerificado.style.display = "block";
    res = true;
  }

  // Atualiza o valor do campo com os espaços
  numeroCartaoInput.value = numeroFormatado;
  return res;
}

// Função para validar a data de validade do cartão
function validarDataValidade(event) {
  let res = false;

  var validadeInput = document.querySelector("#validade");
  var validade = validadeInput.value;

  // Remove caracteres não numéricos do valor do campo
  validade = validade.replace(/\D/g, "");

  // Limita a entrada a 6 caracteres (MM/AAAA)
  if (validade.length > 6) {
    validade = validade.slice(0, 6);
  }

  // Adicionar a barra após os dois primeiros caracteres (MM)
  if (validade.length > 2) {
    validade = validade.slice(0, 2) + "/" + validade.slice(2);
  }

  var mensagemDiv = document.querySelector("#mensagemValidacaoValidade");
  var iconeVerificado = document.querySelector("#iconeVerificadoValidade");

  // Verificar se a data de validade é válida
  var mes = parseInt(validade.slice(0, 2));
  var ano = parseInt(validade.slice(3));

  // Verifica se o comprimento da data de validade é zero
  if (validade.length === 0) {
    mensagemDiv.innerHTML = "";
    iconeVerificado.style.display = "none";
    return;
  }

  // Verifica se o mes e ano estão dentro do intervalo
  if (isNaN(mes) || isNaN(ano) || mes < 1 || mes > 12 || ano < 2023) {
    mensagemDiv.innerHTML = "Digite uma data de validade válida (MM/AAAA).";
    iconeVerificado.style.display = "none";
    res = false;
  } else {
    mensagemDiv.innerHTML = "";
    iconeVerificado.style.display = "block";
    res = true;
  }

  // Atualizar o valor do campo com a barra
  validadeInput.value = validade;

  return res;
}

// Função para validar o campo CVV do cartão
function validarCVV(event) {
  let res = false;

  var cvvInput = document.querySelector("#cvv");
  var cvv = cvvInput.value;

  // Remover caracteres não numéricos do valor do campo
  cvv = cvv.replace(/\D/g, "");

  var mensagemDiv = document.querySelector("#mensagemValidacaoCVV");
  var iconeVerificado = document.querySelector("#iconeVerificadoCVV");

  // Limitar a entrada a 3 caracteres
  if (cvv.length > 3) {
    cvv = cvv.slice(0, 3);
  }

  // Verifica se o comprimento é zero ou menor que 3
  if (cvv.length === 0) {
    mensagemDiv.innerHTML = "";
    iconeVerificado.style.display = "none";
  } else if (cvv.length < 3) {
    mensagemDiv.innerHTML = "CVV inválido";
    iconeVerificado.style.display = "none";
  } else {
    mensagemDiv.innerHTML = "";
    iconeVerificado.style.display = "block";
    res = true;
  }

  // Atualizar o valor do campo
  cvvInput.value = cvv;

  return res;
}

// EventListener para verificações
document
  .querySelector("#nome")
  .addEventListener("input", verificarCamposValidos);

document
  .querySelector("#email")
  .addEventListener("input", verificarCamposValidos);

document
  .querySelector("#nomeCartao")
  .addEventListener("input", verificarCamposValidos);

document
  .querySelector("#numeroCartao")
  .addEventListener("input", verificarCamposValidos);

document
  .querySelector("#validade")
  .addEventListener("input", verificarCamposValidos);

document
  .querySelector("#cvv")
  .addEventListener("input", verificarCamposValidos);

// EventListener para a mudança de um rádio
document
  .querySelectorAll('input[name="flexRadioDefault"]')
  .forEach(function (radio) {
    radio.addEventListener("change", verificarCamposValidos);
  });

// Função para verificar os campos válidos
function verificarCamposValidos() {
  var btnConfirmar = document.querySelector("#btnConfirmar");

  var opcPag = document.querySelector(
    'input[name="flexRadioDefault"]:checked'
  ).value;

  var nomeValido = validarNome();
  var emailValido = validarEmail();
  var nomeCartaoValido = validarNomeCartao();
  var numValido = validarNumeroCartao();
  var dataValido = validarDataValidade();
  var cvvValido = validarCVV();

  if (opcPag === "cartao") {
    if (
      nomeValido &&
      emailValido &&
      nomeCartaoValido &&
      numValido &&
      dataValido &&
      cvvValido
    ) {
      btnConfirmar.style.display = "block";
    } else {
      btnConfirmar.style.display = "none";
    }
  } else {
    if (nomeValido && emailValido) {
      btnConfirmar.style.display = "block";
    } else {
      btnConfirmar.style.display = "none";
    }
  }
}

// Função que mostra a mensagem de pagamento aprovado
function mostrarMensagem() {
  desabilitarElementos();

  // Simulação de status de compra aprovado
  var statusCompraAprovado = true;

  // Verificar se o número do cartão é "0000 0000 0000 0000"
  var numeroCartaoInput = document.querySelector("#numeroCartao");
  var numeroCartao = numeroCartaoInput.value.replace(/\D/g, "");
  if (numeroCartao === "0000000000000000") {
    statusCompraAprovado = false;
  }

  exibirMensagem(statusCompraAprovado);
}

// Exibe mensagem com base no status de compra
// Se a compra for aprovada, exibe mensagem de sucesso
// Se a compra for recusada, exibe mensagem de erro
function exibirMensagem(statusCompraAprovado) {
  var mensagemDiv = document.querySelector(".mensagem");
  var mensagemTexto = document.querySelector(".msg");
  var txt = document.querySelector(".txt");
  var limpar = document.querySelector("#limpar");
  var verPass = document.querySelector("#verPassagem");

  if (statusCompraAprovado) {
    mensagemTexto.textContent = "Pagamento aprovado!";
    mensagemTexto.style.color = "green";
    txt.textContent =
      "Sua passagem foi emitida e enviada para seu endereço de email.";
    limpar.style.display = "none";
    verPass.style.display = "block";
  } else {
    mensagemTexto.textContent = "Pagamento recusado";
    mensagemTexto.style.color = "red";
    txt.innerHTML =
      "Ocorreu um erro ao realizar o pagamento.<br>Por favor, tente novamente.";
    limpar.style.display = "block";
    verPass.style.display = "none";
    limpar.addEventListener("click", function () {
      atualizarPagina();
      limpar.removeEventListener("click", atualizarPagina);
    });
  }

  //exibe a div com a mensagem
  mensagemDiv.style.display = "block";
}

// Função que desabilita e estiliza elementos após a confirmação da compra
function desabilitarElementos() {
  // método de pagamento
  var metodo = document.querySelector(".radio");
  if (metodo) {
    metodo.disabled = true;
    metodo.classList.add("fieldset-desativado");
  }

  // cartão
  var cartao = document.getElementById("f-cartao");
  if (cartao) {
    cartao.disabled = true;
    cartao.classList.add("fieldset-desativado");
  }

  // pix
  var pix = document.getElementById("f-pix");
  if (pix) {
    pix.classList.add("fieldset-desativado");
  }

  // dados do cliente
  var dados = document.querySelector(".dadosCliente");
  if (dados) {
    dados.disabled = true;
    dados.classList.add("fieldset-desativado");
  }

  // esconde o botão de confirmação
  var confirmarButton = document.getElementById("btnConfirmar");
  if (confirmarButton) {
    confirmarButton.style.display = "none";
  }
}

// Evento para mostrar a mensagem ao clicar no botão confirmar
var confirmarButton = document.getElementById("btnConfirmar");
if (confirmarButton) {
  confirmarButton.addEventListener("click", mostrarMensagem);
}

// Função que atualiza a página
function atualizarPagina() {
  location.reload();
}

// Função para formatar data e hora
function formatarDataHora(dataHoraString) {
  const dataHora = new Date(dataHoraString);
  return `${dataHora.toLocaleDateString()} ${dataHora.toLocaleTimeString()}`;
}

// Função para enviar uma requisição PUT para cadastrar um pagamento
function fetchInserirPagamento(body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch("http://localhost:3000/inserirPagamento", requestOptions)
    .then((response) => response.json())
    .catch((error) => {
      // Trata os erros durante a requisição
      showStatusMessage(
        "Erro técnico ao cadastrar pagamento. Contate o suporte.",
        true
      );
      console.log("Falha grave ao cadastrar pagamento." + error);
    });
}

// Função para chamar a rota de alteração de assento
function alterarAssento(referenciaAssento, idAeronave) {
  const ID_AERONAVE = parseInt(idAeronave);

  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      REFERENCIA: referenciaAssento,
      STATUS: "Ocupado",
      ID_AERONAVE: ID_AERONAVE,
    }),
  };

  return fetch("http://localhost:3000/alterarStatusAssento", requestOptions)
    .then((response) => response.json())
    .catch((error) => {
      // Trata os erros durante a requisição
      showStatusMessage(
        "Erro técnico ao alterar o status do assento. Contate o suporte.",
        true
      );
      console.log("Falha grave ao alterar o status do assento." + error);
    });
}

// Função para gerar o pagamento e chamar a rota de alteração de assento
function gerarPagamento() {
  // Método de pagamento
  const metodoPagamento = document.querySelector(
    'input[name="flexRadioDefault"]:checked'
  ).value;

  // Dados do cliente
  const nomeCliente = document.getElementById("nome").value;
  const emailCliente = document.getElementById("email").value;

  const statusPagamento = "Confirmado";

  // Armazena o nome do passageiro no localStorage
  localStorage.setItem("NOME_PASSAGEIRO", nomeCliente);

  // Envia uma requisição para cadastrar o pagamento, usando a função fetchInserirPagamento
  fetchInserirPagamento({
    METODO: metodoPagamento,
    NOME: nomeCliente,
    EMAIL: emailCliente,
    STATUS: statusPagamento,
  }).then((customResponse) => {
    // Trata a resposta da requisição (sucesso ou erro)
    if (customResponse && customResponse.status === "SUCCESS") {
      // Chama a rota de alteração de assento passando a referência do assento selecionado
      const referenciaAssento = localStorage.getItem("assentoSelecionado");
      const INFO_VOO = localStorage.getItem("INFO_VOO");
      if (referenciaAssento) {
        const idAeronave = INFO_VOO.split(",")[7];
        console.log(idAeronave);
        alterarAssento(referenciaAssento, idAeronave).then((response) => {
          if (response && response.status === "SUCCESS") {
            showStatusMessage(
              "Pagamento e status do assento atualizados com sucesso.",
              false
            );
            // Outras ações após o cadastro do pagamento e alteração do assento (se necessário)
          } else {
            showStatusMessage(
              "Erro ao alterar o status do assento: " +
                (response ? response.message : "Erro desconhecido"),
              true
            );
            console.log(response ? response.message : "Erro desconhecido");
          }
        });
      } else {
        showStatusMessage("Referência do assento não encontrada.", true);
      }
    } else {
      showStatusMessage(
        "Erro ao cadastrar pagamento: " +
          (customResponse ? customResponse.message : "Erro desconhecido"),
        true
      );
      console.log(
        customResponse ? customResponse.message : "Erro desconhecido"
      );
    }
  });
}

function Bilhete() {
  window.location.href = "/frontend/src/modules/compra/bilhete.html";
}

// Função para preencher os dados de ida a partir do localStorage
function preencherDadosIda() {
  // Obtém os dados de ida do localStorage
  const dadosString = localStorage.getItem("INFO_VOO");

  // Verifica se existem dados no localStorage
  if (dadosString) {
    const dados = dadosString.split(",");
    const divDadosCompra = document.querySelector("#dados-voos");

    // Criação do container de ida
    const divContainerVoosIda = document.createElement("div");
    divContainerVoosIda.className = "container-voos ida";

    // Criação do container de volta
    const divContainerVoosVolta = document.createElement("div");
    divContainerVoosVolta.className = "container-voos volta";

    // Criação do container de preço
    const divPreco = document.createElement("div");
    divPreco.className = "total";

    divDadosCompra.appendChild(divContainerVoosIda);
    divDadosCompra.appendChild(divContainerVoosVolta);
    divDadosCompra.appendChild(divPreco);

    // Criação dos elementos dentro da divIda
    const divOrigem = document.createElement("div");
    divOrigem.className = "origem-ida";
    divOrigem.innerHTML = `
      <p class="sigla" id="siglaOriIda">${dados[10].toUpperCase()}</p>
      <div>
        <p id="cidOriIda">${dados[12]}</p>
        <p id="paisOriIda">${dados[13]}</p>
      </div>
      <p class="horario" id="dtOriIda">${formatarDataHora(dados[2])}</p>
    `;

    const spanSeta = document.createElement("span");
    spanSeta.className = "material-symbols-outlined seta";
    spanSeta.innerText = "trending_flat";

    const divDestino = document.createElement("div");
    divDestino.className = "destino-ida";
    divDestino.innerHTML = `
      <p class="sigla" id="siglaDestIda">${String(dados[15]).toUpperCase()}</p>
      <p id="cidDestIda">${dados[17]}</p>
      <p id="paisDestIda">${dados[18]}</p>
      <p class="horario" id="dtDestIda">${formatarDataHora(dados[1])}</p>
    `;

    divContainerVoosIda.appendChild(divOrigem);
    divContainerVoosIda.appendChild(spanSeta);
    divContainerVoosIda.appendChild(divDestino);

    // Criação dos elementos dentro da divVolta
    const divOrigemVolta = document.createElement("div");
    divOrigemVolta.className = "origem-volta";
    divOrigemVolta.innerHTML = `
    <p class="sigla" id="siglaDestIda">${String(dados[15]).toUpperCase()}</p>
    <p id="cidDestIda">${dados[17]}</p>
    <p id="paisDestIda">${dados[18]}</p>
    <p class="horario" id="dtDestIda">${formatarDataHora(dados[4])}</p>
    `;

    const spanSetaVolta = document.createElement("span");
    spanSetaVolta.className = "material-symbols-outlined seta";
    spanSetaVolta.innerText = "trending_flat";

    const divDestinoVolta = document.createElement("div");
    divDestinoVolta.className = "destino-volta";
    divDestinoVolta.innerHTML = `
    <p class="sigla" id="siglaOriIda">${dados[10].toUpperCase()}</p>
    <div>
      <p id="cidOriIda">${dados[12]}</p>
      <p id="paisOriIda">${dados[13]}</p>
    </div>
    <p class="horario" id="dtOriIda">${formatarDataHora(dados[3])}</p>
    `;

    divContainerVoosVolta.appendChild(divOrigemVolta);
    divContainerVoosVolta.appendChild(spanSetaVolta);
    divContainerVoosVolta.appendChild(divDestinoVolta);

    // Criando os elementos da divPreco
    const precoElement = document.createElement("div");
    precoElement.className = "preco";
    const preco = parseFloat(dados[8]);
    precoElement.innerText = `R$ ${preco.toFixed(2)}`;

    const pTotal = document.createElement("p");
    pTotal.className = "p-total";
    pTotal.innerHTML = "Total";

    divPreco.appendChild(pTotal);
    divPreco.appendChild(precoElement);

    // Verifica o tipo de viagem na localStorage
    const tipoViagem = localStorage.getItem("tipoViagem");

    // Decide se deve mostrar ou ocultar a div volta
    if (tipoViagem === "ida") {
      // Oculta a div volta
      divContainerVoosVolta.style.display = "none";
    } else if (tipoViagem === "ida_volta") {
      // Mostra a div volta
      divContainerVoosVolta.style.display = "flex";
    }
  }
}

// Chama a função para preencher os dados de ida ao carregar a página
document.addEventListener("DOMContentLoaded", async function () {
  preencherDadosIda();
});
