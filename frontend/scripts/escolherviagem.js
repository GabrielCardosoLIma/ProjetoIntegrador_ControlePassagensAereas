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

// Função para formatar a data do voo sem o horário
function formatarDataVoo(dataVoo) {
  const data = new Date(dataVoo);
  const ano = data.getFullYear();
  const mes = (data.getMonth() + 1).toString().padStart(2, "0");
  const dia = data.getDate().toString().padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

// Função para preencher os voos disponiveis
function preencherVoos(dados) {
  // Criação da seção voos-disponiveis
  const sectionVoosDisponiveis = document.createElement("section");
  sectionVoosDisponiveis.className = "voos-disponiveis";

  for (let i = 0; i < dados.length; i++) {
    const voo = dados[i];

    // Criação da div container-voos
    const divContainerVoos = document.createElement("div");
    divContainerVoos.className = "container-voos";

    // Criação da div ida
    const divIda = document.createElement("div");
    divIda.className = "ida";

    // Criação da div origem e destino dentro da div ida
    const divOrigemIda = document.createElement("div");
    divOrigemIda.className = "origem";
    divOrigemIda.innerHTML = `
      <p class="sigla" id="siglaOri${voo[5]}">${voo[10].toUpperCase()}</p>
      <div>
        <p id="cidOri${voo[5]}">${voo[12]}</p>
        <p id="paisOri${voo[5]}">${voo[13]}</p>
      </div>
      <p class="horario" id="dtOri${voo[5]}">${formatarDataHora(voo[1])}</p>
    `;

    const divDestinoIda = document.createElement("div");
    divDestinoIda.className = "destino";
    divDestinoIda.innerHTML = `
      <p class="sigla" id="siglaDest${voo[5]}">${String(voo[15]).toUpperCase()}</p>
      <p id="cidDest${voo[5]}">${voo[17]}</p>
      <p id="paisDest${voo[5]}">${voo[18]}</p>
      <p class="horario" id="dtDest${voo[5]}">${formatarDataHora(voo[2])}</p>
    `;

    // Adiciona div origem e destino à div ida
    divIda.appendChild(divOrigemIda);
    divIda.appendChild(divDestinoIda);

    // Criação da div volta
    const divVolta = document.createElement("div");
    divVolta.className = "volta";

    // Criação da div origem e destino dentro da div volta
    const divOrigemVolta = document.createElement("div");
    divOrigemVolta.className = "origem";
    divOrigemVolta.innerHTML = `
      <p class="sigla" id="siglaOriVolta${voo[5]}">${voo[15].toUpperCase()}</p>
      <div>
        <p id="cidOriVolta${voo[5]}">${voo[17]}</p>
        <p id="paisOriVolta${voo[5]}">${voo[18]}</p>
      </div>
      <p class="horario" id="dtOriVolta${voo[5]}">${formatarDataHora(voo[4])}</p>
    `;

    const divDestinoVolta = document.createElement("div");
    divDestinoVolta.className = "destino";
    divDestinoVolta.innerHTML = `
      <p class="sigla" id="siglaDestVolta${voo[5]}">${voo[10].toUpperCase()}</p>
      <p id="cidDestVolta${voo[5]}">${voo[12]}</p>
      <p id="paisDestVolta${voo[5]}">${voo[13]}</p>
      <p class="horario" id="dtDestVolta${voo[5]}">${formatarDataHora(voo[3])}</p>
    `;

    // Adiciona div origem e destino à div volta
    divVolta.appendChild(divOrigemVolta);
    divVolta.appendChild(divDestinoVolta);

    // Criação da div comprar
    const divComprar = document.createElement("div");
    divComprar.className = "comprar";

    // Criação da div preco e do botão dentro da div comprar
    const divPreco = document.createElement("div");
    divPreco.className = "preco";
    divPreco.innerText = `R$ ${voo[8].toFixed(2)}`;

    const buttonComprar = document.createElement("button");
    buttonComprar.className = 'btn-comprar'
    buttonComprar.id = `comprar${i}`; // Utiliza um ID único para cada botão
    buttonComprar.innerText = "Comprar";
    buttonComprar.type = "button";
    buttonComprar.onclick = function () {
      buscarAssentos(voo);
    };

    // Adiciona div preco e botão à div comprar
    divComprar.appendChild(divPreco);
    divComprar.appendChild(buttonComprar);

    // Adiciona div ida, volta e comprar à div container-voos
    divContainerVoos.appendChild(divIda);
    divContainerVoos.appendChild(divVolta);
    divContainerVoos.appendChild(divComprar);

    // Adiciona div container-voos à seção voos-disponiveis
    sectionVoosDisponiveis.appendChild(divContainerVoos);

    // Verifica o tipo de viagem na localStorage
    const tipoViagem = localStorage.getItem("tipoViagem");

    // Decide se deve mostrar ou ocultar a div volta
    if (tipoViagem === "ida") {
      // Oculta a div volta
      divVolta.style.display = "none";
    } else if (tipoViagem === "ida_volta") {
      // Mostra a div volta
      divVolta.style.display = "flex";
    }

  }

  // Adiciona a seção voos-disponiveis à main
  const mainElement = document.querySelector("main");
  mainElement.appendChild(sectionVoosDisponiveis);
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
