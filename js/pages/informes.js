function mostrarInformesGuardados() {
    var informesArray = JSON.parse(localStorage.getItem('INFORMES')) || [];

    if (informesArray.length === 0) {
        // No hay informes guardados, mostrar mensaje amarillo
        
        mostrarMensajeAmar
mostrarMensajeAmarillo('No hay informes guardados para mostrar');
    } else {
        // Hay informes guardados, procesar cada uno
        informesArray.
        inform
forEach(function (informe) {
            var datosInforme = informe.split('|');
            
            // Obtener los datos necesarios para formar la URL
            var añoEleccion = datosInforme[0];
            var tipoRecuento = datosInforme[1];
            var tipoEleccion = datosInforme[2];
            var valorCargo = datosInforme[3];
            var valorDistrito = datosInforme[4];
            var valorSeccion = datosInforme[5];

            // Construir la URL con los datos del informe
            var url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${añoEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${valorCargo}&distritoId=${valorDistrito}&seccionProvincialId=${valorSeccion}&seccionId=${valorSeccion}&circuitoId=&mesaId=`;

            // Realizar la consulta a la API con la URL construida
             fetch(url).then(response => response.json())
        .then(data => {
            // Aquí puedes manejar la respuesta de la API
            console.log(data);
        })
        .catch(error => {
            console.error('Error en la consulta a la API:', error);
        });

        });
    }
}

function realizarConsultaAPI(url) {
    // Aquí debes implementar la lógica para realizar la consulta a la API con la URL
    // Puedes utilizar fetch u otras técnicas para realizar la solicitud.
    // Por ejemplo:
   
}

// Función para mostrar un mensaje amarillo
function mostrarMensajeAmarillo(mensaje) {
    // Aquí debes implementar la lógica para mostrar un mensaje amarillo al usuario
    // Puedes utilizar alert, modificar el DOM, o cualquier otra técnica que prefieras.
    console.log('Mensaje Amarillo:', mensaje);
}