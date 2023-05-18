//FUNÇÃO com METODO GET para buscar usuarios já cadastrados
function verificarLogin() {
  const senha = document.getElementById("senha").value;
  const email = document.getElementById("email").value;

  //SET para armazenar email que entrou
  localStorage.setItem("email", email);
  //Fetch e GET para buscar o usuario
  fetch(`usuarios`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      const login = data.find(
        (parametro) => parametro.email === email && parametro.senha === senha
      );

      //verificar se os campos estao vazios
      if (email == "" || senha == "") {
        Swal.fire({
          icon: "error",
          title: "Preencha todos os campos ",
        });
        //verificar se o usuario já existe
      } else if (login) {
        location.href = "home.html";
      } else {
        Swal.fire({
          icon: "error",
          title: "Usuário não encontrado! (email ou senha incorreto(s)",
        });
      }
      //verificando se o email é do ADM
      if (email == "euclidesRamos@gmail.com" && login) {
        location.href = "admPage.html";
      }
    });
}

//FUNÇÃO CADASTRAR com METODO POST
function cadastrar() {
  const email = document.getElementById("email").value,
    senha = document.getElementById("senha").value,
    nome = document.getElementById("nome").value,
    sobrenome = document.getElementById("sobrenome").value,
    telefone = document.getElementById("telefone").value;

  // Obtém todos os elementos(by name) de input do formulário
  var inputs = document.getElementsByName("infoCadastrar");
  var vazios = 0;

  // Loop através de cada input e verifica se está vazio
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].value === "") {
      vazios++;
    }
  }

  // Verifica se há campos vazios e exibe mensagem de erro
  if (vazios > 0) {
    Swal.fire({
      icon: "error",
      title: "Preencha todos os campos ",
    });
    return false;
  } else if (email === "euclidesRamos@gmail.com") {
    Swal.fire({
      icon: "error",
      title: "Não é possível cadastrar com esse email",
    });
  } else {
    fetch(`usuarios`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        senha: senha,
        nome: nome,
        sobrenome: sobrenome,
        telefone: telefone,
      }),
    }).then((response) => response.json());
  }
}

//Puxando informações do usuario que entrou, e aplicando na pagina home
var idLogado = document.getElementById("idLogado"),
  email = document.getElementById("email");
var emailUsuario = localStorage.getItem("email");
email.textContent = `Email: ${emailUsuario}`;

//Código que utiliza fetch e for, para vasculhar todos os usuarios. E descobrir o id
//de acordo com o email logado. depois imprimir
fetch(`usuarios`)
  .then((resposta) => resposta.json())
  .then((data) => {
    pedido = data.orcamento;

    for (var i = 0; i < data.length; i++) {
      if (data[i].email === emailUsuario) {
        idLogado.innerHTML = `ID: ${data[i].id} `;
        return (idLogado = data[i].id);
      }
    }
  });
/////////////
//FUNÇÃO que preenche automaticamente as infos do usuario, na hora do pedido
function preencherForm() {
  fetch(`usuarios/${idLogado}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.getElementById("nomePedido").value = data.nome;
      document.getElementById("sobrenomePedido").value = data.sobrenome;
      document.getElementById("telefonePedido").value = data.telefone;
      document.getElementById("emailPedido").value = data.email;
    });
}

//FUNÇÕES que exibem o formulario do pedido, de acordo com a escolha
function icone() {
  document.getElementById("container-orcamento").style.display = "block";
  document.getElementById("exampleFormControlInput1").value =
    "ILUSTRAÇÃO DE ÍCONE";
  preencherForm();
}
function ilustracao2d() {
  document.getElementById("container-orcamento").style.display = "block";
  document.getElementById("exampleFormControlInput1").value = "ILUSTRAÇÃO 2D";
  preencherForm();
}
function animacao() {
  document.getElementById("container-orcamento").style.display = "block";
  document.getElementById("exampleFormControlInput1").value = "ANIMAÇÃO";
  preencherForm();
}
///////////////////////

//FUNÇÃO  que gera orçamento e prazo do pedido. De forma aleatoria
function gerarOrcamentoePrazo() {
  const descricao = document.getElementById(
      "exampleFormControlTextarea1"
    ).value,
    tipoServico = document.getElementById("exampleFormControlInput1").value;

  let PrecoMin = 30;
  let PrecoMax = 150;
  let gerarPreco =
    Math.floor(Math.random() * (PrecoMax - PrecoMin + 1)) + PrecoMin;

  let gerarPrazo = Math.floor(Math.random() * 6) + 1;

  if (descricao == "") {
    Swal.fire({
      icon: "warning",
      title: "Preencha a descrição do seu pedido",
    });
  } else {
    document.getElementById("prazo").value = `${gerarPrazo} mês(es)`;
    document.getElementById("orcamento").value = ` R$ ${gerarPreco},00`;
    document.getElementById("botaoPedido").style.display = "block";
  }
}

function registrar() {
  Swal.fire({
    title: "Digite sua senha, para confirmar o pedido",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "confirmar",
    showLoaderOnConfirm: true,
    preConfirm: (senha) => {
      fetch(`usuarios/${idLogado}`)
        .then((response) => response.json())
        .then((data) => {
          //Se a senha estiver correta,obtem os valores do pedido
          if (senha === data.senha) {
            const nomePedido = document.getElementById("nomePedido").value,
              sobrenomePedido =
                document.getElementById("sobrenomePedido").value,
              telefonePedido = document.getElementById("telefonePedido").value,
              emailPedido = document.getElementById("emailPedido").value,
              tipoServico = document.getElementById(
                "exampleFormControlInput1"
              ).value,
              descricao = document.getElementById(
                "exampleFormControlTextarea1"
              ).value,
              prazo = document.getElementById("prazo").value,
              orcamento = document.getElementById("orcamento").value;

            ///Aplicaçao dos valores do pedido, nos dados do usuario. Com metodo PUT
            fetch(`usuarios/${idLogado}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                nome: nomePedido,
                sobrenome: sobrenomePedido,
                telefone: telefonePedido,
                email: emailPedido,
                senha: senha,
                tipoServico: tipoServico,
                descricao: descricao,
                prazo: prazo,
                orcamento: orcamento,
              }),
            }).then((response) => response.json());

            //Else caso senha seja invalida
          } else {
            Swal.fire({
              icon: "error",
              title: "Senha inválida...",
            });
          }
        })
        //catch para captar erros
        .catch((error) => {
          Swal.showValidationMessage(`Request failed: ${error}`);
        });
    },
    allowOutsideClick: () => !Swal.isLoading(),
  });
}

//FUNÇÃO de registrar o pedido, utilizando metodo PUT
function registrarPedido() {
  //Fetch que consome o obtem os dados do usuario que logou
  fetch(`usuarios/${idLogado}`)
    .then((response) => response.json())
    .then(async (data) => {
      if (data.orcamento) {
        Swal.fire({
          title: "Já existe um registro de pedido em andamento",
          text: `Deseja continuar e substituir (${data.tipoServico})?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sim,substituir",
        }).then((result) => {
          if (result.isConfirmed) {
            registrar();
          }
        });
      }
      if (data.orcamento == undefined) {
        registrar();
      }
    });
}
