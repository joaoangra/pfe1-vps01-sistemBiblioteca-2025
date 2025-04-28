const main = document.querySelector('main');
var produtos = [];

//Verificar se há algo no localStorage
var carrinho = JSON.parse(localStorage.getItem('carrinho'));
if (carrinho == null) {
    carrinho = [];
}

//Carregar os dados do arquivo JSON
fetch('../assets/dados.json')
    .then(response => response.json())
    .then(data => {
        produtos = data;
    }).
    then(() => {
        exibirCards();
    });

function exibirCards() {
    produtos.forEach((produto, indice) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h2>${produto.nome}</h2>
            <p>${produto.autor}</p>
            <p>${produto.ano}</p>
            <button onclick="mostrarDetalhes(${indice})">Detalhes</button>
        `;
        main.appendChild(card);
    });
}

function mostrarDetalhes(indice) {
    const detalhes = document.getElementById('detalhes');
    const titulo = document.querySelector('#detalhes h2');
    const imagem = document.querySelector('#detalhes img');
    const descricao = document.querySelector('#detalhes .descricao p');
    const autor = document.querySelector('#detalhes .autor p');
    const editora = document.querySelector('#detalhes .editora p');
    const genero = document.querySelector('#detalhes .genero p');
    const ano = document.querySelector('#detalhes .ano p');
    const botao = document.querySelector('#detalhes .rodape button');
    detalhes.classList.remove('oculto');
    titulo.innerHTML = produtos[indice].nome;
    imagem.src = produtos[indice].imagem;
    descricao.innerHTML = produtos[indice].descricao;
    autor.innerHTML = produtos[indice].autor;
    editora.innerHTML = produtos[indice].editora;
    genero.innerHTML = produtos[indice].genero;
    ano.innerHTML = `${produtos[indice].ano}`;
    botao.setAttribute('onclick', `adicionarCarrinho(${indice})`);
}
