// Função que faz uma requisição para gerar uma referencia do assento
function requestRefAssento(body) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return fetch("http://localhost:3000/gerarReferencia", requestOptions).then(
    (T) => T.json()
  );
}

// Função que faz uma requisição para obter os ids dos assentos
function requestObterIDs(body) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return fetch("http://localhost:3000/obterIDs", requestOptions).then((T) =>
    T.json()
  );
}

// Função assincrona para obter os ids dos assentos
async function obterIDsAssentos() {
  const infoVooString = localStorage.getItem("INFO_VOO");

  // Dividir a string usando a vírgula como separador
  const infoVooArray = infoVooString.split(',');

  // Obter o valor desejado (no caso, o valor no índice 7)
  const assentoID = infoVooArray[7];

  try {
    const body = { ID: assentoID };
    const resultado = await requestObterIDs(body);

    if (resultado.status === "SUCCESS") {
      return resultado.payload;
    } else {
      console.error("Erro ao obter IDs dos assentos:", resultado.message);
      return []; // Retorna um array vazio em caso de erro
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    return []; // Retorna um array vazio em caso de erro
  }
}

// Função que atualiza as referencias dos assentos
async function atualizarReferenciasAssentos(idAeronave, referenciasAssentos) {
  try {
    const body = { ID: idAeronave, REFERENCIA: referenciasAssentos };
    const resultado = await requestRefAssento(body);

    if (resultado.status === "SUCCESS") {
      console.log("Referências dos assentos atualizadas com sucesso.");
    } else {
      console.error(
        "Erro ao atualizar referências dos assentos:",
        resultado.message
      );
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}

// evento para criar o mapa de assentos
document.addEventListener("DOMContentLoaded", async function () {
  try {
    // obtem o total de assentos
    const totalAssentos = localStorage.getItem("TOTAL_ASSENTOS");

    const mapaContainer = document.getElementById("gerar-mapa");

    // obtem o id dos assentos
    const idsAssentos = await obterIDsAssentos();

    // Define o número de linhas e colunas no mapa de assentos
    const rows = 7;
    const columns = Math.ceil(totalAssentos / rows);

    // Loop para criar as fileiras e assentos
    for (let row = "A".charCodeAt(0); row < "A".charCodeAt(0) + rows; row++) {
      const fileira = document.createElement("div");
      fileira.className = "fil";

      // Adiciona classes especiais para as fileiras B e E
      if (String.fromCharCode(row) === "B") {
        fileira.classList.add("fileiraB");
      }
      if (String.fromCharCode(row) === "E") {
        fileira.classList.add("fileiraE");
      }

      // Loop para criar os assentos em cada fileira
      for (let col = 1; col <= columns; col++) {
        const assento = document.createElement("div");
        assento.className = "seat";

        const seatIndex = (row - "A".charCodeAt(0)) * columns + col;
        assento.textContent = `${String.fromCharCode(row)}${col}`;

        // Evento de clique para marcar o assento selecionado
        assento.addEventListener("click", async function () {
          document.querySelectorAll(".seat").forEach(function (seat) {
            seat.classList.remove("selected");
          });

          // Adiciona a classe "selected" ao assento clicado
          this.classList.add("selected");
        });

        fileira.appendChild(assento);
        
        // Verifica se o índice é válido antes de acessar o array
        if (seatIndex < idsAssentos.length) {
          const assentoID = idsAssentos[seatIndex];
          console.log(assentoID);
          atualizarReferenciasAssentos(assentoID, assento.textContent);
        }
      }

      // Adiciona a fileira ao mapa
      mapaContainer.appendChild(fileira);
    }
  } catch (error) {
    console.log("Error:", error);
  }
});
