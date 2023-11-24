class Tecla{
    constructor(x, y, ancho, alto, tecla){
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.tecla = tecla;
        this.animacion = [[0,0], [71,0]];
        this.tamañoSpriteAncho = TAMAÑOANCHOSPRITETECLA;
        this.tamañoSpriteAlto = TAMAÑOALTOSPRITETECLA;
        this.contadorTrampa = 0;
        this.pulsada = false;
    }
}

class Nota{
    constructor(x, y, teclaNumeroArray, imagenNota){
        this.x = x;
        this.y = y;
        this.teclaNumeroArray = teclaNumeroArray;
        this.sonido = sonidosTeclas[this.teclaNumeroArray];
        this.imagenNota = imagenNota;
        this.alto = TAMAÑOALTONOTA;
        this.ancho = TAMAÑOANCHO;
        this.acertada = false;
    }

    sonar(){
        this.sonido.currentTime = 0;
        this.sonido.play();
    }
}

// Colores Verde, Rojo y Amarillo
let colores = ['#00ff00', '#ff0000', '#f6ff00'];

//Tamaño de las notas y de las teclas del teclado, junto a los sprites de las teclas
const TAMAÑOALTO = 120, TAMAÑOANCHO = 80;
const TAMAÑOALTOSPRITETECLA = 200, TAMAÑOANCHOSPRITETECLA = 70;
const TAMAÑOALTONOTA = TAMAÑOALTO - 20;
//Zona inicial donde se empieza a dibujar el teclado
const ZONAINICIALX = 90; ZONAY = 320;
const TAMAÑOALTOCANVAS = 500, TAMAÑOANCHOCANVAS = 600;
//Zona del eje y de donde salen las notas
const ZONASALIDANOTASY = -150;
//Claves de las teclas que se usan para el teclado
const TECLA_S = 83, TECLA_D = 68, TECLA_G = 71, TECLA_H = 72, TECLA_J = 74;
const PUNTOSPORACIERTO = 150;
//Esto son los valores de la barra que muestra "tu vida", el aumento es para mostrarlo en una barra
//al multiplicarlo por el valor de "vida" que tienes
const POSICIONXVIDA = 30, POSICIONYVIDA = ZONAY, AUMENTOMOSTRARVIDA = -2, ANCHOMOSTRARVIDA = 30;
const POSICIONXFONDOVIDA = POSICIONXVIDA - 3, POSICIONYFONDOVIDA = ZONAY - 215, ALTOFONDOVIDA = 230,
ANCHOFONDOVIDA = ANCHOMOSTRARVIDA + 6;
//MARGENACIERTO es lo que divide al tamaño de la tecla, para solo permitir el acierto hasta que la
//nota llegue a la mitad de la tecla, si se pulsa mas tarde no puede acertarse la nota
const ZONACONTARFALLO = 400, MARGENACIERTO = 2;
const RECORDSMAXIMOS = 3;
let contenedorRecord;
let parrafoRecord;
let htmlPuntuacion, htmlMultiplicador, htmlRacha, htmlDificultadElegida;
let contenedorIntroducirNombre, botonCambioNombre, botonMostrarRecords;
let barraIntroducirNombre;
let nombreJugador;
let puntuacion = 0, multiplicador = 1, racha = 0, vida;
let ctx, canvas, teclas, id, cancionElegida, canciones, numeroTecla = 0;
let velocidadNotas;
let botonComenzar, botonesDificultad;
let imagenesTeclas = [];
let imagenesNotas = [];
let imagenFondoVida;
let imagenVictoria;
let imagenVictoriaRecord;
let imagenDerrota;
let sonidoVictoria = new Audio('sounds/CancionPasada.mp3');
let sonidoDerrota = new Audio('sounds/Gameover.mp3');
let sonidosTeclas = 
[new Audio('sounds/NotaVerde.mp3'), 
new Audio('sounds/NotaRoja.mp3'), 
new Audio('sounds/NotaAmarilla.mp3'),
new Audio('sounds/NotaAzul.mp3'),
new Audio('sounds/NotaNaranja.mp3')];
let bateriaFondo = new Audio('sounds/Bateria.wav');
bateriaFondo.loop = true;
bateriaFondo.volume = 0.3;

function calcularDiferenciaTeclas(anterior) {
    let espacio = 5;
    let salida;
    salida = espacio + anterior + TAMAÑOANCHO;

    return salida;
}

function crearTeclado() {
    let salida = [];
    for (let i = 0; i < imagenesTeclas.length; i++) {
        if(i != 0){
            salida[i] = new Tecla(calcularDiferenciaTeclas(salida[i-1].x), ZONAY, TAMAÑOANCHO, TAMAÑOALTO, imagenesTeclas[i]);
        }else{
            salida[i] = new Tecla(ZONAINICIALX, ZONAY, TAMAÑOANCHO, TAMAÑOALTO, imagenesTeclas[i]);
        }
    }
    return salida;
}

function importarImagenes() {
    imagenFondoVida = new Image();
    imagenFondoVida.src = "images/otros/fondoBarraVida.png";
    imagenVictoria = new Image();
    imagenVictoria.src = "images/otros/Victoria.png";
    imagenVictoriaRecord = new Image();
    imagenVictoriaRecord.src = "images/otros/VictoriaRecord.png";
    imagenDerrota = new Image();
    imagenDerrota.src = "images/otros/Derrota.png";
    for (let i = 0; i < 5; i++) {
        imagenesTeclas[i] = new Image();
        imagenesNotas[i] = new Image();
    }
    imagenesTeclas[0].src = "images/teclas/TeclaVerde.png";
    imagenesTeclas[1].src = "images/teclas/TeclaRoja.png";
    imagenesTeclas[2].src = "images/teclas/TeclaAmarilla.png";
    imagenesTeclas[3].src = "images/teclas/TeclaAzul.png";
    imagenesTeclas[4].src = "images/teclas/TeclaNaranja.png";
    imagenesNotas[0].src = "images/notas/notaVerde.png";
    imagenesNotas[1].src = "images/notas/notaRoja.png";
    imagenesNotas[2].src = "images/notas/notaAmarilla.png";
    imagenesNotas[3].src = "images/notas/notaAzul.png";
    imagenesNotas[4].src = "images/notas/notaNaranja.png";
}

function pintarTeclado(teclas) {
    let posicionSprite;
    for (let i = 0; i < teclas.length; i++) {
        if(teclas[i].pulsada){
            posicionSprite = 1;
        }else{
            posicionSprite = 0;
        }
        ctx.drawImage(teclas[i].tecla, 
            teclas[i].animacion[posicionSprite][0], 
            teclas[i].animacion[posicionSprite][1], 
            teclas[i].tamañoSpriteAncho, 
            teclas[i].tamañoSpriteAlto, 
            teclas[i].x, 
            teclas[i].y, 
            teclas[i].ancho, 
            teclas[i].alto);

    }
}

function teclaPulsada(evt) {
    switch (evt.keyCode) {
        case TECLA_S:
            numeroTecla = 0;
            break;
        case TECLA_D:
            numeroTecla = 1;
            break;
        case TECLA_G:
            numeroTecla = 2;
            break;
        case TECLA_H:
            numeroTecla = 3;
            break;
        case TECLA_J:
            numeroTecla = 4;
            break;
        default:
            numeroTecla = -1;
            break;
    }
    if(numeroTecla != -1){
        teclas[numeroTecla].contadorTrampa++;
        if (teclas[numeroTecla].contadorTrampa > 1){
            teclas[numeroTecla].pulsada = false;
        }else{
            teclas[numeroTecla].pulsada = true;
        }
    }
}

function teclaSoltada(evt) {
    switch (evt.keyCode) {
        case TECLA_S:
            numeroTecla = 0;
            break;
        case TECLA_D:
            numeroTecla = 1;
            break;
        case TECLA_G:
            numeroTecla = 2;
            break;
        case TECLA_H:
            numeroTecla = 3;
            break;
        case TECLA_J:
            numeroTecla = 4;
            break;
        default:
            break;
    }
    if(numeroTecla != -1){
        teclas[numeroTecla].pulsada = false;
        teclas[numeroTecla].contadorTrampa = 0;
    }
}

function pintarVida() {
    ctx.drawImage(imagenFondoVida, POSICIONXFONDOVIDA, POSICIONYFONDOVIDA, ANCHOFONDOVIDA, ALTOFONDOVIDA);
    if(vida <= 30){
        ctx.fillStyle = colores[1];
    }else if(vida > 30 && vida <= 60 ){
        ctx.fillStyle = colores[2];
    }else{
        ctx.fillStyle = colores[0];
    }
    ctx.fillRect(POSICIONXVIDA, POSICIONYVIDA, ANCHOMOSTRARVIDA, (vida * AUMENTOMOSTRARVIDA));
}

function calcularRacha() {
    if(racha <= 10){
        multiplicador = 1
    }else if(racha > 10 && racha <= 20){
        multiplicador = 2;
    }else if(racha > 10 && racha <= 20){
        multiplicador = 2;
    }else if(racha > 20 && racha <= 30){
        multiplicador = 3;
    }else{
        multiplicador = 4;
    }
}

function moverNotas() {
    ctx.clearRect(0 , 0, TAMAÑOANCHOCANVAS, TAMAÑOALTOCANVAS);
    pintarVida();
    calcularRacha();
    htmlPuntuacion.innerHTML = puntuacion.toString().padStart(6, '0');
    htmlMultiplicador.innerHTML = multiplicador + 'x';
    htmlRacha.innerHTML = racha;
    pintarTeclado(teclas);
    if(cancionElegida.length === 0 || vida <= 0){
        ctx.clearRect(0 , 0, TAMAÑOANCHOCANVAS, TAMAÑOALTOCANVAS);
        cancionElegida = [];
        terminarCancion();
        clearInterval(id);
    }
    cancionElegida.forEach(nota => {
        if(!nota.acertada){
            nota.y += 2;
            ctx.drawImage(nota.imagenNota, nota.x, nota.y, nota.ancho, nota.alto);
        }
        for (let i = 0; i < teclas.length; i++) {
            if(nota.x === teclas[i].x){
                comprobarAcierto(nota, teclas[i]);
            }
        }
        if(nota.acertada || ((nota.y > ZONACONTARFALLO) && !nota.acertada)){
            if(nota.acertada){
                nota.sonar();
                puntuacion += (PUNTOSPORACIERTO * multiplicador);
                racha++;
                vida += 5;
                if(vida > 100){
                    vida = 100;
                }
            }else{
                vida -= 10;
                racha = 0;
            }
            cancionElegida.shift();
        }
    });
}

function comprobarAcierto(nota, tecla) {
    if (nota.y >= (tecla.y) && nota.y <= (tecla.y + (tecla.alto/MARGENACIERTO))) {
        if (tecla.pulsada) {
            nota.acertada = true;
        }
    }
}

function iniciarJuego() {
    borrarTextoRecords();
    sonidoDerrota.pause();
    sonidoVictoria.pause();
    botonComenzar.setAttribute('disabled', 'true');
    for (let i = 0; i < botonesDificultad.length; i++) {
        botonesDificultad[i].setAttribute('disabled', 'true');
    }
    vida = 50;
    puntuacion = 0;
    multiplicador = 1;
    racha = 0;
    pintarTeclado(teclas);
    htmlPuntuacion.innerHTML = puntuacion;
    htmlMultiplicador.innerHTML = multiplicador + 'x';
    htmlRacha.innerHTML = racha;
    bateriaFondo.currentTime = 0;
    bateriaFondo.play();
    id = setInterval(moverNotas, velocidadNotas);
}


function elegirCancion(dificultad) {
    borrarTextoRecords();
    let cancion;
    switch (dificultad) {
        case 'cancionFacil':
            cancion = cancionFacil;
            htmlDificultadElegida.innerHTML = 'Facil';
            velocidadNotas = 500/24;
            break;
        case 'cancionMedia':
            cancion = cancionMedia;
            htmlDificultadElegida.innerHTML = 'Media';
            velocidadNotas = 150/24;
            break;
        case 'cancionDificil':
            cancion = cancionDificil;
            htmlDificultadElegida.innerHTML = 'Dificil';
            velocidadNotas = 100/24;
            break;
        default:
            break;
    }
    cancionElegida = [];
    for (let i = 0; i < cancion.cancion.length; i++) {
        cancionElegida.push(new Nota(teclas[cancion.cancion[i][0]].x, 
            ZONASALIDANOTASY - (TAMAÑOALTO * cancion.cancion[i][1]), cancion.cancion[i][0],
            imagenesNotas[cancion.cancion[i][0]]));
    }
    botonComenzar.removeAttribute('disabled');
}

function terminarCancion() { 
    bateriaFondo.pause();
    if(vida <= 0){
        console.log('Has perdido');
        sonidoDerrota.currentTime = 0;
        sonidoDerrota.play();
        ctx.drawImage(imagenDerrota, 0, 0, TAMAÑOANCHOCANVAS, TAMAÑOALTOCANVAS);
    }else{
        let nuevoRecord;
        console.log('Cancion terminada, Puntuacion: ' + puntuacion);
        sonidoVictoria.currentTime = 0;
        sonidoVictoria.play();
        nuevoRecord = intentarCrearRecord(puntuacion);
        if(nuevoRecord){
            ctx.drawImage(imagenVictoriaRecord, 0, 0, TAMAÑOANCHOCANVAS, TAMAÑOALTOCANVAS);
        }else{
            ctx.drawImage(imagenVictoria, 0, 0, TAMAÑOANCHOCANVAS, TAMAÑOALTOCANVAS);
        }
    }
    for (let i = 0; i < botonesDificultad.length; i++) {
        botonesDificultad[i].removeAttribute('disabled');
    }
    htmlDificultadElegida.innerHTML = '';
    htmlPuntuacion.innerHTML = '';
    htmlMultiplicador.innerHTML = '';
    htmlRacha.innerHTML = '';
}

function intentarCrearRecord(puntuacion) {
    let devolucion = false;
    let record = localStorage.getItem("record" + htmlDificultadElegida.innerHTML) != null ?
    localStorage.getItem("record" + htmlDificultadElegida.innerHTML) : 'NRY-000000' ;
    let puntosRecord = parseInt(record.substring(record.length - 6));
    if(puntosRecord === 0 || puntuacion > puntosRecord){
        localStorage.setItem("record" + htmlDificultadElegida.innerHTML,
        nombreJugador + '-' + puntuacion.toString().padStart(6, '0'));
        devolucion = true;
    }
    return devolucion;
}

function borrarTextoRecords() {
    while(contenedorRecord.firstChild) {
        contenedorRecord.firstChild.innerHTML = '';
        contenedorRecord.removeChild(contenedorRecord.firstChild);
    }
}


function mostrarRecords() {
    borrarTextoRecords();


    if(htmlDificultadElegida.innerHTML != ''){
        let record;
        if(localStorage.getItem("record" + htmlDificultadElegida.innerHTML) === null){
            record = document.createTextNode('Record Cancion ' + 
            htmlDificultadElegida.innerHTML + ' : NRY-000000');
            parrafoRecord.appendChild(record);
            contenedorRecord.appendChild(parrafoRecord);
        }else{
            record = document.createTextNode('Record Cancion ' + 
            htmlDificultadElegida.innerHTML + ' : '  + 
            localStorage.getItem("record" + htmlDificultadElegida.innerHTML));
            parrafoRecord.appendChild(record);
            contenedorRecord.appendChild(parrafoRecord);
        }
    }else{
        let texto = document.createTextNode('No has elegido una dificultad');
        parrafoRecord.appendChild(texto);
        contenedorRecord.appendChild(parrafoRecord);
    }
}
function recogerNombre() {
    barraIntroducirNombre = contenedorIntroducirNombre.getElementsByTagName('input')[0];

    if(barraIntroducirNombre.value === ''){
        alert('No se admite un nombre vacio');
    }else{
        nombreJugador = barraIntroducirNombre.value;
        for (let i = 0; i < botonesDificultad.length; i++) {
            botonesDificultad[i].removeAttribute('disabled');
        }
        botonMostrarRecords.removeAttribute('disabled');
        contenedorIntroducirNombre.setAttribute('hidden', 'true');
        botonCambioNombre.removeAttribute('hidden');
    }

}

function cambiarNombre() {
    for (let i = 0; i < botonesDificultad.length; i++) {
        botonesDificultad[i].setAttribute('disabled', 'true');
    }
    
    botonMostrarRecords.setAttribute('disabled', 'true')
    contenedorIntroducirNombre.removeAttribute('hidden');
    botonCambioNombre.setAttribute('hidden', 'true');

}




window.onload = function() {
    htmlPuntuacion = document.getElementById('puntuacion');
    htmlMultiplicador = document.getElementById('multiplicador');
    htmlRacha = document.getElementById('racha');
    botonComenzar = document.getElementById('comenzar');
    botonComenzar.setAttribute('disabled', 'true');
    botonMostrarRecords = document.getElementById('mostrarRecords');
    botonMostrarRecords.setAttribute('disabled', 'true');
    botonesDificultad = document.getElementById('dificultades').getElementsByTagName('button');
    for (let i = 0; i < botonesDificultad.length; i++) {
        botonesDificultad[i].setAttribute('disabled', 'true');
    }
    htmlDificultadElegida = document.getElementById('dificultadElegida');
    canvas = document.getElementById('canvas');
    contenedorRecord = document.getElementById('record');
    botonCambioNombre = document.getElementById('cambioNombre');
    contenedorIntroducirNombre = document.getElementById('zonaIntroducirNombre');
    
    parrafoRecord = document.createElement('p');

    ctx = canvas.getContext('2d');
    document.addEventListener("keydown", teclaPulsada, false);
    document.addEventListener("keyup", teclaSoltada, false);
    importarImagenes();
    teclas = crearTeclado();
}