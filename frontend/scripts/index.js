// Função para fazer uma requisição da lista de trechos
function requestListaDeTrechosViagem(body) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return fetch(
    "http://localhost:3000/listarTrechosViagem",
    requestOptions
  ).then((T) => T.json());
}

// Função para buscar viagens com base em origem e destino
function BuscarViagens() {
  const origem = document.getElementById("floatingInput").value;
  const destino = document.getElementById("floatingPassword").value;
  const dataIda = document.getElementById("floatingIda").value;
  const dataVolta = document.getElementById("floatingVolta").value;

  // Armazena as datas no Local Storage para uso posterior
  localStorage.setItem("dataIda", dataIda);
  localStorage.setItem("dataVolta", dataVolta);

  // Obtém o valor do tipo de viagem selecionado
  const tipoViagem = document.querySelector(
    'input[name="inlineRadioOptions"]:checked'
  ).value;

  // Armazena o tipo de viagem no Local Storage
  if (tipoViagem === "1") {
    // Se for "1", armazena como "ida_volta"
    localStorage.setItem("tipoViagem", "ida_volta");
  } else if (tipoViagem === "2") {
    // Se for "2", armazena como "ida"
    localStorage.setItem("tipoViagem", "ida");
  }

  // requisição para listar os trechos de viagem
  requestListaDeTrechosViagem({ ORIGEM: origem, DESTINO: destino })
    .then((customResponse) => {
      if (customResponse.status === "SUCCESS") {
        console.log("Payload:" + JSON.stringify(customResponse.payload));
        localStorage.setItem("payload", JSON.stringify(customResponse.payload));
        window.location.href =
          "/frontend/src/modules/compra/escolherviagem.html";
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      console.log("Não foi possível exibir." + e);
    });
}
