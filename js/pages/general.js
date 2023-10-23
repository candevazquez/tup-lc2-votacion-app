const tipoEleccion = 2;
const tipoRecuento = 1;
var año = document.getElementById('año');



async function elegirAño() {

    if (añoElegido == "0") {
        return false; //asegura q sea false
 
    }
    else {
        var selecc = año.value;

    
        var añoElegido = selecc;

        // Deshabilitar el elemento
        año.disabled = true;


        const url = "https://resultados.mininterior.gob.ar/api/menu/periodos"
        try { //para tratar conectarnos a la url await espera fetch para conectarse 
            const respuesta = await fetch(url);

            if (respuesta.ok) {
                //fuciono
                const cargo = await fetch(`https://resultados.mininterior.gob.ar/api/menu?año=${añoElegido}`);
               console.log(cargo)
             


            } else {
                console.log('error 404');

            }

        }

        catch (err) {
            console.log(err);
        }
    }
}

