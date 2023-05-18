//Codigo para front-end. Exibe containers de atualizar ou excluir usuario
const radio = document.getElementsByName("btnradio"),
  divDeletar = document.getElementById("divDeletar"),
  containerAtualizar = document.getElementById("containerAtualizar");

radio[0].addEventListener("change", function () {
  if (radio[0].checked) {
    divDeletar.style.display = "block";
    containerAtualizar.style.display = "none";
  }
});

radio[1].addEventListener("change", function () {
  if (radio[1].checked) {
    containerAtualizar.style.display = "block";
    divDeletar.style.display = "none";
  }
});
/////////////

//FUNÇÃO para buscar um usuario, com metodo GET
function buscarUsuario() {
  //obtendo valor da pesquisa
  var idParaAtualizar = document.getElementById("idParaBusca").value;

  //fetch que consome os dados dos usuarios
  fetch(`usuarios/`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      //constante find, para procurar o usuario buscado, com id ou email
      const localizarUsuario = data.find(
        (user) => user.email == idParaAtualizar || user.id == idParaAtualizar
      );

      //Caso usuario exista, exibe suas infos nos inputs
      if (localizarUsuario) {
        document.getElementById("nome").value = localizarUsuario.nome;
        document.getElementById("sobrenome").value = localizarUsuario.sobrenome;
        document.getElementById("telefone").value = localizarUsuario.telefone;
        document.getElementById("email").value = localizarUsuario.email;
        document.getElementById("senha").value = localizarUsuario.senha;
        document.getElementById("idForm").value = localizarUsuario.id;
        document.getElementById("botaoAtualizar").style.display = "block";
        document.getElementById("inputsAtualizar").style.display = "block";

        //else para caso não exista
      } else {
        Swal.fire({
          icon: "error",
          title: "Usuário não encontrado!",
        });
      }
      //Verificando se esse usario já tem um pedido cadastrado
      if (localizarUsuario.orcamento) {
        //Exibição das infos desse pedido
        document.getElementById("formAtualizar").style.display = "block";
        document.getElementById("servico").value = localizarUsuario.tipoServico;
        document.getElementById("prazo").value = localizarUsuario.prazo;
        document.getElementById("orcamento").value = localizarUsuario.orcamento;
        document.getElementById("descricao").value = localizarUsuario.descricao;

        //Caso não há pedido, não exibe o container de um pedido
      } else {
        document.getElementById("formAtualizar").style.display = "none";
      }
    });
}

//FUNÇÃO de atualizar usuario, com metodo PUT
//Obtendo as infos exibidas desse usuario
function atualizarUsuario() {
  //let que armazenar o indice id desse usuario
  let idParaAtualizar = document.getElementById("idParaBusca").value;

  const nome = document.getElementById("nome").value,
    sobrenome = document.getElementById("sobrenome").value,
    telefone = document.getElementById("telefone").value,
    email = document.getElementById("email").value,
    senha = document.getElementById("senha").value,
    servico = document.getElementById("servico").value,
    prazo = document.getElementById("prazo").value,
    orcamento = document.getElementById("orcamento").value,
    descricao = document.getElementById("descricao").value,
    idForm = document.getElementById("idForm").value;

  if (idParaAtualizar == 1 || email == "euclidesRamos@gmail.com") {
    Swal.fire({
      icon: "error",
      title: "Não é possível atualizar adm",
    });
  } else {
    //Fetch com metodo PUT, que atualiza o id em questao
    fetch(`usuarios/${idForm}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: nome,
        sobrenome: sobrenome,
        telefone: telefone,
        email: email,
        senha: senha,
        tipoServico: servico,
        prazo: prazo,
        orcamento: orcamento,
        descricao: descricao,
      }),
    }).then((response) => response.json());
  }
}

function deletarUsuario() {
  const idDeletar = document.getElementById("idDeletar").value;
  fetch(`usuarios`)
    .then((resposta) => resposta.json())
    .then((data) => {
      const usuarioEncontrado = data.find(
        (objeto) => objeto.id == idDeletar || objeto.email == idDeletar
      );
      if (idDeletar == 1 || idDeletar =="euclidesRamos@gmail.com") {
        Swal.fire({
          icon: "error",
          title: "Não é possível deletar adm",
        });
      } else if (usuarioEncontrado) {
        Swal.fire({
          title: "Deseja realmente deletar este usuário?",
          text: `${usuarioEncontrado.nome} ${usuarioEncontrado.sobrenome} / email: ${usuarioEncontrado.email}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sim, deletar",
        }).then((result) => {
          if (result.isConfirmed) {
            fetch(`usuarios/${usuarioEncontrado.id}`, {
              method: "DELETE",
            });
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Usuário não encontrado!",
        });
      }
    });
}

//Fetch, com metodo GET. Que obtem todos os usarios e cria novos elementos html. De CARDS
//Tambem é aplicada classes boostrap em cada elemento html
//A quantidade de cards é reliva a quantidade de usuarios
fetch(`usuarios`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    //Container do html, que é utilizado para a impressao dos users
    const containerUsuarios = document.getElementById("containerUsuarios");

    //Criacao de div (boostrap,  para cards)
    let row = document.createElement("div");
    row.classList.add("row");

    for (i = 0; i < data.length; i++) {
      let card = document.createElement("div");
      card.classList.add("card");

      let cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      let nomeCard = document.createElement("h5");
      nomeCard.innerText = `${data[i].nome}, ${data[i].sobrenome}`;
      nomeCard.classList.add("card-title");

      let listaCard = document.createElement("ul");
      listaCard.classList.add("list-group");

      let idCard = document.createElement("li");
      idCard.innerText = `Id: ${data[i].id}`;
      idCard.classList.add("list-group-item");

      let telefoneCard = document.createElement("li");
      telefoneCard.innerText = `Telefone: ${data[i].telefone}`;
      telefoneCard.classList.add("list-group-item");

      let emailCard = document.createElement("li");
      emailCard.innerText = `Email: ${data[i].email}`;
      emailCard.classList.add("list-group-item");

      let pedidoCard = document.createElement("h6");
      pedidoCard.classList.add("card-title");

      let col = document.createElement("div");
      col.classList.add("col-4");

      card.appendChild(cardBody);
      cardBody.appendChild(nomeCard);

      card.appendChild(listaCard);
      listaCard.appendChild(idCard);
      listaCard.appendChild(telefoneCard);
      listaCard.appendChild(emailCard);
      listaCard.appendChild(pedidoCard);

      col.appendChild(card);
      row.appendChild(col);
      containerUsuarios.appendChild(row);

      if (data[i].orcamento) {
        let descricaoCard = document.createElement("li");
        descricaoCard.classList.add("list-group-item");
        let prazoCard = document.createElement("li");
        prazoCard.classList.add("list-group-item");
        let orcamentoCard = document.createElement("li");
        orcamentoCard.classList.add("list-group-item");

        pedidoCard.innerText = `Pedido: ${data[i].tipoServico}`;
        descricaoCard.innerText = `Descrição: ${data[i].descricao}`;
        prazoCard.innerText = `Prazo: ${data[i].prazo}`;
        orcamentoCard.innerText = `Orçamento: ${data[i].orcamento}`;

        listaCard.appendChild(descricaoCard);
        listaCard.appendChild(prazoCard);
        listaCard.appendChild(orcamentoCard);
      } else {
        pedidoCard.innerText = ` Nenhum Pedido registrado`;
      }
    }
  });
