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
var pagina = document.getElementById("body");
var data;
var textoDistrito;
var enviar = document.getElementById("boton-enviar");

var colorAgrupaciones = {
  0: { colorPleno: "rgb(252, 210, 0)", colorLiviano: "rgba(252, 210, 0, 0.3)" },
  1: { colorPleno: "rgb(0, 169, 232)", colorLiviano: "rgba(0, 169, 232, 0.3)" },
  2: { colorPleno: "rgb(171, 40, 40)", colorLiviano: "rgba(171, 40, 40, 0.3)" },
  3: {
    colorPleno: "rgb(112, 76, 159)",
    colorLiviano: "rgba(112, 76, 159, 0.5)",
  },
  4: { colorPleno: "rgb(77, 46, 110)", colorLiviano: "rgba(77, 46, 110, 0.5)" },
  5: {
    colorPleno: "rgb(128, 128, 128)",
    colorLiviano: "rgba(128, 128, 128, 0.5)",
  },
  6: {
    colorPleno: "rgb(102, 171, 60)",
    colorLiviano: "rgba(102, 171, 60, 0.5)",
  },
  7: { colorPleno: "rgb(255, 0, 0)", colorLiviano: "rgba(255, 0, 0, 0.5)" },
  8: { colorPleno: "rgb(0, 255, 0)", colorLiviano: "rgba(0, 255, 0, 0.5)" },
  9: { colorPleno: "rgb(0, 0, 255)", colorLiviano: "rgba(0, 0, 255, 0.5)" },
  10: {
    colorPleno: "rgb(169, 169, 169)",
    colorLiviano: "rgba(169, 169, 169, 0.5)",
  },
};



async function coneccion() {
  const url = "https://resultados.mininterior.gob.ar/api/menu/periodos";
  try {
    //para tratar conectarme a la url 
    const respuesta = await fetch(url);

    if(!respuesta.ok){
      throw new Error("Error en la petición: " + respuesta.status);
    }
   
    const data = await respuesta.json();
    var combo = document.getElementById("año");

    for (i = 0; i < data.length; i++) {
      const option = document.createElement("option");
      option.value = data[i];
      option.text = data[i];
      combo.appendChild(option);
      
    } 
  } catch (err) {
    console.log("Ocurrio un error",err.message);
  }
}
coneccion();

async function elegirAño() {
  var añoElegido = document.getElementById("año");
  if (añoElegido == "") {
    return false;
  } else {
    var valorAño = añoElegido.value;
    añoElegido.disabled = true;

    const respuestaCargos = await fetch(
      `https://resultados.mininterior.gob.ar/api/menu?año=${valorAño}`
    );
    if (respuestaCargos.ok) {
      const datosFiltros = await respuestaCargos.json();
      const comboCargo = document.getElementById("cargo");

      datosFiltrados = datosFiltros.filter(
        (eleccion) => eleccion.IdEleccion === tipoEleccion
      );
      datosFiltrados.forEach((eleccion) => {
        eleccion.Cargos.forEach((cargo) => {
          const option = document.createElement("option");
          option.value = cargo.IdCargo;
          option.text = cargo.Cargo;
          comboCargo.appendChild(option);
        });
      });
    } else {
      console.log("error 404");
    }
  }
}

async function elegirCargo() {
  var cargoElegido = document.getElementById("cargo");
  if (cargoElegido == "") {
    return false;
  } else {
    valorCargo = cargoElegido.value;
    cargoElegido.disabled = true;

    const comboDistrito = document.getElementById("distrito");

    for (const eleccion of datosFiltrados) {
      cargo = eleccion.Cargos.find(c => c.IdCargo == valorCargo);
      if (cargo) break;
    }

    if (!cargo) {
      console.log("Cargo no encontrado");
      return;
    } 

    cargo.Distritos.forEach((distrito) => {
      const option = document.createElement("option");
      option.value = distrito.IdDistrito;
      option.text = distrito.Distrito;
      comboDistrito.appendChild(option);
    });
  }
}

async function elegirDistrito() {
  var distritoElegido = document.getElementById("distrito");
  if (distritoElegido == "" || distritoElegido.value == 0) {
    return false;
  } else {
    valorDistrito = distritoElegido.value;
    distritoElegido.disabled = true;

    const comboSeccion = document.getElementById("seccion");

    for (const eleccion of datosFiltrados) {
      cargo = eleccion.Cargos.find(c => c.IdCargo == valorCargo);
      if (cargo) break;
    }

    if (!cargo) {
      console.log("Cargo no encontrado");
      return;
    }


    const distrito = cargo.Distritos.find(d => d.IdDistrito == valorDistrito);

    if (!distrito) {
      console.log("Distrito no encontrado");
      return;
    }
    // campo oculto
    const hdSeccionProvincial = document.getElementById(
      "hdSeccionProvincial"
    ).value;

    distrito.SeccionesProvinciales.forEach((seccionProvincial) => {
      hdSeccionProvincial.value = seccionProvincial.IDSecccionProvincial;
      // recorro seccion y llena campo
      seccionProvincial.Secciones.forEach((seccion) => {
        const option = document.createElement("option");
        option.value = seccion.IdSeccion;
        option.text = seccion.Seccion;
        comboSeccion.appendChild(option);
      });
    });
  }
}

var elegirSeccion = function () {
  var seccionElegida = document.getElementById("seccion");

  valorSeccion = seccionElegida.value;
  seccionElegida.disabled = true;
};

function mostrarMensajeIncompleto(mensaje) {
  msjIncompleto = document.getElementById("incompleta");
  msjIncompleto.innerHTML = `<i class="fa fa-exclamation"></i>: ${mensaje}`;
  msjIncompleto.style.display = "block";

  setTimeout(function () {
    msjIncompleto.style.display = "none";
  }, 5000);
}
function mostrarMensajeError(mensaje) {
  msjError = document.getElementById("error");
  msjError.innerHTML = `<i class="fa fa-exclamation-triangle"></i>: ${mensaje}`;
  msjError.style.display = "block";

  setTimeout(function () {
    msjError.style.display = "none";
  }, 5000);
}

function mostrarMensajeExito(mensaje) {
  msjExito = document.getElementById("exito");
  msjExito.innerHTML = `<i class="fa fa-thumbs-up"></i>: ${mensaje}`;
  msjExito.style.display = "block";

  setTimeout(function () {
    msjExito.style.display = "none";
  }, 5000);
}

var mostrarTituloYSub = function () {
  añoElegido = document.getElementById("año").value;
  eleccion = "Paso";
  cargoElegido = document.getElementById("cargo");
  var textoCargo = cargoElegido.options[cargoElegido.selectedIndex].text;
  distritoElegido = document.getElementById("distrito");
  textoDistrito = distritoElegido.options[distritoElegido.selectedIndex].text;
  seccionElegida = document.getElementById("seccion");
  var textoSeccion = seccionElegida.options[seccionElegida.selectedIndex].text;
  titYSub = document.getElementById("sec-titulo");

  titulo = document.getElementById("titulo");
  titulo.innerText = `Elecciones ${añoElegido} | ${eleccion}`;

  subtitulo = document.getElementById("subtitulo");
  subtitulo.innerText = `${añoElegido} > ${eleccion} > ${textoCargo} > ${textoDistrito} > ${textoSeccion}`;

  titYSub.removeAttribute("hidden");
};

var cuadrosColores = function () {
  var estadoRecuento = data.estadoRecuento;
  var mesasEscrutadas = estadoRecuento.mesasTotalizadas;
  var electores = estadoRecuento.cantidadElectores;
  var participacion = estadoRecuento.participacionPorcentaje;
  var pMesas = document.getElementById("porcentaje-mesas");
  var pElect = document.getElementById("porcentaje-elec");
  var pPart = document.getElementById("porcentaje-part");
  var mostrarLinea = document.getElementById("misma-linea");

  pMesas.innerText = mesasEscrutadas;
  pElect.innerText = electores;
  pPart.innerText = `${participacion} %`;

  mostrarLinea.style.display = "flex";
  pagina.style.paddingBottom = "15%";
};
function mostrarMapaYTitulo() {
  var mapaContenedor = document.getElementById("mapas");

  var distritoSeleccionado =
    distritoElegido.options[distritoElegido.selectedIndex].text;
  distritoSeleccionado = distritoSeleccionado.toUpperCase();
  var svg = mapas[distritoSeleccionado];

  if (distritoSeleccionado in mapas) {
    var nuevoParrafo = document.createElement("p");
    nuevoParrafo.textContent = distritoSeleccionado;

    mapaContenedor.appendChild(nuevoParrafo);

    var mapaSVG = document.createElement("div");
    mapaSVG.innerHTML = svg;

    mapaContenedor.appendChild(mapaSVG);

    mapaContenedor.style.display = "block";
  } else {
    mapaContenedor.style.display = "none";
  }
}

async function filtrar() {
  añoElegido = document.getElementById("año").value;
  cargoElegido = document.getElementById("cargo").value;
  distritoElegido = document.getElementById("distrito").value;
  seccionElegida = document.getElementById("seccion").value;
  msjIncompleto = document.getElementById("incompleta");

  if (
    añoElegido === "" ||
    cargoElegido === "" ||
    distritoElegido === "" ||
    seccionElegida === ""
  ) {
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
    var seccionProvincialId = document.getElementById(
      "hdSeccionProvincial"
    ).value;
    if (seccionProvincialId.value === undefined) {
      seccionProvincialId.value = "";
    }
    document.getElementById("filtrarBtn").disabled = true;
    document.getElementById("filtrarBtn").style.pointerEvents = "none";

    // consulta api
    const url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${añoElegido}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${cargoElegido}&distritoId=${distritoElegido}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionElegida}&circuitoId=&mesaId=`;

    try {
      document.getElementById('spinner').style.display = 'flex';
      const respuesta = await fetch(url);
      
      if (respuesta.ok) {
        document.getElementById('spinner').style.display = 'none';
        data = await respuesta.json();
        msjIncompleto.style.display = "none";
        cuadrosColores();
        mostrarTituloYSub();
        mostrarMapaYTitulo();
        enviar.style.display = "block";
        mostrarAgrupaciones();
      } else {
        mostrarMensajeIncompleto(
          "No se encontró información para la consulta realizada"
        );
        mostrarTituloYSub();
      }
    } catch (err) {
      mostrarMensajeError("Error al consultar los datos: ");
      document.getElementById('spinner').style.display = 'none';
      mostrarTituloYSub();
    }
  }
}

function agregarInforme() {
  var informe = `${añoElegido}|${tipoRecuento}|${tipoEleccion}|${valorCargo}|${valorDistrito}|${valorSeccion}`;

  var informesArray = JSON.parse(localStorage.getItem("INFORMES")) || [] ;

  if (informesArray.includes(informe)) {
    mostrarMensajeIncompleto("El informe ya existe");
  } else {
    informesArray.push(informe);
    localStorage.setItem("INFORMES", JSON.stringify(informesArray));
    mostrarMensajeExito("Registro exitoso");
  }
}

var mostrarAgrupaciones = function () {
  var valoresPositivos = data.valoresTotalizadosPositivos;

  var contenedorAgrupaciones = document.getElementById(
    "contenedorAgrupaciones"
  );

  for (var i = 0; i < valoresPositivos.length; i++) {
    var agrupacion = valoresPositivos[i];
    var votosTotal = valoresPositivos[i].votos;

    var nombreAgrupacion = agrupacion.nombreAgrupacion;
    var porcentajeVotos = agrupacion.votosPorcentaje;

    var agrupacionDiv = document.createElement("div");
    agrupacionDiv.classList.add("agrupaciones");

    var tituloAgrupacion = document.createElement("p");
    tituloAgrupacion.classList.add("titulo-agrupacion");
    tituloAgrupacion.textContent = nombreAgrupacion;

    agrupacionDiv.appendChild(tituloAgrupacion);
    contenedorAgrupaciones.appendChild(agrupacionDiv);

    var color;

    if (i <= 9) {
      color = colorAgrupaciones[i];
    } else {
      color = colorAgrupaciones[10]; // Color por defecto
    }

    if (i <= 7) {
      var chartWrapDiv = document.getElementsByClassName("chart-wrap")[0];

      var grid = document.getElementById("grid");

      var barra = document.createElement("div");
      barra.classList.add("bar");
      barra.style.setProperty("--bar-value", porcentajeVotos + "%");
      barra.style.setProperty("--bar-color", color.colorPleno);
      barra.dataset.name = agrupacion.nombreAgrupacion;
      barra.title = agrupacion.nombreAgrupacion + " " + porcentajeVotos + "%";

      grid.appendChild(barra);

      for (var j = 0; j < agrupacion.listas.length; j++) {
        var lista = agrupacion.listas[j];

        var nombreLista = lista.nombre;
        var votosLista = lista.votos;
        var porcentajeLista;
        if (votosTotal > 0) {
          porcentajeLista = ((votosLista * 100) / votosTotal).toFixed(2);
        } else {
          porcentajeLista = 0; 
        }

        var contenidoAgrupaciones = document.createElement("div");
        contenidoAgrupaciones.classList.add("contenidoAgrupaciones");
        var izquierda = document.createElement("div");
        izquierda.classList.add("izquierda");
        var derecha = document.createElement("div");
        derecha.classList.add("derecha");

        //nombreLista
        var nombreListaP = document.createElement("div");
        nombreListaP.textContent = nombreLista;
        izquierda.appendChild(nombreListaP);

        //porcentaje lista
        var porcentajeListaP = document.createElement("div");
        porcentajeListaP.textContent = "Porcentaje: " + porcentajeLista + "%";
        derecha.appendChild(porcentajeListaP);

        //votos lista
        var votosListaP = document.createElement("div");
        votosListaP.textContent = "Votos: " + votosLista;
        derecha.appendChild(votosListaP);

        contenidoAgrupaciones.appendChild(izquierda);
        contenidoAgrupaciones.appendChild(derecha);

        agrupacionDiv.appendChild(contenidoAgrupaciones);

        contenedorAgrupaciones.appendChild(agrupacionDiv);
        var progressDiv = document.createElement("div");
        progressDiv.classList.add("progress");
        progressDiv.style.background = color.colorLiviano;

        //barra
        var progressBarDiv = document.createElement("div");
        progressBarDiv.classList.add("progress-bar");
        progressBarDiv.style.width = porcentajeLista + "%";
        progressBarDiv.style.background = color.colorPleno;

        var progressBarText = document.createElement("span");
        progressBarText.classList.add("progress-bar-text");
        progressBarText.textContent = porcentajeLista + "%";

        progressBarDiv.appendChild(progressBarText);
        progressDiv.appendChild(progressBarDiv);
        agrupacionDiv.appendChild(progressDiv);
      }
    }
    chartWrapDiv.appendChild(grid);
    chartWrapDiv.style.display = "block";
    contenedorAgrupaciones.style.display = "block";
  }
};
