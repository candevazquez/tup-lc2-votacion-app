const tipoEleccion = 1;
const tipoRecuento = 1;
var datosFiltrados = [];
var valorAño;
var valorCargo;
var valorDistrito;
var valorSeccion;
var datosFiltradosAño = [];
var distrito;
var cargo;
var msjIncompleto;
var msjError;
var msjExito;
var titulo;
var subtitulo;
var eleccion;
var titYSub;
var pagina = document.getElementById('body');
var data;
var textoDistrito;
var enviar = document.getElementById('boton-enviar');


var colorAgrupaciones = {
    0: { colorPleno: 'rgb(252, 210, 0)', colorLiviano: 'rgba(252, 210, 0, 0.3)' },
    1: { colorPleno: 'rgb(0, 169, 232)', colorLiviano: 'rgba(0, 169, 232, 0.3)' },
    2: { colorPleno: 'rgb(171, 40, 40)', colorLiviano: 'rgba(171, 40, 40, 0.3)' },
    3: { colorPleno: 'rgb(112, 76, 159)', colorLiviano: 'rgba(112, 76, 159, 0.5)' },
    4: { colorPleno: 'rgb(77, 46, 110)', colorLiviano: 'rgba(77, 46, 110, 0.5)' },
    5: { colorPleno: 'rgb(128, 128, 128)', colorLiviano: 'rgba(128, 128, 128, 0.5)' },
    6: { colorPleno: 'rgb(102, 171, 60)', colorLiviano: 'rgba(102, 171, 60, 0.5)' },
    7: { colorPleno: 'rgb(255, 0, 0)', colorLiviano: 'rgba(255, 0, 0, 0.5)' },
    8: { colorPleno: 'rgb(0, 255, 0)', colorLiviano: 'rgba(0, 255, 0, 0.5)' },
    9: { colorPleno: 'rgb(0, 0, 255)', colorLiviano: 'rgba(0, 0, 255, 0.5)' },
    10: { colorPleno: 'rgb(169, 169, 169)', colorLiviano: 'rgba(169, 169, 169, 0.5)' }
};







// Realizar la solicitud a la API
async function coneccion() {
    const url = "https://resultados.mininterior.gob.ar/api/menu/periodos";

    try { //para tratar conectarnos a la url await espera fetch para conectarse 
        const respuesta = await fetch(url);

        if (respuesta.ok) {
            //fuciono
            const data = await respuesta.json();
            var combo = document.getElementById("año");


            for (i = 0; i < data.length; i++) {
                const option = document.createElement("option");
                option.value = data[i];
                option.text = data[i];
                combo.appendChild(option);
            }

        } else {
            console.log('error 404');

        }

    }

    catch (err) {
        console.log(err);
    }

}
coneccion();





async function elegirAño() {

    var añoElegido = document.getElementById('año');
    if (añoElegido == "") {
        return false; //asegura q sea false

    }
    else {
        var valorAño = añoElegido.value;

        añoElegido.disabled = true;

        const respuestaCargos = await fetch(`https://resultados.mininterior.gob.ar/api/menu?año=${valorAño}`);
        if (respuestaCargos.ok) {
            const datosFiltros = await respuestaCargos.json();
            const comboCargo = document.getElementById("cargo");

            datosFiltrados = datosFiltros.filter(eleccion => eleccion.IdEleccion === tipoEleccion);

            //se itera sobre cada eleccion de datos filtrados y sobre cada cargo de la eleccion
            // completa el combo de Cargos
            datosFiltrados.forEach(eleccion => {
                eleccion.Cargos.forEach(cargo => {
                    const option = document.createElement("option");
                    option.value = cargo.IdCargo;
                    option.text = cargo.Cargo;
                    comboCargo.appendChild(option);
                    console.log(cargo.IdCargo);
                    console.log(cargo.Cargo);
                });
            });
        }
        else {
            console.log('error 404');

        }
    }
}


async function elegirCargo() {
    var cargoElegido = document.getElementById('cargo');
    if (cargoElegido == "") {
        return false
    }
    else {



        valorCargo = cargoElegido.value;
        cargoElegido.disabled = true;

        const comboDistrito = document.getElementById('distrito');


        console.log('Valor de valorCargo:', valorCargo);

        // filtra datos porelección y año 
        datosFiltradosAño = datosFiltrados.filter(eleccion => eleccion.IdEleccion === tipoEleccion);




        for (let i = 0; i < datosFiltradosAño.length; i++) {
            const eleccion = datosFiltradosAño[i];
            for (let j = 0; j < eleccion.Cargos.length; j++) {
                const cargoActual = eleccion.Cargos[j];
                if (cargoActual.IdCargo == valorCargo) {
                    cargo = cargoActual;
                    break;
                }
            }
            if (cargo) {
                break;
            }
        }

        if (!cargo) {
            console.log('Cargo no encontrado');

        }

        // llena opciones
        cargo.Distritos.forEach(distrito => {
            const option = document.createElement("option");
            option.value = distrito.IdDistrito;
            option.text = distrito.Distrito;
            comboDistrito.appendChild(option);
        });
    }
}



async function elegirDistrito() {
    var distritoElegido = document.getElementById('distrito');
    if (distritoElegido == "" || distritoElegido.value == 0) {
        return false

    }
    else {


        valorDistrito = distritoElegido.value;
        distritoElegido.disabled = true;

        const comboSeccion = document.getElementById('seccion');

        console.log(valorDistrito)

        // filtrar datos por elección y año 
        const datosFiltradosCargo = datosFiltrados.filter(eleccion => eleccion.IdEleccion === tipoEleccion);




        for (let i = 0; i < datosFiltradosCargo.length; i++) {
            const eleccion = datosFiltradosCargo[i];
            for (let j = 0; j < eleccion.Cargos.length; j++) {
                const cargoActual = eleccion.Cargos[j];
                if (cargoActual.IdCargo == valorCargo) {
                    cargo = cargoActual;
                    break;
                }
            }
            if (cargo) {


                break;
            }
        }
        console.log(cargo)

        if (!cargo) {
            console.log('Cargo no encontrado');
            return;
        }

        // encontrar  distrito seleccionado


        for (let a = 0; a < cargo.Distritos.length; a++) {
            const distritoActual = cargo.Distritos[a];

            if (distritoActual.IdDistrito == valorDistrito) {
                distrito = distritoActual;

                break;
            }

        }


        if (!distrito) {
            console.log('Distrito no encontrado');


            return;
        }

        // campo oculto 
        const hdSeccionProvincial = document.getElementById('hdSeccionProvincial').value;




        // recorro  SeccionesProvinciales
        distrito.SeccionesProvinciales.forEach(seccionProvincial => {
            //valor id 
            hdSeccionProvincial.value = seccionProvincial.IDSecccionProvincial;

            // recorro seccion y llena campo
            seccionProvincial.Secciones.forEach(seccion => {
                const option = document.createElement("option");
                option.value = seccion.IdSeccion;
                option.text = seccion.Seccion;
                comboSeccion.appendChild(option);
            });
        });
    }

}

var elegirSeccion = function () {
    var seccionElegida = document.getElementById('seccion');

    valorSeccion = seccionElegida.value
    seccionElegida.disabled = true;
    //funcion para desabilitar la opc seccion
}

function mostrarMensajeIncompleto(mensaje) {
    msjIncompleto = document.getElementById('incompleta');
    msjIncompleto.innerHTML = `<i class="fa fa-exclamation"></i>: ${mensaje}`;
    msjIncompleto.style.display = 'block';

    setTimeout(function () {
        msjIncompleto.style.display = 'none';
    }, 5000);
}
function mostrarMensajeError(mensaje) {
    msjError = document.getElementById('error');
    msjError.innerHTML = `<i class="fa fa-exclamation-triangle"></i>: ${mensaje}`;
    msjError.style.display = 'block';

    setTimeout(function () {
        msjError.style.display = 'none';
    }, 5000);
}

function mostrarMensajeExito(mensaje) {
    msjExito = document.getElementById('exito');
    msjExito.innerHTML = `<i class="fa fa-thumbs-up"></i>: ${mensaje}`;
    msjExito.style.display = 'block';

    setTimeout(function () {
        msjExito.style.display = 'none';
    }, 5000);


}



var mostrarTituloYSub = function () {
    añoElegido = document.getElementById('año').value;
    eleccion = "Paso";
    cargoElegido = document.getElementById('cargo');
    var textoCargo = cargoElegido.options[cargoElegido.selectedIndex].text;
    distritoElegido = document.getElementById('distrito');
    textoDistrito = distritoElegido.options[distritoElegido.selectedIndex].text;
    seccionElegida = document.getElementById('seccion');
    var textoSeccion = seccionElegida.options[seccionElegida.selectedIndex].text;
    titYSub = document.getElementById('sec-titulo');



    titulo = document.getElementById('titulo');
    titulo.innerText = `Elecciones ${añoElegido} | ${eleccion}`;


    subtitulo = document.getElementById('subtitulo');
    subtitulo.innerText = `${añoElegido} > ${eleccion} > ${textoCargo} > ${textoDistrito} > ${textoSeccion}`;


    titYSub.removeAttribute('hidden');

}



var cuadrosColores = function () {
    var estadoRecuento = data.estadoRecuento;
    var mesasEscrutadas = estadoRecuento.mesasTotalizadas;
    var electores = estadoRecuento.cantidadElectores;
    var participacion = estadoRecuento.participacionPorcentaje;
    var pMesas = document.getElementById('porcentaje-mesas');
    var pElect = document.getElementById('porcentaje-elec');
    var pPart = document.getElementById('porcentaje-part');
    var mostrarLinea = document.getElementById('misma-linea');


    pMesas.innerText = mesasEscrutadas
    pElect.innerText = electores
    pPart.innerText = `${participacion} %`

    mostrarLinea.style.display = "block";
    pagina.style.paddingBottom = '15%' //para que se agrande la pantalla

}
function mostrarMapaYTitulo() {
    var mapaContenedor = document.getElementById('mapas');


    var distritoSeleccionado = distritoElegido.options[distritoElegido.selectedIndex].text;
    distritoSeleccionado = distritoSeleccionado.toUpperCase();
    console.log('entre a la funcion')
    console.log('distrito elegido', distritoSeleccionado)
    var svg = mapas[distritoSeleccionado];
    console.log("SVG", svg);

    if (distritoSeleccionado in mapas) {




        var nuevoParrafo = document.createElement("p");
        nuevoParrafo.textContent = distritoSeleccionado;

        mapaContenedor.appendChild(nuevoParrafo);

        var mapaSVG = document.createElement("div");
        mapaSVG.innerHTML = svg;

        mapaContenedor.appendChild(mapaSVG);


        mapaContenedor.style.display = "block";
        console.log('entre al if')
    } else {

        mapaContenedor.style.display = "none";
        console.log('no entre al if')
    }
}


async function filtrar() {

    añoElegido = document.getElementById('año').value;
    cargoElegido = document.getElementById('cargo').value;
    distritoElegido = document.getElementById('distrito').value;
    console.log('Distrito elegido= ', distritoElegido);
    seccionElegida = document.getElementById('seccion').value;
    console.log('Seccion elegida= ', seccionElegida)
    msjIncompleto = document.getElementById('incompleta')

    if (añoElegido === "" || cargoElegido === "" || distritoElegido === "" || seccionElegida === "") {

        if (añoElegido === "") {
            mostrarMensajeIncompleto("Año no seleccionado");
        } else if (cargoElegido === "") {
            mostrarMensajeIncompleto("Cargo no seleccionado");
        } else if (distritoElegido === "") {
            mostrarMensajeIncompleto("Distrito no seleccionado");
        } else if (seccionElegida === "") {
            mostrarMensajeIncompleto("Sección no seleccionada");
        }




    } else {

        //hacer validacion

        var seccionProvincialId = document.getElementById('hdSeccionProvincial').value;
        console.log('seccion provincial id =', seccionProvincialId)
        if (seccionProvincialId.value === undefined) {
            seccionProvincialId.value = ""

        }


        // consulta api
        const url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${añoElegido}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${cargoElegido}&distritoId=${distritoElegido}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionElegida}&circuitoId=&mesaId=`;

        console.log('url= ', url)

        console.log(añoElegido)
        console.log(tipoRecuento)
        console.log(tipoEleccion)
        console.log(cargoElegido)
        console.log(distritoElegido)
        console.log(seccionProvincialId)
        console.log(seccionElegida)





        try {
            const respuesta = await fetch(url);
            if (respuesta.ok) {
                data = await respuesta.json();
                //respuesta en consola
                console.log(data);
                msjIncompleto.style.display = 'none';
                cuadrosColores();
                mostrarTituloYSub();
                mostrarMapaYTitulo();
                enviar.style.display = "block";
                mostrarAgrupaciones();

            } else {



                mostrarMensajeIncompleto("No se encontró información para la consulta realizada");
                mostrarTituloYSub();

            }
        } catch (err) {

            console.log(err);
            mostrarMensajeError("Error al consultar los datos: ");
            mostrarTituloYSub();
        }

    }
}


function agregarInforme() {
    var informe = `${añoElegido}|${tipoRecuento}|${tipoEleccion}|${valorCargo}|${valorDistrito}|${valorSeccion}`;


    //obtiene cadena o un array vacio   json.parse convierte esa cadena JSON en un objeto JavaScript.
    var informesArray = JSON.parse(localStorage.getItem('INFORMES')) || [];


    if (informesArray.includes(informe)) {
        mostrarMensajeIncompleto('El informe ya existe');
    } else {


        //push agrega al final de array
        informesArray.push(informe);

        // JSON.stringify convierte en string para que se pueda guardar en el local
        localStorage.setItem('INFORMES', JSON.stringify(informesArray));

        mostrarMensajeExito('Registro exitoso');
    }
}




var mostrarAgrupaciones = function () {
    var valoresPositivos = data.valoresTotalizadosPositivos;
    console.log('valoressss', valoresPositivos);

    var contenedorAgrupaciones = document.getElementById('contenedorAgrupaciones');

    for (var i = 0; i < valoresPositivos.length; i++) {
        var agrupacion = valoresPositivos[i];
        var votosTotal = valoresPositivos[i].votos;

        var nombreAgrupacion = agrupacion.nombreAgrupacion
        var porcentajeVotos = agrupacion.votosPorcentaje



        console.log('VOTOS TOTALEEEEEES', votosTotal)




        var agrupacionDiv = document.createElement('div');
        agrupacionDiv.classList.add('agrupaciones');

        var tituloAgrupacion = document.createElement('p');
        tituloAgrupacion.classList.add('titulo-agrupacion');
        tituloAgrupacion.textContent = nombreAgrupacion;

        agrupacionDiv.appendChild(tituloAgrupacion);
        contenedorAgrupaciones.appendChild(agrupacionDiv);


        var color;

        if (i <= 9) {
            color = colorAgrupaciones[i]
        }
        else {
            color = colorAgrupaciones[10]; // Color por defecto
        }

        if (i <= 7) {
            var chartWrapDiv = document.getElementsByClassName('chart-wrap')[0];

            var grid = document.getElementById('grid');

            // crea el div con la clase grid
            var barra = document.createElement('div');
            barra.classList.add('bar');

            // crea el div de la barra con las clases y estilos 


            barra.style.setProperty('--bar-value', porcentajeVotos + '%');
            barra.style.setProperty('--bar-color', color.colorPleno);
            barra.dataset.name = agrupacion.nombreAgrupacion;
            barra.title = agrupacion.nombreAgrupacion + ' ' + porcentajeVotos + '%';

            // agregar la barra al div grid


            // agregar el div grid al div principal
            grid.appendChild(barra);

            console.log('Nuevo Porcentaje:', porcentajeVotos);
            console.log('Nuevo Color:', color.colorPleno);
            console.log('Nuevo Nombre:', agrupacion.nombreAgrupacion);

        }




        for (var j = 0; j < agrupacion.listas.length; j++) {
            var lista = agrupacion.listas[j];

            var idAgrupacion = agrupacion.idAgrupacion;

            // convertir idAgrupacion a número
            var idAgrupacionNumero = parseInt(idAgrupacion);

            console.log('id agrupacionnnnnn', idAgrupacionNumero);












            var nombreLista = lista.nombre;
            var votosLista = lista.votos;
            var porcentajeLista = (votosLista * 100) / votosTotal; // calcula el porcentaje usando el total de votos
            console.log('nombrelista', nombreLista);
            console.log('porcentajelista', porcentajeLista);
            console.log('votoslista', votosLista);

            var nombreListaP = document.createElement('p');
            nombreListaP.textContent = nombreLista;
            agrupacionDiv.appendChild(nombreListaP);

            var porcentajeListaP = document.createElement('p');
            porcentajeListaP.textContent = 'Porcentaje: ' + porcentajeLista.toFixed(2) + '%';
            agrupacionDiv.appendChild(porcentajeListaP);

            var votosListaP = document.createElement('p');
            votosListaP.textContent = 'Votos: ' + votosLista;
            agrupacionDiv.appendChild(votosListaP);


            contenedorAgrupaciones.appendChild(agrupacionDiv);
            var progressDiv = document.createElement('div');
            progressDiv.classList.add('progress');
            progressDiv.style.background = color.colorLiviano;

            var progressBarDiv = document.createElement('div');
            progressBarDiv.classList.add('progress-bar');
            progressBarDiv.style.width = porcentajeLista + '%';
            progressBarDiv.style.background = color.colorPleno;

            var progressBarText = document.createElement('span');
            progressBarText.classList.add('progress-bar-text');
            progressBarText.textContent = porcentajeLista + '%';

            progressBarDiv.appendChild(progressBarText);
            progressDiv.appendChild(progressBarDiv);
            agrupacionDiv.appendChild(progressDiv);


        }





    }
    chartWrapDiv.appendChild(grid);
    chartWrapDiv.style.display = "block";
    contenedorAgrupaciones.style.display = "block";
};

