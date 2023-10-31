const tipoEleccion = 2;
const tipoRecuento = 1;
var datosFiltrados = [];
var valorAño;
var valorCargo;
var valorDistrito;
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


function elegirCargo() {
    var cargoElegido = document.getElementById('cargo');
    valorCargo = cargoElegido.value;
    cargoElegido.disabled = true;

    const comboDistrito = document.getElementById('distrito');
    comboDistrito.innerHTML = ''; // Limpiar el combo de distritos

    console.log('Valor de valorCargo:', valorCargo);

    // Filtrar datos por el tipo de elección y el año seleccionado
    datosFiltradosAño = datosFiltrados.filter(eleccion => eleccion.IdEleccion === tipoEleccion);

    // Encontrar el cargo seleccionado



    for (let i = 0; i < datosFiltradosAño.length; i++) {
        const eleccion = datosFiltradosAño[i];
        for (let j = 0; j < eleccion.Cargos.length; j++) {
            const cargoActual = eleccion.Cargos[j];
            if (cargoActual.IdCargo === valorCargo) {
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



var elegirDistrito = function () {
    var distritoElegido = document.getElementById('distrito');
    valorDistrito = distritoElegido.value;
    distritoElegido.disabled = true;

    const comboSeccion = document.getElementById('seccion');
    comboSeccion.innerHTML = ''; // Limpiar el combo de secciones
    console.log(valorDistrito)

    // Filtrar datos por el tipo de elección y el año seleccionado
    const datosFiltradosCargo = datosFiltrados.filter(eleccion => eleccion.IdEleccion === tipoEleccion);

    // Encontrar el cargo seleccionado


    for (let i = 0; i < datosFiltradosCargo.length; i++) {
        const eleccion = datosFiltradosCargo[i];
        for (let j = 0; j < eleccion.Cargos.length; j++) {
            const cargoActual = eleccion.Cargos[j];
            if (cargoActual.IdCargo === valorCargo) {
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

    // Encontrar el distrito seleccionado
    

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

    // Guardar el valor de la sección provincial en el campo oculto
    const hdSeccionProvincial = document.getElementById('hdSeccionProvincial');
    hdSeccionProvincial.value = distrito.IdSeccionProvincial;

    // Llenar el combo de secciones
    distrito.SeccionesProvinciales.forEach(seccionProvincial => {
        seccionProvincial.Secciones.forEach(seccion => {
            const option = document.createElement("option");
            option.value = seccion.IdSeccion;
            option.text = seccion.Seccion;
            comboSeccion.appendChild(option);
        });
    });
}