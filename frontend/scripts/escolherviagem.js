// Função que faz uma requisição para obter a lista de viagens
function requestListaDeViagens(body) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body,
  };
  return fetch("http://localhost:3000/listarViagens", requestOptions).then(
    (T) => T.json()
  );
}

// Função para exibir as viagens após receber a resposta da requisição
function exibirViagens() {
  //faz a requisição da lista de viagens
  requestListaDeViagens(localStorage.getItem("payload"))
    .then((customResponse) => {
      if (customResponse.status === "SUCCESS") {
        // chama a função para prencheer os voos
        preencherVoos(customResponse.payload);
        console.log(customResponse.payload);
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      console.log("Não foi possível exibir." + e);
    });
}

// Função para preencher os voos disponiveis
function preencherVoos(dados) {
  const voosDisponiveis = document.getElementById("voos-disponiveis");

  for (let i = 0; i < dados.length; i++) {
    const voo = dados[i];

    // Criação do container de voos
    const divContainerVoos = document.createElement("div");
    divContainerVoos.className = `container-voos ${voo[5]}`;

    // Criação dos elementos dentro do container
    const divOrigem = document.createElement("div");
    divOrigem.className = "origem";
    divOrigem.innerHTML = `
      <p class="sigla" id="siglaOri${voo[5]}">${voo[10].toUpperCase()}</p>
      <div>
        <p id="cidOri${voo[5]}">${voo[12]}</p>
        <p id="paisOri${voo[5]}">${voo[13]}</p>
      </div>
      <p class="horario" id="dtOri${voo[5]}">${formatarDataHora(voo[1])}</p>
    `;

    const spanSeta = document.createElement("span");
    spanSeta.className = "material-symbols-outlined seta";
    spanSeta.innerText = " trending_flat ";

    const divDestino = document.createElement("div");
    divDestino.className = "destino";
    divDestino.innerHTML = `
      <p class="sigla" id="siglaDest${voo[5]}">${String(
      voo[15]
    ).toUpperCase()}</p>
      <p id="cidDest${voo[5]}">${voo[17]}</p>
      <p id="paisDest${voo[5]}">${voo[18]}</p>
      <p class="horario" id="dtDest${voo[5]}">${formatarDataHora(voo[2])}</p>
    `;

    const divComprar = document.createElement("div");
    divComprar.className = "comprar";
    const divPreco = document.createElement("div");
    divPreco.className = "preco";
    divPreco.innerText = `R$ ${voo[8].toFixed(2)}`;

    const buttonComprar = document.createElement("button");
    buttonComprar.id = "comprar";
    buttonComprar.innerText = "Comprar";
    buttonComprar.type = "button";
    buttonComprar.onclick = function () {
      buscarAssentos(voo);
    };

    // Adiciona os elementos criados à estrutura
    divComprar.appendChild(divPreco);
    divComprar.appendChild(buttonComprar);

    divContainerVoos.appendChild(divOrigem);
    divContainerVoos.appendChild(spanSeta);
    divContainerVoos.appendChild(divDestino);
    divContainerVoos.appendChild(divComprar);

    voosDisponiveis.appendChild(divContainerVoos);
  }
}

// Função auxiliar para formatar data e hora
function formatarDataHora(dataString) {
  const data = new Date(dataString);

  const dia = adicionarZero(data.getDate());
  const mes = adicionarZero(data.getMonth() + 1);
  const ano = data.getFullYear();

  const hora = adicionarZero(data.getHours());
  const minuto = adicionarZero(data.getMinutes());

  // retorna a data no formato dd/mm/yyyy hh:mm
  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

// Função para adicionar um zero à esquerda, se necessário
function adicionarZero(numero) {
  return numero < 10 ? `0${numero}` : numero;
}

// Função que faz uma requisição para obter o total de assentos
function requestTotalAssentos(body) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return fetch("http://localhost:3000/totalAssentos", requestOptions).then(
    (T) => T.json()
  );
}

// Função para buscar informações sobre os assentos disponíveis para um determinado voo
function buscarAssentos(voo) {
  requestTotalAssentos({ vooData: voo })
    .then((customResponse) => {
      if (customResponse.status === "SUCCESS") {
        localStorage.setItem("TOTAL_ASSENTOS", customResponse.payload);
        localStorage.setItem("INFO_VOO", voo);
        window.location.href = "/frontend/src/modules/mapa/mapa-assentos.html";
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      console.log("Não foi possível exibir." + e);
    });
}

// Evento que aguarda o carregamento completo do DOM antes de chamar a função exibirViagens
document.addEventListener("DOMContentLoaded", async function () {
  exibirViagens();
});
