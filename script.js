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
