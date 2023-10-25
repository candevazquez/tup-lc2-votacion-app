const tipoEleccion = 2;
const tipoRecuento = 1;


// Realizar la solicitud a la API
async function coneccion() {
    const url = "https://resultados.mininterior.gob.ar/api/menu/periodos";

    try { //para tratar conectarnos a la url await espera fetch para conectarse 
        const respuesta = await fetch(url);

        if (respuesta.ok) {
            //fuciono
            const data = await respuesta.json();
            var combo = document.getElementById("año");

            console.log(data.length)
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
        var valorAño = añoElegido.value;
        // Deshabilitar el elemento
        añoElegido.disabled = true;



        //fuciono
        const respuestaCargos = await fetch(`https://resultados.mininterior.gob.ar/api/menu?año=${valorAño}`);
        
        const datosFiltros = await respuestaCargos.json();
        const comboCargo = document.getElementById("cargo");


        

        // Filtrar datos por el tipo de elección
        const datosFiltrados = datosFiltros.filter(eleccion => eleccion.IdEleccion === tipoEleccion);

        // Completar el combo de Cargos
        datosFiltrados.forEach(eleccion => {
            eleccion.Cargos.forEach(cargo => {
                const option = document.createElement("option");
                option.value = cargo.IdCargo;
                option.text = cargo.Cargo;
                comboCargo.appendChild(option);
            });
        });

    }

}




