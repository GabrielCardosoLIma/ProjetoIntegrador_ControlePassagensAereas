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
