const tipoEleccion = 2;
const tipoRecuento = 1;
var datosFiltrados = [];
var valorAño;
var valorCargo;
var valorDistrito;
var valorSeccion;
var datosFiltradosAño = [];
var distrito;
var cargo;




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
    if (añoElegido == "0") {
        return false; //asegura q sea false

    }
    else {
        valorAño = añoElegido.value;
        // Deshabilito el año para que no se pueda elegir
        añoElegido.disabled = true;
        //fuciono
        const respuestaCargos = await fetch(`https://resultados.mininterior.gob.ar/api/menu?año=${valorAño}`);
        if (respuestaCargos.ok) {
            const datosFiltros = await respuestaCargos.json();
            const comboCargo = document.getElementById("cargo");

            datosFiltrados = datosFiltros.filter(eleccion => eleccion.IdEleccion === tipoEleccion);

            //Se itera sobre cada eleccion de datos filtrados y sobre cada cargo de la eleccion
            // Completar el combo de Cargos
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
    if (cargoElegido == "0") {
        return false
    }
    else {



        valorCargo = cargoElegido.value;
        cargoElegido.disabled = true;

        const comboDistrito = document.getElementById('distrito');


        console.log('Valor de valorCargo:', valorCargo);

        // filtrar datos por el tipo de elección y el año seleccionado
        datosFiltradosAño = datosFiltrados.filter(eleccion => eleccion.IdEleccion === tipoEleccion);

        // encontrar cargo seleccionado



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
    if (distritoElegido == "0") {
        return false

    }
    else {


        valorDistrito = distritoElegido.value;
        distritoElegido.disabled = true;

        const comboSeccion = document.getElementById('seccion');

        console.log(valorDistrito)

        // Filtrar datos por el tipo de elección y el año seleccionado
        const datosFiltradosCargo = datosFiltrados.filter(eleccion => eleccion.IdEleccion === tipoEleccion);

        // encontrar  cargo seleccionado


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

    seccionElegida.disabled = true;
    //funcion para desabilitar la opc seccion
}

function mostrarMensajeIncompleto(mensaje) {
    var msjIncompleto = document.getElementById('incompleta');
    msjIncompleto.innerHTML = `<i class="fa fa-exclamation-triangle"></i>: ${mensaje}`;
    msjIncompleto.style.display = 'block'; // muestra msj incom

    setTimeout(function () {
        msjIncompleto.style.display = 'none'; 
    }, 5000);
}
function mostrarMensajeError(mensaje) {
    var msjError = document.getElementById('error');
    msjError.innerHTML = `<i class="fa fa-thumbs-up"></i>: ${mensaje}`;
    msjError.style.display = 'block'; // Mostrar el mensaje de error

    setTimeout(function () {
        msjError.style.display = 'none'; 
    }, 5000);
}

async function filtrar() {

    añoElegido = document.getElementById('año').value;
    cargoElegido = document.getElementById('cargo').value;
    distritoElegido = document.getElementById('distrito').value;
    console.log('Distrito elegido= ', distritoElegido);
    seccionElegida = document.getElementById('seccion').value;
    console.log('Seccion elegida= ', seccionElegida)

    if (añoElegido == 0 & cargoElegido == 0 & distritoElegido == 0 & seccionElegida == 0) {

        mostrarMensajeIncompleto("Todos los campos deben ser seleccionados");



    } else if (añoElegido == 0 || cargoElegido == 0 || distritoElegido == 0 || seccionElegida == 0) {

        switch (true) {
            case añoElegido.value == 0:
                mostrarMensajeIncompleto("Año no seleccionado");
                break;
            case cargoElegido.value == 0:
                mostrarMensajeIncompleto("Cargo no seleccionado");
                break;
            case distritoElegido.value == 0:
                mostrarMensajeIncompleto("Distrito no seleccionado");
                break;
            case seccionElegida.value == 0:
                mostrarMensajeIncompleto("Sección no seleccionada");
                break;
        }
    }
    else {

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
                const data = await respuesta.json();
                
                //respuesta en consola
                console.log(data);
            } else {


                //
                mostrarMensajeError("Error: " + respuesta.status);  //amarillo
            }
        } catch (err) {

            mostrarMensajeError("Error: " + err.message); //rojo al consultar los datos
        }
    }
}

