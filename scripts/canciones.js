
class Cancion{
    //Distancia maxima hace referencia al multiplicador de distancia que cogera en el script
    //Main para saber en que posicion Y pondra la nota
    constructor(notas, distanciaMaxima, conDecimales){
        this.cancion = crearPartitura(notas, distanciaMaxima, conDecimales);
    }
}


function generarPosicionesNotas(cantidad) {
    let devolucion = [];
    for (let i = 0; i < cantidad; i++) {
        devolucion[i] = Math.floor(Math.random() * 5);
    }
    return devolucion;
}

function generarPosicionesDePentagramaDeNotas(cantidad, distancia, conDecimales) {
    let distanciaMaxima = cantidad * distancia;
    let posiciones = [];
    if(conDecimales){
        for (let i = 0; i < cantidad; i++) {
            let numero;
            do {
                numero = Math.floor(Math.random() * distanciaMaxima) - 0.8;    
            } while (posiciones.includes(numero));
            posiciones.push(numero);
        }
    }else{
        for (let i = 0; i < cantidad; i++) {
            let numero;
            do {
                numero = Math.floor(Math.random() * distanciaMaxima);    
            } while (posiciones.includes(numero));
            posiciones.push(numero);
        }
    }
    //Lo que hago es que ordene las posiciones de mayor a menor, aun que suene tonto, al trabajar con posiciones
    //negativas en main hace que me cueste darle vueltas a veces
    posiciones.sort((a, b) => a - b);
    return posiciones;
}

function crearPartitura(notas, distanciaMaxima, conDecimales) {
    //Por posicion me refiero a que tecla va a ir la nota
    let posicionNotas = generarPosicionesNotas(notas);
    let distanciaNotas = generarPosicionesDePentagramaDeNotas(notas, distanciaMaxima, conDecimales);
    let partitura = [];
    for (let i = 0; i < posicionNotas.length; i++) {
        partitura[i] = [];
        partitura[i][0] = posicionNotas[i];
    }
    
    for (let i = 0; i < distanciaNotas.length; i++) {
        partitura[i][1] = distanciaNotas[i];
    }
    return partitura;
}

let cancionFacil = new Cancion(60, 1.5, false);
let cancionMedia = new Cancion(100, 1.2, false);
let cancionDificil = new Cancion(140, 1, true);


let cancionPrueba = [
[1, 0],
[0, 3],
[2, 5],
[3, 6],
[4, 8],
[1, 10],
[4, 10.5]];