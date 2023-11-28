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

async function obterIDsAssentos() {
  try {
    const body = { ID: localStorage.getItem("INFO_VOO")[7] };
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

// Adicione esta função para atualizar as referências dos assentos
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

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const totalAssentos = localStorage.getItem("TOTAL_ASSENTOS");

    const mapaContainer = document.getElementById("gerar-mapa");

    const idsAssentos = await obterIDsAssentos();

    const rows = 7;
    const columns = Math.ceil(totalAssentos / rows);

    for (let row = "A".charCodeAt(0); row < "A".charCodeAt(0) + rows; row++) {
      const fileira = document.createElement("div");
      fileira.className = "fil";

      if (String.fromCharCode(row) === "B") {
        fileira.classList.add("fileiraB");
      }
      if (String.fromCharCode(row) === "E") {
        fileira.classList.add("fileiraE");
      }

      for (let col = 1; col <= columns; col++) {
        const assento = document.createElement("div");
        assento.className = "seat";

        const i = (row - "A".charCodeAt(0)) * columns + col;
        assento.textContent = `${String.fromCharCode(row)}${col}`;

        assento.addEventListener("click", async function () {
          document.querySelectorAll(".seat").forEach(function (seat) {
            seat.classList.remove("selected");
          });

          this.classList.add("selected");
        });

        fileira.appendChild(assento);
        const assentoID = idsAssentos.map((id) => id);
        atualizarReferenciasAssentos(assentoID[i], assento.textContent);
      }

      mapaContainer.appendChild(fileira);
    }
  } catch (error) {
    console.log("Error:", error);
  }
});
