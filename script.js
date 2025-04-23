async function carregarLivros() {
    const livrosLocais = localStorage.getItem('livros');
    if (livrosLocais) {
        return JSON.parse(livrosLocais);
    } else {
        const resposta = await fetch('assets/livros.json');
        let livros = await resposta.json();
        livros = livros.slice(0, 10);
        livros = livros.map(livro => ({ ...livro, imagem: 'assets/livro.png' }));
        localStorage.setItem('livros', JSON.stringify(livros));
        return livros;
    }
}

function renderizarPortifolio(livros) {
    const container = document.getElementById('book-list');
    container.innerHTML = '';
    livros.forEach(livro => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <img src="${livro.imagem || 'assets/livro.png'}" alt="Imagem do livro ${livro.titulo}" class="book-image" />
            <h3>${livro.titulo}</h3>
            <p><strong>Autor:</strong> ${livro.autor}</p>
            <p><strong>Ano:</strong> ${livro.ano}</p>
            <button class="btn-detalhes" data-id="${livro.id}">Ver Detalhes</button>
        `;
        container.appendChild(card);
    });
}

function mostrarModalDetalhes(livro) {
    document.getElementById('modal-detalhes').classList.remove('oculto');
    document.getElementById('detalhes-titulo').textContent = livro.titulo;
    document.getElementById('detalhes-autor').textContent = livro.autor;
    document.getElementById('detalhes-ano').textContent = livro.ano;
    document.getElementById('detalhes-editora').textContent = livro.editora;
    document.getElementById('detalhes-descricao').textContent = livro.descricao;
    document.getElementById('modal-imagem').src = livro.imagem || 'assets/livro.png';
}

function esconderModalDetalhes() {
    document.getElementById('modal-detalhes').classList.add('oculto');
}

function mostrarModalLocacao() {
    document.getElementById('modal-locacao').classList.remove('oculto');
}

function esconderModalLocacao() {
    document.getElementById('modal-locacao').classList.add('oculto');
}

function validarCPF(cpf) {
    const regex = /^\d{11}$/;
    return regex.test(cpf);
}

async function iniciar() {
    const livros = await carregarLivros();
    renderizarPortifolio(livros);

    const selectLivro = document.getElementById('nome-livro');
    selectLivro.innerHTML = '<option value="" disabled selected>Selecione um livro</option>';
    livros.forEach(livro => {
        const option = document.createElement('option');
        option.value = livro.titulo;
        option.textContent = livro.titulo;
        selectLivro.appendChild(option);
    });

    document.getElementById('book-list').addEventListener('click', e => {
        if (e.target.classList.contains('btn-detalhes')) {
            const livroId = e.target.getAttribute('data-id');
            const livro = livros.find(l => l.id === parseInt(livroId));
            if (livro) {
                mostrarModalDetalhes(livro);
            }
        }
    });

    document.getElementById('btn-close-detalhes').addEventListener('click', () => {
        esconderModalDetalhes();
    });

    const modalDetalhes = document.getElementById('modal-detalhes');
    modalDetalhes.addEventListener('click', e => {
        if (e.target === modalDetalhes) {
            esconderModalDetalhes();
        }
    });

    const btnOpenLocacao = document.getElementById('btn-open-locacao');
    if (btnOpenLocacao) {
        btnOpenLocacao.addEventListener('click', () => {
            mostrarModalLocacao();
        });
    }

    const btnCloseLocacao = document.getElementById('btn-close-locacao');
    if (btnCloseLocacao) {
        btnCloseLocacao.addEventListener('click', () => {
            esconderModalLocacao();
        });
    }

    const formLocacao = document.getElementById('form-locacao');
    if (formLocacao) {
        formLocacao.addEventListener('submit', e => {
            e.preventDefault();
            const form = e.target;
            const nomeLivro = form['nome-livro'].value;
            const nomeLocatario = form['nome-locatario'].value.trim();
            const cpf = form['cpf'].value.trim();
            const dataLocacao = form['data-locacao'].value;
            const dataDevolucao = form['data-devolucao'].value;

            if (!validarCPF(cpf)) {
                alert('CPF inválido. Deve conter exatamente 11 dígitos numéricos.');
                return;
            }

            const novaLocacao = {
                id: Date.now(),
                nomeLivro,
                nomeLocatario,
                cpf,
                dataLocacao,
                dataDevolucao
            };

            let locacoes = JSON.parse(localStorage.getItem('locacoes')) || [];
            locacoes.push(novaLocacao);
            localStorage.setItem('locacoes', JSON.stringify(locacoes));

            alert('Locação registrada com sucesso!');
            form.reset();
            esconderModalLocacao();
        });
    }
}

document.addEventListener('DOMContentLoaded', iniciar);