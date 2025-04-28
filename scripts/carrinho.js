fetch('../assets/dados.json')
  .then(res => res.json())
  .then(produtos => {
    const select = document.getElementById("livro");
    produtos.forEach(produto => {
      const opt = document.createElement("option");
      opt.value = produto.id;
      opt.textContent = produto.nome;
      select.appendChild(opt);
    });
  })
  const form = document.querySelector("form");
  const cpfInput = document.getElementById("cpf");
  const cpfErro = document.getElementById("cpfErro");

  form.addEventListener("submit", function (e) {
    const cpf = cpfInput.value;
    if (!/^\d{11}$/.test(cpf)) {
      e.preventDefault();
      cpfErro.textContent = "O CPF deve conter exatamente 11 números sem pontos ou traços.";
      cpfErro.style.color = "red";
    } else {
      cpfErro.textContent = "";
    }
  });

// Cadastro
const cadastro = document.querySelector('header form');
const tcorpo = document.querySelector('main tbody');
const listaArmazenada = JSON.parse(window.localStorage.getItem('contatos'));

if(!listaArmazenada){
    window.localStorage.setItem('contatos', JSON.stringify([]));
    alert('Esta página armazena dados sensíveis!');
    listaArmazenada = [];
}else{
    preencherTabela();
}

cadastro.addEventListener('submit', async e =>{
    e.preventDefault();
    const novoRegistro = {
        nome: cadastro.nome.value,
        cpf: cadastro.cpf.value,
        datainicio: cadastro.datainicio.value,
        datadevolucao: cadastro.datadevolucao.value,
        livro: cadastro.livro.value
    };
    listaArmazenada.push(novoRegistro);
    await preencherTabela();
    await salvar();
});

async function preencherTabela(){
    tcorpo.innerHTML = '';
    listaArmazenada.forEach((c, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.nome}</td>
            <td>${c.cpf}</td>
            <td>${c.datainicio}</td>
            <td>${c.datadevolucao}</td>
            <td>${c.livro}</td>
            <td>
                <button class="btn btn-danger" onclick="excluir(${i})">-</button>
            </td>
        `;
        tcorpo.appendChild(tr);
    });
}

async function salvar(){
    window.localStorage.setItem('contatos', JSON.stringify(listaArmazenada));
}

function excluir(i){
    if(confirm('Deseja realmente excluir?')){
        listaArmazenada.splice(i, 1);
        preencherTabela();
        salvar();
    }
}