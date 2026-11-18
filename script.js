let perfis = JSON.parse(localStorage.getItem('soundbox_perfis')) || [];
let perfilAtualId = localStorage.getItem('soundbox_perfil_atual');
let categorias = JSON.parse(localStorage.getItem('soundbox_categorias')) || [
    { nome: 'Rock', cor: '#e74c3c' },
    { nome: 'Pop', cor: '#9b59b6' },
    { nome: 'MPB', cor: '#f39c12' },
    { nome: 'Hip Hop', cor: '#3498db' },
    { nome: 'Rap', cor: '#2ecc71' },
    { nome: 'Blues', cor: '#1abc9c' },
    { nome: 'Jazz', cor: '#e67e22' },
    { nome: 'Samba', cor: '#f1c40f' }
];

function salvarCategorias(){
    localStorage.setItem('soundbox_categorias', JSON.stringify(categorias));
}

function atualizarOpcoesCategorias(){
    let selectEl = document.querySelector('#categoria');
    selectEl.innerHTML = '';

    categorias.forEach(function(categoria){
        let opcaoEl = document.createElement('option');
        opcaoEl.value = categoria.nome;
        opcaoEl.textContent = categoria.nome;
        selectEl.appendChild(opcaoEl);
    });
}

function renderizarCategorias(){
    let listaEl = document.querySelector('#lista-categorias');
    listaEl.innerHTML = '';

    categorias.forEach(function(categoria){
        let itemEl = document.createElement('span');
        itemEl.className = 'categoria-item';
        itemEl.textContent = categoria.nome;
        itemEl.style.setProperty('--cor-categoria', categoria.cor);
        listaEl.appendChild(itemEl);
    });
}

function criarCategoria(event){
    event.preventDefault();
    let nomeEl = document.querySelector('#nome-nova-categoria');
    let corEl = document.querySelector('#cor-nova-categoria');
    let nome = nomeEl.value.trim();

    if (!nome || categorias.some(function(categoria){
        return categoria.nome.toLocaleLowerCase() === nome.toLocaleLowerCase();
    })) {
        return;
    }

    categorias.push({ nome: nome, cor: corEl.value });
    categoriasCores[nome] = corEl.value;
    localStorage.setItem('soundbox_categorias_cores', JSON.stringify(categoriasCores));
    salvarCategorias();
    atualizarOpcoesCategorias();
    renderizarCategorias();
    criarBotoesFiltro();
    nomeEl.value = '';
    nomeEl.focus();
}

if (perfis.length === 0) {
    perfis = [{
        id: String(Date.now()),
        nome: 'Meu perfil',
        musicas: JSON.parse(localStorage.getItem('soundbox_musicas')) || []
    }];
    perfilAtualId = perfis[0].id;
}

let perfilAtual = perfis.find(function(perfil){
    return perfil.id === perfilAtualId;
}) || perfis[0];
perfilAtualId = perfilAtual.id;
let musicas = perfilAtual.musicas || [];

function salvarPerfis(){
    perfilAtual.musicas = musicas;
    localStorage.setItem('soundbox_perfis', JSON.stringify(perfis));
    localStorage.setItem('soundbox_perfil_atual', perfilAtualId);
    localStorage.setItem('soundbox_musicas', JSON.stringify(musicas));
}

function atualizarPerfilAtual(){
    let nomeEl = document.querySelector('#perfil-atual-nome');
    nomeEl.textContent = 'Usuário: ' + perfilAtual.nome;
}

function renderizarPerfis(){
    let listaEl = document.querySelector('#lista-perfis');
    listaEl.innerHTML = '';

    perfis.forEach(function(perfil){
        let botaoEl = document.createElement('button');
        botaoEl.type = 'button';
        botaoEl.className = 'btn-secondary perfil-opcao';
        botaoEl.textContent = perfil.nome + (perfil.id === perfilAtualId ? ' (atual)' : '');
        botaoEl.disabled = perfil.id === perfilAtualId;
        botaoEl.addEventListener('click', function(){
            selecionarPerfil(perfil.id);
        });
        listaEl.appendChild(botaoEl);
    });
}

function selecionarPerfil(id){
    perfilAtual.musicas = musicas;
    perfilAtual = perfis.find(function(perfil){
        return perfil.id === id;
    });
    perfilAtualId = perfilAtual.id;
    musicas = perfilAtual.musicas || [];
    perfilAtual.musicas = musicas;
    salvarPerfis();
    atualizarPerfilAtual();
    renderizarPerfis();
    categoriaAtual = 'Todas';
    criarBotoesFiltro();
    filtrarMusicas(categoriaAtual);
    document.querySelector('#resultado-sorteio').innerHTML = '';
    fecharGerenciarPerfis();
}

function criarPerfil(event){
    event.preventDefault();
    let nomeEl = document.querySelector('#nome-novo-perfil');
    let nome = nomeEl.value.trim();

    if (!nome) {
        return;
    }

    let existente = perfis.find(function(perfil){
        return perfil.nome.toLocaleLowerCase() === nome.toLocaleLowerCase();
    });

    if (existente) {
        selecionarPerfil(existente.id);
        nomeEl.value = '';
        return;
    }

    let novoPerfil = {
        id: String(Date.now()) + Math.random().toString(36).slice(2),
        nome: nome,
        musicas: []
    };
    perfis.push(novoPerfil);
    nomeEl.value = '';
    salvarPerfis();
    renderizarPerfis();
    selecionarPerfil(novoPerfil.id);
}

let categoriasCores = JSON.parse(localStorage.getItem('soundbox_categorias_cores')) || {
    'Rock': '#ff4d6d',
    'Pop': '#b44cff',
    'MPB': '#00f0ff',
    'Hip Hop': '#38bdf8',
    'Rap': '#facc15',
    'Blues': '#6366f1',
    'Jazz': '#ec4899',
    'Samba': '#22c55e',
    'Pagode': '#10b981',
    'Xote': '#f97316',
    'Forró': '#eab308',
    'Sertanejo': '#a855f7'
};

Object.keys(categoriasCores).forEach(function(nome){
    if(!categorias.some(function(categoria){ return categoria.nome === nome; })){
        categorias.push({ nome: nome, cor: categoriasCores[nome] });
    }
});

let corSelecionada = '#ff4d6d';
const opcoesCor = document.querySelectorAll('.opcao-cor');
const inputCorOculto = document.querySelector('#cor-categoria');

opcoesCor.forEach(bolinha => {
    bolinha.addEventListener('click', () => {
        opcoesCor.forEach(b => b.style.borderColor = 'transparent');
        bolinha.style.borderColor = 'white';
        
        corSelecionada = bolinha.dataset.cor;
        if(inputCorOculto) {
            inputCorOculto.value = corSelecionada;
        }
    });
});
function carregarLista(musicasArray){
    let listaEl = document.querySelector('#lista');
    listaEl.innerHTML = '';

    for(let i = 0; i < musicasArray.length; i++){
        let liEl = document.createElement('li');
        
        let corCat = categoriasCores[musicasArray[i].categoria] || '#00f0ff';
        liEl.style.borderLeftColor = corCat;

        listaEl.appendChild(liEl);

        liEl.innerHTML = '<strong>' + musicasArray[i].titulo + '</strong>' +
        '<button type="button" class="btn-apagar-musica">X</button><br>' +
        'Artista: ' + musicasArray[i].artista + '<br>' +
        'Categoria: <span style="color:' + corCat + '; font-weight:bold;">' + musicasArray[i].categoria + '</span><br>' +
        'Status: ' + musicasArray[i].status;

        let botaoExcluir = liEl.querySelector('.btn-apagar-musica');
        if(botaoExcluir){
            botaoExcluir.addEventListener('click', function(){
                excluirMusica(musicasArray[i]);
            });
        }
    }
}

function inserirMusicaNaLista(e){
    e.preventDefault();

    let tituloEl = document.querySelector('#titulo');
    if(tituloEl.value.trim().length === 0){
        mostrarMensagem('Título Vazio!', true);
        tituloEl.focus();
        return;
    }

    let artistaEl = document.querySelector('#artista');
    if(artistaEl.value.trim().length === 0){
        mostrarMensagem('Artista Vazio!', true);
        artistaEl.focus();
        return;
    }

    let categoriaEl = document.querySelector('#categoria');
    let corCategoriaEl = document.querySelector('#cor-categoria');
    let statusEl = document.querySelector('#status');

    if(categoriaEl.value && corCategoriaEl) {
        categoriasCores[categoriaEl.value] = corCategoriaEl.value;
        localStorage.setItem('soundbox_categorias_cores', JSON.stringify(categoriasCores));
    }

    let novaMusica = {
        titulo: tituloEl.value,
        artista: artistaEl.value,
        categoria: categoriaEl.value,
        status: statusEl.value
    };

    musicas.push(novaMusica);
    salvarPerfis();

    tituloEl.value = '';
    artistaEl.value = '';
    tituloEl.focus();

    criarBotoesFiltro();
    filtrarMusicas(categoriaAtual);

    mostrarMensagem('Música Adicionada com Sucesso!', false);
    buscarCapa(novaMusica.titulo, novaMusica.artista)
        .then(function(capa){
            novaMusica.capa = capa;
            if (musicas.includes(novaMusica)) {
                salvarPerfis();
                filtrarMusicas(categoriaAtual);
            }
        })
        .catch(function(erro){
            console.error(erro);
        });
}

function mostrarMensagem(texto, ehErro) {
    let mensagem = document.querySelector('#mensagem');
    mensagem.textContent = texto;
    
    if (ehErro) {
        mensagem.classList.add('doMal');
    } else {
        mensagem.classList.remove('doMal');
    }

    mensagem.classList.remove('escondido');

    setTimeout(() => {
        mensagem.classList.add('escondido');
        mensagem.classList.remove('doMal');
    }, 2500);
}

function apagarMusicas(){
    if(confirm("Aviso: Essa ação é irreversível")){
        musicas = [];
        salvarPerfis();
        categoriaAtual = 'Todas';
        criarBotoesFiltro();
        filtrarMusicas(categoriaAtual);
        
        let resultadoDiv = document.getElementById('resultado-sorteio');
        if(resultadoDiv) resultadoDiv.textContent = '';
    }
}

function excluirMusica(musicaExcluida){
    let indice = musicas.indexOf(musicaExcluida);

    if(indice !== -1){
        musicas.splice(indice, 1);
        salvarPerfis();

        carregarLista(musicas);
        criarBotoesFiltro();
        filtrarMusicas(categoriaAtual);

        mostrarMensagem('Item Excluído com Sucesso!', false);
    }
}

function sortearMusica() {
    let resultadoDiv = document.getElementById('resultado-sorteio');

    if (musicas.length === 0) {
        resultadoDiv.textContent = "⚠️ Cadastre pelo menos uma música antes de sortear!";
        return;
    }

    let indiceAleatorio = Math.floor(Math.random() * musicas.length);
    let musicaSorteada = musicas[indiceAleatorio];

    resultadoDiv.innerHTML = `🎉 Sugestão para ouvir agora:<br><strong>${musicaSorteada.titulo}</strong> - ${musicaSorteada.artista} <em>(${musicaSorteada.categoria})</em>`;
}

function gerenciarPerfis() {
    let modal = document.querySelector('#modal-perfil');
    modal.classList.remove('escondido');
    renderizarPerfis();
}

function fecharGerenciarPerfis() {
    let modal = document.querySelector('#modal-perfil');
    modal.classList.add('escondido');
}

function clicouForaModal(event) {
    let modal = document.querySelector('#modal-perfil');
    if (event.target === modal) {
        fecharGerenciarPerfis();
    }
}

function fecharModalESC(event){
    if(event.key === 'Escape'){
        fecharGerenciarPerfis();
    }
}

function buscarCapa(titulo, artista){
    let termo = encodeURIComponent(titulo + ' ' + artista);
    let url = 'https://itunes.apple.com/search?media=music&entity=song&limit=1&term=' + termo;

    return fetch(url)
        .then(function(resposta){
            if(!resposta.ok){
                throw new Error('Erro na busca da capa: ' + resposta.status);
            }
            return resposta.json();
        })
        .then(function(dados){
            if(dados.resultCount === 0){
                return null;
            }
            return dados.results[0].artworkUrl100;
        });
}

let categoriaAtual = 'Todas';

function filtrarMusicas(categoria){
    categoriaAtual = categoria;

    let botoes = document.querySelectorAll('.btn-filtro');
    for(let i = 0; i < botoes.length; i++){
        botoes[i].classList.toggle('ativo', botoes[i].dataset.categoria === categoria);
    }

    if(categoria === 'Todas'){
        carregarLista(musicas);
        return;
    }

    let musicasFiltradas = musicas.filter(function(musica){
        return musica.categoria === categoria;
    });

    carregarLista(musicasFiltradas);
}

function criarBotoesFiltro(){
    let filtrosEl = document.querySelector('#filtros');
    filtrosEl.innerHTML = '';

    let nomesCategorias = ['Todas'].concat(categorias.map(function(categoria){
        return categoria.nome;
    }));

    for(let i = 0; i < nomesCategorias.length; i++){
        let botaoEl = document.createElement('button');
        botaoEl.type = 'button';
        botaoEl.className = 'btn-filtro';
        botaoEl.textContent = nomesCategorias[i];
        botaoEl.dataset.categoria = nomesCategorias[i];

        let categoria = categorias.find(function(item){
            return item.nome === nomesCategorias[i];
        });
        if(categoria){
            botaoEl.style.setProperty('--cor-categoria', categoriasCores[categoria.nome] || categoria.cor);
        }

        if(nomesCategorias[i] === categoriaAtual){
            botaoEl.classList.add('ativo');
        }

        botaoEl.addEventListener('click', function(){
            filtrarMusicas(nomesCategorias[i]);
        });

        filtrosEl.appendChild(botaoEl);
    }
}

let formularioMusica = document.querySelector('#form-musica');
if (formularioMusica) {
    formularioMusica.addEventListener('submit', inserirMusicaNaLista);
}

let botaoApagar = document.querySelector('#limpar-tudo');
if (botaoApagar) {
    botaoApagar.addEventListener('click', apagarMusicas);
}

let botaoSortear = document.querySelector('#btn-sortear');
if (botaoSortear) {
    botaoSortear.addEventListener('click', sortearMusica);
}

criarBotoesFiltro();
filtrarMusicas(categoriaAtual);

let botaoPerfil = document.querySelector('#btn-trocar-perfil');
if(botaoPerfil){
    botaoPerfil.addEventListener('click', gerenciarPerfis);
}

let botaoFechar = document.querySelector('#btn-modal');
if(botaoFechar){
    botaoFechar.addEventListener('click', fecharGerenciarPerfis);
}

let formularioPerfil = document.querySelector('#form-perfil');
if(formularioPerfil){
    formularioPerfil.addEventListener('submit', criarPerfil);
}

let formularioCategoria = document.querySelector('#form-categoria');
if(formularioCategoria){
    formularioCategoria.addEventListener('submit', criarCategoria);
}

let modalPerfil = document.querySelector('#modal-perfil');
if(modalPerfil){
    modalPerfil.addEventListener('click', function(event){
        if(event.target === modalPerfil){
            fecharGerenciarPerfis();
        }
    });
}

document.addEventListener('keydown', function(event){
    if(event.key === 'Escape'){
        fecharGerenciarPerfis();
        document.querySelector('#modal-sobre').classList.add('escondido');
    }
});

let modalSobre = document.querySelector('#modal-sobre');
document.querySelector('#btn-sobre').addEventListener('click', function(){
    modalSobre.classList.remove('escondido');
});
document.querySelector('#btn-fechar-sobre').addEventListener('click', function(){
    modalSobre.classList.add('escondido');
});
modalSobre.addEventListener('click', function(event){
    if(event.target === modalSobre){
        modalSobre.classList.add('escondido');
    }
});

salvarPerfis();
atualizarPerfilAtual();
renderizarPerfis();
salvarCategorias();
atualizarOpcoesCategorias();
renderizarCategorias();
