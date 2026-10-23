let musicas = [{
    /*titulo: undefined,
      artista: undefined,
      categoria: undefined,
      status: undefined */
}]

function carregarLista(){

}

function inserirMusicaNaLista(){
    let titulo = document.querySelector('#titulo').value;
    let artista = document.querySelector('#artista').value;
    let categoria = document.querySelector('#categoria').value;
    let status = document.querySelector('#status').value;

    let novaMusica = {
        titulo: titulo,
        artista: artista,
        categoria: categoria,
        status: status
    };

    musicas.push(novaMusica);

    titulo.value = '';
    artista.value = '';
    
    titulo.focus();

    carregarLista();
}

let botaoSalvar = document.querySelector('#submit');
botaoSalvar.addEventListener('click', inserirMusicaNaLista);