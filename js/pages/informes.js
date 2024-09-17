let distritos = {};
let textoCargos = {};
let tipoEleccionElegido= [];
let distritoEncontrado = [];
let textoCargo = [];
let seccionEncontrada= [];

function mostrarMapaYTitulo() {
  var mapaContenedor = document.getElementById("mapas");

  var distritoSeleccionado =
    distritoElegido.options[distritoElegido.selectedIndex].text;
  distritoSeleccionado = distritoSeleccionado.toUpperCase();
  console.log("entre a la funcion");
  console.log("distrito elegido", distritoSeleccionado);
  var svg = mapas[distritoSeleccionado];
  console.log("SVG", svg);

  if (distritoSeleccionado in mapas) {
    var mapaSVG = document.createElement("div");
    mapaSVG.innerHTML = svg;

    mapaContenedor.appendChild(mapaSVG);

    mapaContenedor.style.display = "block";
    console.log("entre al if");
  } else {
    mapaContenedor.style.display = "none";
    console.log("no entre al if");
  }
}

function mostrarMensajeIncompleto(mensaje) {
  msjIncompleto = document.getElementById("incompleta");
  msjIncompleto.innerHTML = `<i class="fa fa-exclamation"></i>: ${mensaje}`;
  msjIncompleto.style.display = "block";
}

async function cargarInformes() {
  
  // Obtener los datos guardados en el localStorage
  const informesGuardados = localStorage.getItem("INFORMES");
  console.log(informesGuardados);

  // Verificar si existen registros
  if (!informesGuardados) {
    // Si no existen, mostrar mensaje amarillo
    mostrarMensajeIncompleto("No hay informes guardados para mostrar");

    return; //sale si no hay informes
  }

  // Si existen, parsear el array
  let informesArray;
  try {
    informesArray = JSON.parse(informesGuardados);
  } catch (error) {
    console.error("error", error);
    return;
  }

  //console.log("array de informes", informesArray);
  if (!Array.isArray(informesArray)) {
    console.error("El formato de datos no es un array");
    mostrarMensajeIncompleto("Formato de datos incorrecto.");
    return;
  }

  for (const informe of informesArray) {
    const datos = informe.split("|");
    if (datos.length < 6) {
      console.error("faltan parametros en el informe:", informe);
      continue;
    }

    const [año, tipoRecuento, tipoEleccion, cargoElegido, distrito, seccion] =
      datos;
    //console.log("DATOSSS", datos);

    // Recorrer el array
    // informesArray.forEach((informe, index) => {
    //   if (typeof informe !== "string") {
    //     console.error(
    //       `Formato de registro incorrecto en el índice ${index}:`,
    //       informe
    //     );

    //     return; // Salir si el formato es incorrecto
    //   }

    //   const datos = informe.split("|");

    var seccionProvincialId = "";

    const url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${año}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${cargoElegido}&distritoId=${distrito}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccion}&circuitoId=&mesaId=`;

    console.log("url= ", url);
    console.log("nombre provinvia", mapas[distrito]);
    console.log(año);
    console.log(tipoRecuento);
    console.log(tipoEleccion);
    console.log(cargoElegido);
    console.log("aaaaaaaaaaa", distrito.value);
    console.log(seccionProvincialId);
    console.log(seccion);


    
    if (tipoRecuento == 1) {
      tipoRecuentoElegido = "Paso"
      console.log("tipo", tipoRecuentoElegido)
      
    }
    else{
      tipoRecuentoElegido = "Gererales"
      console.log("tipo", tipoRecuentoElegido)
    }

    console.log("tipo Recuento", tipoRecuentoElegido)

    const URL = `https://resultados.mininterior.gob.ar/api/menu?año=${año}`; // Cambia esta URL a la correcta
    try {
      const respuesta = await fetch(URL);
      if (respuesta.ok) {
        const datos = await respuesta.json();
        console.log("DATOSSSSS", datos)

        datos[0].Cargos.forEach((cargo) => {
          //console.log("cargoooo", cargo.Cargos);
        
          //console.log("cargo texto", textoCargos);

          if (cargo.IdCargo == cargoElegido) {
            textoCargo.push(cargo.Cargo);
            console.log("entre al if", textoCargo);
          }
         
        });


        let tipoEleccionTexto;
        if (tipoEleccion == 1) {
          tipoEleccionTexto = "Paso"
          
          
        }
        else{
          tipoEleccionTexto = "Gererales"
          
        }
        tipoEleccionElegido.push(tipoEleccionTexto);
        console.log("tipo Recuento", tipoEleccionElegido)

  


        for (let cargo of datos[0].Cargos) {
          // Buscar el distrito específico dentro de cada cargo
          const distritoEspecifico = cargo.Distritos.find(d => d.IdDistrito === parseInt(distrito));
  
          
            // Guardar el distrito encontrado
            distritoEncontrado.push(distritoEspecifico.Distrito)
             
            // Salir del bucle una vez encontrado
            break;
          
        
        };

        console.log("Distrito encontrado:", distritoEncontrado);



        for (let cargo of datos[0].Cargos) {
          // Buscamos el distrito específico
          const distritoEspecifico = cargo.Distritos.find(d => d.IdDistrito === parseInt(distrito));
        
          if (distritoEspecifico && distritoEspecifico.SeccionesProvinciales) {
            // Aseguramos que SeccionesProvinciales existe y tiene Secciones
            const seccionesProvinciales = distritoEspecifico.SeccionesProvinciales;
        
            // Buscamos la sección específica dentro de SeccionesProvinciales.Secciones
            const seccionEspecifica = seccionesProvinciales[0]?.Secciones?.find(s => s.IdSeccion === parseInt(seccion));
        
            if (seccionEspecifica) {
              // Agregamos el nombre de la sección encontrada al array
              seccionEncontrada.push(seccionEspecifica.Seccion);
        
              // Mostramos la sección encontrada
              console.log("Sección encontrada:", seccionEspecifica.Seccion);
              
              // Detenemos la búsqueda después de encontrar la sección
              break;
            }
          }
        }
        
        
       console.log("seccion Encontrada", seccionEncontrada)



























   
      }else {
        console.error("Error al cargar cargos");
      }

    } 
    catch (err) {
      console.error(err);
    }

    try {
      //consulta api
      const response = await fetch(url);
      const data = await response.json();
      console.log("datos de la api", data);
      //muestro tabla

      mostrarTabla(tipoEleccionElegido, distritoEncontrado, textoCargo, seccionEncontrada, data, año);
    } catch (error) {
      console.error("error al consultar la api", error);
    }
  }

  //cargarDistritos();
}
cargarInformes();


var mostrarTabla = function(tipoEleccionElegido, distritoEncontrado, textoCargo, seccionEncontrada, data, año) {
  // Obtener el tbody de la tabla
  const tablaContenedor = document.querySelector(".div-tabla tbody");
  tablaContenedor.innerHTML = ""; // Limpiar tabla existente
  


  const longitud = tipoEleccionElegido.length;
  console.log("Longitud del array:", longitud);

  // Recorrer los arrays simultáneamente
  for (let i = 0; i < longitud; i++) {
    // Armar el título y subtítulo
    let titulo = `Elecciones ${año} | ${tipoEleccionElegido[i]}`;
    let subtitulo = `${año} > ${tipoEleccionElegido[i]} > ${textoCargo[i]} > ${distritoEncontrado[i]} > ${seccionEncontrada[i]}`;

    console.log(tipoEleccionElegido[0])
    console.log(tipoEleccionElegido[1])
    console.log("titulo", titulo)
    console.log("subtitulo", subtitulo)

    console.log("Index:", i);
    console.log("tipoEleccionElegido[i]:", tipoEleccionElegido[i]);
    console.log("textoCargo[i]:", textoCargo[i]);
    console.log("distritoEncontrado[i]:", distritoEncontrado[i]);
    console.log("seccionEncontrada[i]:", seccionEncontrada[i]);


    console.log("añooooooooooo", año[0])

    console.log("añooooooooooo", año[1])


    // Datos generales

    console.log("data", data.estadoRecuento)

    const fila = document.createElement("tr");
    const celdaEleccion = document.createElement("td");

    celdaEleccion.innerHTML = `
      <p class="texto-elecciones-chico">${titulo}</p>
      <p class="texto-path-chico">${subtitulo}</p>
    `;
    
    // Agregar la celda a la fila
    fila.appendChild(celdaEleccion);
    
    // Agregar la fila al tbody de la tabla
    tablaContenedor.appendChild(fila);

    // var estadoRecuento = data.estadoRecuento;
    // var mesasEscrutadas = estadoRecuento.mesasTotalizadas;
    // var electores = estadoRecuento.cantidadElectores;
    // var participacion = estadoRecuento.participacionPorcentaje;
    // var pMesas = document.getElementById("porcentaje-mesas");
    // var pElect = document.getElementById("porcentaje-elec");
    // var pPart = document.getElementById("porcentaje-part");
    // var mostrarLinea = document.getElementsByClassName("datos-generales");
  
    // pMesas.innerText = mesasEscrutadas;
    // pElect.innerText = electores;
    // pPart.innerText = `${participacion} %`;
  
    // mostrarLinea.style.display = "block";
    // pagina.style.paddingBottom = "15%"; //para que se agrande la pantalla
  
    // Datos por agrupación
    // let agrupacionHtml = "";
    // agrupaciones[i].forEach(agrupacion => {
    //   agrupacionHtml += `
    //     <div class="cont-agrupacion">
    //       <div class="partido">${agrupacion.nombre}</div>
    //       <div class="porcentaje">${agrupacion.votosPorcentaje}%</div>
    //       <div class="votos">${agrupacion.votos} Votos</div>
    //     </div>`;
    // });

    // Crear la fila de la tabla
    // const filaHtml = `
    //   <tr>
    //     <td class="provincia">${distritoEncontrado[i]}</td>
    //     <td class="eleccion">
    //       <p class="texto-elecciones-chico">${titulo}</p>
    //       <p class="texto-path-chico">${subtitulo}</p>
    //     </td>
    //     <td>
    //       <div class="datos-generales">
    //         <div class="mesas">
    //           <svg ...> ... </svg> ${mesasEscrutadas}
    //         </div>
    //         <div class="electores">
    //           <svg ...> ... </svg> ${electores}
    //         </div>
    //         <div class="participacion">
    //           <svg ...> ... </svg> ${participacion}
    //         </div>
    //       </div>
    //     </td>
    //     <td class="xagrupacion">
    //       ${agrupacionHtml}
    //     </td>
    //   </tr>`;

    // // Añadir la fila al tbody
    // tablaContenedor.innerHTML += filaHtml;
  }
}

// function mostrarTabla(data, distrito, año, tipoEleccion, cargo, seccion) {
  
//     const tablaContenedor = document.querySelector(".div-tabla tbody");
//     tablaContenedor.innerHTML = ""; // Limpiar tabla existente

//     const fila = document.createElement("tr");

//     // Agregar el nombre del distrito
//     const tdDistrito = document.createElement("td");
//     tdDistrito.textContent = distritos[distrito] || "Desconocido";
//     fila.appendChild(tdDistrito);

//     // Agregar el tipo de elección
//     const tdTipoEleccion = document.createElement("td");
//     tdTipoEleccion.textContent = tipoEleccion; // Asume que tipoEleccion es un nombre descriptivo
//     fila.appendChild(tdTipoEleccion);

//     // Agregar datos generales (año, cargo, etc.)
//     const tdDatosGenerales = document.createElement("td");
//     tdDatosGenerales.innerHTML = `
//       <div class="datos-generales">
//         <div class="mesas">
//           <!-- Aquí iría el SVG o los datos relevantes -->
//           <p>Año: ${año}</p>
//           <p>Cargo: ${cargo || "Desconocido"}</p>
//           <p>Sección: ${seccion}</p>
//         </div>
//       </div>
//     `;
//     fila.appendChild(tdDatosGenerales);

//     // Datos por agrupación (si tienes)
//     const tdDatosAgrupacion = document.createElement("td");
//     tdDatosAgrupacion.innerHTML = `
//       <div class="cont-agrupacion">
//         <div class="partido">Partido</div>
//         <div class="porcentaje">%</div>
//         <div class="votos">Votos</div>
//       </div>
//     `;
//     fila.appendChild(tdDatosAgrupacion);

//     tablaContenedor.appendChild(fila);
//   }



















// Función para obtener distritos
// async function cargarDistritos() {
//   const url = "https://resultados.mininterior.gob.ar/api/menu/distritos"; // Cambia esta URL a la correcta
//   try {
//     const respuesta = await fetch(url);
//     if (respuesta.ok) {
//       const datos = await respuesta.json();
//       datos.forEach(distrito => {
//         distritos[distrito.IdDistrito] = distrito.NombreDistrito;
//       });
//     } else {
//       console.error("Error al cargar distritos");
//     }
//   } catch (err) {
//     console.error(err);
//   }
// }

// Función para obtener cargos
// async function cargarCargos(año, cargoElegido,tipoEleccion) {
//   const url = `https://resultados.mininterior.gob.ar/api/menu?año=${año}`; // Cambia esta URL a la correcta
//   try {
//     const respuesta = await fetch(url);
//     if (respuesta.ok) {
//       const datos = await respuesta.json();


//       let datosFiltrados = datos.filter(
//         (eleccion) => eleccion.IdEleccion === tipoEleccion
//       );

//       datosFiltrados.forEach((eleccion) => {
//         eleccion.Cargos.forEach((cargo) => {
      
//         //console.log("cargoooo", cargo.Cargos);
//         textoCargos[cargo.IdCargo] = cargo.Cargo;
//         //console.log("cargo texto", textoCargos);

//         if (cargo.IdCargo == cargoElegido) {
//           textoCargo[cargo.IdCargo] = cargo.Cargo;
//           console.log("entre al if", textoCargo);
//         }
//       })});
//     } else {
//       console.error("Error al cargar cargos");
//     }
//   } catch (err) {
//     console.error(err);
//   }
// }

// datosFiltrados.forEach((eleccion) => {

//   eleccion.Cargos.forEach((cargo) => {
//     const option = document.createElement("option");
//     option.value = cargo.IdCargo;
//     option.text = cargo.Cargo;
//     comboCargo.appendChild(option);
//     console.log(cargo.IdCargo);
//     console.log(cargo.Cargo);
//   });
// });




//    console.log("añooooooooo", año)
// async function obtenerDatos() {

//         var valorAño = año;

//fuciono
//         const respuestaCargos = await fetch(`https://resultados.mininterior.gob.ar/api/menu?año=${valorAño}`);
//         if (respuestaCargos.ok) {
//             const datosFiltros = await respuestaCargos.json();
//             const comboCargo = document.getElementById("cargo");

//             datosFiltrados = datosFiltros.filter(eleccion => eleccion.IdEleccion === tipoEleccion);

//             //Se itera sobre cada eleccion de datos filtrados y sobre cada cargo de la eleccion
//             // completa el combo de Cargos
//             datosFiltrados.forEach(eleccion => {
//                 eleccion.Cargos.forEach(cargo => {
//                     const option = document.createElement("option");
//                     option.value = cargo.IdCargo;
//                     option.text = cargo.Cargo;
//                     comboCargo.appendChild(option);
//                     console.log(cargo.IdCargo);
//                     console.log(cargo.Cargo);
//                 });
//             });
//         }
//         else {
//             console.log('error 404');

//         }

// }

// window.onload = cargarInformes;
// Armar el registro de la tabla
//         const fila = document.createElement("tr");

//         Mapa de provincias (esto es solo un ejemplo)
//         function mostrarMapaYTitulo() {
//           var mapaContenedor = document.getElementById("mapa");

//           var distritoSeleccionado =
//             distrito.options[distrito.selectedIndex].text;
//           distritoSeleccionado = distritoSeleccionado.toUpperCase();
//           console.log("entre a la funcion");
//           console.log("distrito elegido", distritoSeleccionado);
//           var svg = mapas[distritoSeleccionado];
//           console.log("SVG", svg);

//           if (distritoSeleccionado in mapas) {
//             var nuevoParrafo = document.createElement("p");
//             nuevoParrafo.textContent = distritoSeleccionado;

//             mapaContenedor.appendChild(nuevoParrafo);

//             var mapaSVG = document.createElement("div");
//             mapaSVG.innerHTML = svg;

//             mapaContenedor.appendChild(mapaSVG);

//             mapaContenedor.style.display = "block";
//             console.log("entre al if");
//           } else {
//             mapaContenedor.style.display = "none";
//             console.log("no entre al if");
//           }
//         }
//         Completar con más provincias...

//         const tituloEleccion = `Elecciones ${año} | ${tipoEleccion}`;
//         const subtituloEleccion = `${año} > ${tipoEleccion} > ${cargo} > ${distrito} > ${seccion}`;

//         fila.innerHTML = `
//                     <td>${mapaProvincias[provinciaId]}</td>
//                     <td>${tituloEleccion}<br>${subtituloEleccion}</td>
//                     <td>${data.estadoRecuento.mesasTotalizadas}</td>
//                     <td>${data.estadoRecuento.cantidadElectores}</td>
//                     <td>${data.estadoRecuento.participacionPorcentaje}%</td>
//                     <td>
//                         ${data.agrupaciones
//                           .map(
//                             (agrupacion) => `
//                             ${agrupacion.nombreAgrupacion} ${agrupacion.votosPorcentaje}% - ${agrupacion.votos} Votos
//                         `
//                           )
//                           .join("<br>")}
//                     </td>
//                 `;

//         document.querySelector("#tablaInformes tbody").appendChild(fila);
//       })
//       .catch((error) => {
//         console.error("Error al consultar la API:", error
