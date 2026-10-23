let musicas = [{
}]

function carregarLista(musicas){
    let listaEl = document.querySelector('#lista');
    listaEl.innerHTML = '';

    for(let i = 1; i < musicas.length; i++){
        let liEl = document.createElement('li');
        listaEl.insertBefore(liEl, listaEl.firstElementChild);

        liEl.innerHTML = '<strong>' + musicas[i].titulo + '</strong>' + '<br>' +  //LEMBRETE: Criar classe pra deixar o título maior
        'Artista: ' + musicas[i].artista + '<br>' +
        'Categoria: ' + musicas[i].categoria + '<br>' +
        'Status: ' + musicas[i].status;
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

    tituloEl.value = '';
    artistaEl.value = '';
    
    tituloEl.focus();

    carregarLista(musicas);
}

let botaoSalvar = document.querySelector('#salvar');
botaoSalvar.addEventListener('click', inserirMusicaNaLista);

