let musicas = [{
    /*titulo: undefined,
      artista: undefined,
      categoria: undefined,
      status: undefined */
}]

function carregarLista(musicas){
    let listaEl = document.querySelector('#lista');
    listaEl.innerHTML = '';

    for(let i = 0; i < musicas.length; i++){
        let liEl = createElement('li')
        listaEl.appendChild(liEl);
        liEl.innerHTML = musicas[i].titulo + '<br>'; //LEMBRETE: DEIXAR TIULO COM UM TAMANHO MAIOR
        liEl.innerHTML += 'Artista: ' + musicas[i].artista + '<br>';
        liEl.innerHTML += 'Categoria: ' + musicas[i].categoria + '<br>';
        liEl.innerHTML += 'Status: ' + musicas[i].status;
    }
}

function inserirMusicaNaLista(){
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

    tituloEl.value = '';
    artistaEl.value = '';
    
    tituloEl.focus();

    carregarLista(musicas);
}

let botaoSalvar = document.querySelector('#submit');
botaoSalvar.addEventListener('click', inserirMusicaNaLista);