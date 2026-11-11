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

    carregarLista(musicas);
}

function apagarMusicas(){
    if(confirm("Aviso: Essa ação é irreversível")){
        musicas = [];
        localStorage.removeItem('soundbox_musicas');
        carregarLista(musicas);
        
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

function gerenciarPerfis(event) {
    event?.stopPropagation();
    let modal = document.querySelector('#modal-perfil');
    modal.classList.remove('escondido');

    modal.addEventListener('click', clicouForaModal(event));
}

function fecharGerenciarPerfis() {
    let modal = document.querySelector('#modal-perfil');
    modal.classList.add('escondido');
}

function clicouForaModal(event){
    let modal = document.querySelector('#modal-perfil');

    if (!document.contains(event.target)) {
        return;
    }

    if(modal && !modal.contains(event.target)){
        fecharGerenciarPerfis();
    }
}

let categoriaAtual = 'Todas';

function filtrarMusicas(categoria){
    categoriaAtual = categoria;

    if(categoria === 'Todas'){
        carregarLista(musicas);
        return;
    }

    let musicasFiltradas = musicas.filter(function(musica){
        return musica.categoria === categoria;
    });

    carregarLista(musicasFiltradas);
}


let formulario = document.querySelector('#form-musica');
if (formulario) {
    formulario.addEventListener('submit', inserirMusicaNaLista);
}

let botaoApagar = document.querySelector('#limpar-tudo');
if (botaoApagar) {
    botaoApagar.addEventListener('click', apagarMusicas);
}

let botaoSortear = document.querySelector('#btn-sortear');
if (botaoSortear) {
    botaoSortear.addEventListener('click', sortearMusica);
}

carregarLista(musicas);

let botaoPerfil = document.querySelector('#btn-trocar-perfil');
if(botaoPerfil){
    botaoPerfil.addEventListener('click', gerenciarPerfis);
}

let botaoFechar = document.querySelector('#btn-modal');
if(botaoFechar){
    botaoFechar.addEventListener('click', fecharGerenciarPerfis);
}
