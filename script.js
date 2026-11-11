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
