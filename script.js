let musicas = JSON.parse(localStorage.getItem('soundbox_musicas')) || [];
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
function carregarLista(musicasArray){
    let listaEl = document.querySelector('#lista');
    listaEl.innerHTML = '';

    for(let i = 0; i < musicasArray.length; i++){
        let liEl = document.createElement('li');
        listaEl.appendChild(liEl);

        liEl.innerHTML = '<strong>' + musicasArray[i].titulo + '</strong>' +
        '<button type="button" class="btn-apagar-musica">X</button><br>' +
        'Artista: ' + musicasArray[i].artista + '<br>' +
        'Categoria: ' + musicasArray[i].categoria + '<br>' +
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
    let statusEl = document.querySelector('#status');

    let novaMusica = {
        titulo: tituloEl.value,
        artista: artistaEl.value,
        categoria: categoriaEl.value,
        status: statusEl.value
    };

    musicas.push(novaMusica);
    localStorage.setItem('soundbox_musicas', JSON.stringify(musicas));

    tituloEl.value = '';
    artistaEl.value = '';
    tituloEl.focus();

    criarBotoesFiltro();
    filtrarMusicas(categoriaAtual);

    mostrarMensagem('Música Adicionada com Sucesso!', false);
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
        localStorage.removeItem('soundbox_musicas');
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
        localStorage.setItem('soundbox_musicas', JSON.stringify(musicas));

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

    modal.addEventListener('click', clicouForaModal);
    document.addEventListener('keydown', fecharModalESC);
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

    let categorias = ['Todas'];
    for(let i = 0; i < musicas.length; i++){
        if(!categorias.includes(musicas[i].categoria)){
            categorias.push(musicas[i].categoria);
        }
    }

    for(let i = 0; i < categorias.length; i++){
        let botaoEl = document.createElement('button');
        botaoEl.type = 'button';
        botaoEl.className = 'btn-filtro';
        botaoEl.textContent = categorias[i];
        botaoEl.dataset.categoria = categorias[i];

        if(categorias[i] === categoriaAtual){
            botaoEl.classList.add('ativo');
        }

        botaoEl.addEventListener('click', function(){
            filtrarMusicas(categorias[i]);
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
