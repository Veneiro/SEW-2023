class Viajes {
  button1 = $("button:eq(2)");
  button2 = $("button:eq(3)");
  button3 = $("button:eq(4)");
  lugares = [];

  constructor() {
    $(this.init.bind(this));
  }

  init() {
    navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this));
    this.button1.on("click", this.verTodo.bind(this));
    this.button2.on("click", this.getMapaEstaticoGoogle.bind(this));
    this.button3.on("click", this.initMap.bind(this));
    $('input[type="file"]')
      .eq(0)
      .on("change", function (e) {
        miPosicion.cargarXML(e.target);
      });
    $('input[type="file"]')
      .eq(1)
      .on("change", function (e) {
        miPosicion.loadKML(e.target.files);
      });
    $('input[type="file"]:eq(2)').on("change", function (e) {
      miPosicion.readAndRenderSVG(e.target.files);
    });
  }
  getPosicion(posicion) {
    this.mensaje =
      "Se ha realizado correctamente la petición de geolocalización";
    this.longitud = posicion.coords.longitude;
    this.latitud = posicion.coords.latitude;
    this.precision = posicion.coords.accuracy;
    this.altitud = posicion.coords.altitude;
    this.precisionAltitud = posicion.coords.altitudeAccuracy;
    this.rumbo = posicion.coords.heading;
    this.velocidad = posicion.coords.speed;
  }
  verErrores(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.mensaje = "El usuario no permite la petición de geolocalización";
        break;
      case error.POSITION_UNAVAILABLE:
        this.mensaje = "Información de geolocalización no disponible";
        break;
      case error.TIMEOUT:
        this.mensaje = "La petición de geolocalización ha caducado";
        break;
      case error.UNKNOWN_ERROR:
        this.mensaje = "Se ha producido un error desconocido";
        break;
    }
  }
  getLongitud() {
    return this.longitud;
  }
  getLatitud() {
    return this.latitud;
  }
  getAltitud() {
    return this.altitud;
  }
  verTodo() {
    const s = document.createElement("article");
    s.innerHTML = "<h3>Mi Posición Actual</h3>";
    var section = document.querySelector("section");
    var datos = "<p>" + this.mensaje + "</p>";
    datos += "<p>Longitud: " + this.longitud + " grados</p>";
    datos += "<p>Latitud: " + this.latitud + " grados</p>";
    datos +=
      "<p>Precisión de la longitud y latitud: " +
      this.precision +
      " metros</p>";
    datos += "<p>Altitud: " + this.altitud + " metros</p>";
    datos +=
      "<p>Precisión de la altitud: " + this.precisionAltitud + " metros</p>";
    datos += "<p>Rumbo: " + this.rumbo + " grados</p>";
    datos += "<p>Velocidad: " + this.velocidad + " metros/segundo</p>";
    s.innerHTML += datos; // Utiliza innerHTML en lugar de append para reemplazar el contenido actual
    section.innerHTML = s.innerHTML;
  }

  getMapaEstaticoGoogle() {
    const s = document.createElement("article");
    var section = document.querySelector("section");
    s.innerHTML = "<h3>Mapa Estático</h3>";
    var apiKey = "&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU";
    var url = "https://maps.googleapis.com/maps/api/staticmap?";
    var centro = "center=" + this.latitud + "," + this.longitud;
    var zoom = "&zoom=15";
    var tamaño = "&size=800x600";
    var marcador =
      "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
    var sensor = "&sensor=false";

    this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
    s.innerHTML +=
      "<img src='" + this.imagenMapa + "' alt='mapa estático google' />";
    section.innerHTML = s.innerHTML;
  }

  initMap() {
    var centro = { lat: this.latitud, lng: this.longitud };
    var mapaGeoposicionado = new google.maps.Map(
      document.querySelector("section"),
      {
        zoom: 8,
        center: centro,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      }
    );

    var infoWindow = new google.maps.InfoWindow();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Localización encontrada");
          infoWindow.open(mapaGeoposicionado);
          mapaGeoposicionado.setCenter(pos);
        },
        function () {
          handleLocationError(true, infoWindow, mapaGeoposicionado.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, mapaGeoposicionado.getCenter());
    }
  }

  initMapPlanimetría() {
    var Bruselas = { lat: 50.85045, lng: 4.34878 };
    var mapaBruselas = new google.maps.Map(document.querySelector("section"), {
      zoom: 8,
      center: Bruselas,
    });

    // Verifica si hay coordenadas antes de iterar
    if (this.lugares.length > 0) {
      // Objeto para almacenar colores asociados a cada archivo KML
      var colorPorKML = {};

      this.lugares.forEach(function (place, index) {
        var coords = place.map(Number); // Convierte las coordenadas a números
        var livingIn = { lat: coords[1], lng: coords[0] }; // Orden corregido: latitud, longitud

        // Obtiene el color asociado al archivo KML actual o genera uno nuevo
        var kmlFileName = place.fileName; // Suponiendo que tienes el nombre del archivo en el conjunto de puntos
        var markerColor =
          colorPorKML[kmlFileName] || miPosicion.getRandomColor();

        // Almacena el color en el objeto colorPorKML
        colorPorKML[kmlFileName] = markerColor;

        var marcador = new google.maps.Marker({
          position: livingIn,
          map: mapaBruselas,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: markerColor,
            fillOpacity: 1.0,
            strokeColor: "#ffffff", // Borde blanco
            strokeWeight: 2,
            scale: 8, // Tamaño del círculo
          },
        });
      });
    }
  }

  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  processData(data, fileName) {
    var coordenadas = [];

    var parser = new DOMParser();
    var dom = parser.parseFromString(data, "text/xml");
    var placemarks = dom.querySelectorAll("Placemark");

    placemarks.forEach((placemark) => {
      var coordinatesElement = placemark.querySelector("coordinates");
      if (coordinatesElement) {
        var coordinates = coordinatesElement.textContent.trim().split(",");
        // Añade el nombre del archivo KML a cada conjunto de puntos
        coordinates.fileName = fileName;
        coordenadas.push(coordinates);
      }
    });

    // Agregar las nuevas coordenadas a las existentes
    this.lugares = this.lugares.concat(coordenadas);
    this.initMapPlanimetría();
  }

  loadKML(inputFiles) {
    const filesArray = Array.from(inputFiles);

    if (inputFiles.length === 0) {
      console.error("No se han seleccionado archivos.");
      return;
    }

    // Iterar sobre los archivos
    filesArray.forEach((file) => {
      var reader = new FileReader();

      reader.onload = (e) => this.processData(reader.result, file.name);

      reader.readAsText(file);
    });
  }

  cargarXML(inputFile) {
    let file = inputFile.files[0];

    if (file) {
      let reader = new FileReader();

      reader.onload = function (e) {
        let xmlDoc = $.parseXML(e.target.result);
        let $xml = $(xmlDoc);

        let seccion = document.querySelector("section");

        seccion.innerHTML = "<h3>Rutas</h3>";

        $xml.find("ruta").each(function () {
          let $ruta = $(this);

          // Extraer información de la ruta
          let nombreRuta = $ruta.find("nombreRuta").text();
          let tipoRuta = $ruta.find("tipoRuta").text();
          let medioTransporte = $ruta.find("medioTransporte").text();
          let fechaInicio = $ruta.find("fechaInicio").text();
          let horaInicio = $ruta.find("horaInicio").text();
          let duracion = $ruta.find("duracion").text();
          let agencia = $ruta.find("agencia").text();
          let descripcion = $ruta.find("descripcion").text();
          let adecuadoPara = $ruta.find("adecuadoPara").text();
          let lugarInicio = $ruta.find("lugarInicio").text();
          let direccionInicio = $ruta.find("direccionInicio").text();
          let coordenadasInicio = $ruta.find("coordenadasInicioRuta");
          let referencias = $ruta.find("referencias referencia");
          let puntuacion = $ruta.find("puntuacion").text();
          let hitos = $ruta.find("hitos hito");

          let contenidoRuta = `
            <article>
              <h4>${nombreRuta}</h4>
              <p>Tipo de Ruta: ${tipoRuta}</p>
              <p>Medio de Transporte: ${medioTransporte}</p>
              <p>Fecha de Inicio: ${fechaInicio}</p>
              <p>Hora de Inicio: ${horaInicio}</p>
              <p>Duración: ${duracion}</p>
              <p>Agencia: ${agencia}</p>
              <p>Descripción: ${descripcion}</p>
              <p>Adecuado Para: ${adecuadoPara}</p>
              <p>Lugar de Inicio: ${lugarInicio}</p>
              <p>Dirección de Inicio: ${direccionInicio}</p>
            </article>
          `;

          // Agregar coordenadas de inicio
          if (coordenadasInicio.length > 0) {
            let latitud = coordenadasInicio.attr("lat");
            let longitud = coordenadasInicio.attr("long");
            let elevacion = coordenadasInicio.attr("ele");
            contenidoRuta += `<p>Coordenadas de Inicio: Latitud ${latitud}, Longitud ${longitud}, Elevación ${elevacion}</p>`;
          }

          // Agregar referencias
          if (referencias.length > 0) {
            contenidoRuta += "<p>Referencias:</p><ul>";
            referencias.each(function () {
              let referencia = $(this).text();
              contenidoRuta += `<li><a href="${referencia}" target="_blank">${referencia}</a></li>`;
            });
            contenidoRuta += "</ul>";
          }

          // Agregar puntuación
          contenidoRuta += `<p>Puntuación: ${puntuacion}</p>`;

          // Agregar información de hitos
          if (hitos.length > 0) {
            contenidoRuta += "<p>Hitos:</p><ul>";
            hitos.each(function () {
              let $hito = $(this);
              let nombreHito = $hito.find("nombreHito").text();
              let descripcionHito = $hito.find("descripcionHito").text();
              let coordenadasHito = $hito.find("coordenadasHito");
              let distanciaAnteriorHito = $hito
                .find("distanciaAnteriorHito")
                .text();
              let fotosHito = $hito.find("fotos foto");
              let videosHito = $hito.find("videos video");

              contenidoRuta += `<li>${nombreHito} - ${descripcionHito}`;

              // Agregar coordenadas del hito
              if (coordenadasHito.length > 0) {
                let latitudHito = coordenadasHito.attr("lat");
                let longitudHito = coordenadasHito.attr("long");
                let elevacionHito = coordenadasHito.attr("ele");
                contenidoRuta += `, Coordenadas: Latitud ${latitudHito}, Longitud ${longitudHito}, Elevación ${elevacionHito}`;
              }

              // Agregar distancia desde el hito anterior
              contenidoRuta += `, Distancia desde el anterior: ${distanciaAnteriorHito}`;

              // Agregar fotos del hito
              if (fotosHito.length > 0) {
                contenidoRuta += "<p>Fotos del Hito:</p><ul>";
                fotosHito.each(function () {
                  contenidoRuta += `<li> Image: ${$(this).text()} </li>`;
                });
                contenidoRuta += "</ul>";
              }

              // Agregar videos del hito
              if (videosHito.length > 0) {
                contenidoRuta += "<p>Videos del Hito:</p><ul>";
                videosHito.each(function () {
                  contenidoRuta += `<li> Video: ${$(this).text()}</li>`;
                });
                contenidoRuta += "</ul>";
              }

              contenidoRuta += "</li>";
            });
            contenidoRuta += "</ul>";
          }

          contenidoRuta += "</article>";

          seccion.innerHTML += contenidoRuta;
        });
      };

      reader.readAsText(file);
    } else {
      console.error("No se ha seleccionado ningún archivo.");
    }
  }

  readAndRenderSVG(inputFiles) {
    const container = document.querySelector("section");
    container.innerHTML = "";
    for (let i = 0; i < inputFiles.length; i++) {
      if (inputFiles[i]) {
        let reader = new FileReader();
        reader.onload = function (e) {
          let svg = e.target.result;
          container.innerHTML += svg;
        };
        reader.readAsText(inputFiles[i]);
      }
    }
  }

  initCarousel() {
    const slides = document.querySelectorAll("img");

    // select next slide button
    const nextSlide = document.querySelector("button[data-action='next']");

    // current slide counter
    let curSlide = 3;
    // maximum number of slides
    let maxSlide = slides.length - 1;

    // add event listener and navigation functionality
    nextSlide.addEventListener("click", function () {
      // check if current slide is the last and reset current slide
      if (curSlide === maxSlide) {
        curSlide = 0;
      } else {
        curSlide++;
      }

      //   move slide by -100%
      slides.forEach((slide, indx) => {
        var trans = 100 * (indx - curSlide);
        $(slide).css("transform", "translateX(" + trans + "%)");
      });
    });

    // select next slide button
    const prevSlide = document.querySelector("button[data-action='prev']");

    // add event listener and navigation functionality
    prevSlide.addEventListener("click", function () {
      // check if current slide is the first and reset current slide to last
      if (curSlide === 0) {
        curSlide = maxSlide;
      } else {
        curSlide--;
      }

      //   move slide by 100%
      slides.forEach((slide, indx) => {
        var trans = 100 * (indx - curSlide);
        $(slide).css("transform", "translateX(" + trans + "%)");
      });
    });
  }
}

var miPosicion = new Viajes();
miPosicion.initCarousel();
