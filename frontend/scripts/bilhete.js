function formatarData(dataString) {
  const data = new Date(dataString);
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return data.toLocaleDateString("pt-BR", options);
}

function formatarHorario(dataString) {
  const data = new Date(dataString);
  const options = { hour: "2-digit", minute: "2-digit" };
  return data.toLocaleTimeString("pt-BR", options);
}

function preencherBilhete() {
  // Recuperar os dados do localStorage
  const assentoSelecionado = localStorage.getItem("assentoSelecionado");
  const nomePassageiro = localStorage.getItem("NOME_PASSAGEIRO");
  const infoVoo = localStorage.getItem("INFO_VOO");

  // Verificar se os dados estão presentes no localStorage
  if (assentoSelecionado && nomePassageiro && infoVoo) {
    // Converter a string INFO_VOO em um objeto (se necessário)
    const dadosVoo = infoVoo.split(",");

    // Preencher os campos do HTML com as informações do localStorage
    document.querySelector(".nome p:last-child").innerText = nomePassageiro;
    document.querySelector(".assento p:last-child").innerText =
      assentoSelecionado;
    document.querySelector(".data p:last-child").innerText = formatarData(
      dadosVoo[1]
    );
    document.querySelector(".origem .dados p:nth-child(1)").innerText =
      dadosVoo[10].toUpperCase();
    document.querySelector(".origem .dados p:nth-child(2)").innerText =
      dadosVoo[12];
    document.querySelector(".origem .dados p:last-child").innerText =
      dadosVoo[13];
    document.querySelector(".hora p:last-child").innerText = formatarHorario(
      dadosVoo[2]
    );
    document.querySelector(".destino .dados p:nth-child(1)").innerText = String(
      dadosVoo[15]
    ).toUpperCase();
    document.querySelector(".destino .dados p:nth-child(2)").innerText =
      dadosVoo[17];
    document.querySelector(".destino .dados p:last-child").innerText =
      dadosVoo[18];
  } else {
    console.error("Dados não encontrados no localStorage");
  }
}

function preencherBilheteVolta() {
  // Recuperar os dados do localStorage
  const assentoSelecionado = localStorage.getItem("assentoSelecionado");
  const nomePassageiro = localStorage.getItem("NOME_PASSAGEIRO");
  const infoVoo = localStorage.getItem("INFO_VOO");

  // Verificar se os dados estão presentes no localStorage
  if (assentoSelecionado && nomePassageiro && infoVoo) {
    // Converter a string INFO_VOO em um objeto (se necessário)
    const dadosVoo = infoVoo.split(",");

    // Preencher os campos do HTML com as informações do localStorage
    document.querySelector(".nome-volta p:last-child").innerText =
      nomePassageiro;
    document.querySelector(".assento-volta p:last-child").innerText =
      assentoSelecionado;
    document.querySelector(".data-volta p:last-child").innerText = formatarData(
      dadosVoo[3]
    );
    document.querySelector(".origem-volta .dados p:nth-child(1)").innerText =
      dadosVoo[15].toUpperCase();
    document.querySelector(".origem-volta .dados p:nth-child(2)").innerText =
      dadosVoo[17];
    document.querySelector(".origem-volta .dados p:last-child").innerText =
      dadosVoo[18];
    document.querySelector(".hora-volta p:last-child").innerText =
      formatarHorario(dadosVoo[4]);
    document.querySelector(".destino-volta .dados p:nth-child(1)").innerText =
      String(dadosVoo[10]).toUpperCase();
    document.querySelector(".destino-volta .dados p:nth-child(2)").innerText =
      dadosVoo[12];
    document.querySelector(".destino-volta .dados p:last-child").innerText =
      dadosVoo[13];
  } else {
    console.error("Dados não encontrados no localStorage");
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  preencherBilhete();
});

// Verifica o tipo de viagem na localStorage
const tipoViagem = localStorage.getItem("tipoViagem");
const divVolta = document.querySelector(".volta");

// Decide se deve mostrar ou ocultar a div volta
if (tipoViagem === "ida") {
  document.addEventListener("DOMContentLoaded", async function () {
    divVolta.style.display = "none";
  });
} else {
  preencherBilheteVolta();
}
