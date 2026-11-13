let musicas = JSON.parse(localStorage.getItem('soundbox_musicas')) || [];

function carregarLista(musicasArray){
    let listaEl = document.querySelector('#lista');
    listaEl.innerHTML = '';

    for(let i = 0; i < musicasArray.length; i++){
        let liEl = document.createElement('li');
        listaEl.appendChild(liEl);

        liEl.innerHTML = '<strong>' + musicasArray[i].titulo + '</strong><br>' +
        'Artista: ' + musicasArray[i].artista + '<br>' +
        'Categoria: ' + musicasArray[i].categoria + '<br>' +
        'Status: ' + musicasArray[i].status;
    }
}

function inserirMusicaNaLista(e){
    e.preventDefault();

    let tituloEl = document.querySelector('#titulo');
    let artistaEl = document.querySelector('#artista');
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

    buscarCapa(novaMusica.titulo, novaMusica.artista)
        .then(function(capa){
            novaMusica.capa = capa;
            localStorage.setItem('soundbox_musicas', JSON.stringify(musicas));
            filtrarMusicas(categoriaAtual);
        })
        .catch(function(erro){
            console.error(erro);
        });
}

function salvarMusicas(){
    localStorage.setItem('soundbox_musicas_salvas', JSON.stringify(musicas));

    let mensagem = document.querySelector('#mensagem');
    mensagem.innerHTML = 'Músicas Salvas com Sucesso!';
    mensagem.classList.remove('escondido');

    setTimeout(() => {
        mensagem.classList.add('escondido');
    }, 2500);
}

function carregarMusicas(){
    let musicasSalvas = JSON.parse(localStorage.getItem('soundbox_musicas_salvas'));

    let mensagem = document.querySelector('#mensagem');

    if (!musicasSalvas) {
        mensagem.innerHTML = 'Nenhuma lista salva encontrada!';
        mensagem.classList.remove('escondido');

        setTimeout(() =>{
             mensagem.classList.add('escondido')
        }, 2500);
        return;
    }

    musicas = musicasSalvas;

    localStorage.setItem('soundbox_musicas', JSON.stringify(musicas));

    carregarLista(musicas);

    mensagem.innerHTML = 'Lista Carregada com Sucesso!';
    mensagem.classList.remove('escondido');

    setTimeout(() => {
        mensagem.classList.add('escondido');
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
        if(resultadoDiv) resultadoDiv.innerHTML = '';
    }
}

function sortearMusica() {
    let resultadoDiv = document.getElementById('resultado-sorteio');

    if (musicas.length === 0) {
        resultadoDiv.innerHTML = "⚠️ Cadastre pelo menos uma música antes de sortear!";
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
    document.addEventListener('keydown', fecharModalESC)
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


let formulario = document.querySelector('#form-musica');
if (formulario) {
    formulario.addEventListener('submit', inserirMusicaNaLista);
}

let botaoSalvar = document.querySelector('#salvar-musicas')
if(botaoSalvar){
    botaoSalvar.addEventListener('click', salvarMusicas);
}

let botaoCarregar = document.querySelector('#carregar-musicas');
if(botaoCarregar){
    botaoCarregar.addEventListener('click', carregarMusicas);
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
