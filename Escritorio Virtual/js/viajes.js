class Viajes {
  button1 = $("button:eq(0)");
  button2 = $("button:eq(1)");
  button3 = $("button:eq(2)");

  constructor() {
    navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this));
    this.button1.on("click", this.verTodo.bind(this));
    this.button2.on("click", this.getMapaEstaticoGoogle.bind(this));
    this.button3.on("click", this.initMap.bind(this));
    $('input[type="file"]:eq(0)').on('change', function (e) {
      miPosicion.cargarXML(e.target);
    });
    $('input[type="file"]:eq(1)').on('change', function (e) {
      miPosicion.initMapPlanimetría(e.target);
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
    s.innerHTML = "<h3>Mi Posición Actual</h3>"
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
    s.innerHTML = "<h3>Mapa Estático</h3>"
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
    var mapaGeoposicionado = new google.maps.Map(document.querySelector("section"), {
      zoom: 8,
      center: centro,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infoWindow = new google.maps.InfoWindow();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent('Localización encontrada');
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

  initMapPlanimetría(inputFile) {
    const file = inputFile.files[0];
    let map = new google.maps.Map(document.querySelectorAll('section')[0], {
      center: new google.maps.LatLng(51.198006, 3.219436),
      zoom: 10,
      mapTypeId: 'terrain'
    });

    var kmlLayer = new google.maps.KmlLayer(file, {
      suppressInfoWindows: true,
      preserveViewport: false,
      map: map
    });
    kmlLayer.addListener('click', function (event) {
      var content = event.featureData.infoWindowHtml;
      var testimonial = document.querySelectorAll('section')[0];
      testimonial.innerHTML = content;
    });
  }

  cargarXML(inputFile) {
    const file = inputFile.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const xmlDoc = $.parseXML(e.target.result);
        const $xml = $(xmlDoc);

        const seccion = document.querySelector("section");

        seccion.innerHTML = "<h3>Rutas</h3>";

        $xml.find("ruta").each(function () {
          const $ruta = $(this);

          const nombreRuta = $ruta.find("nombreRuta").text();
          const tipoRuta = $ruta.find("tipoRuta").text();
          const medioTransporte = $ruta.find("medioTransporte").text();
          const fechaInicio = $ruta.find("fechaInicio").text();
          const horaInicio = $ruta.find("horaInicio").text();
          const duracion = $ruta.find("duracion").text();
          const agencia = $ruta.find("agencia").text();
          const descripcion = $ruta.find("descripcion").text();
          const adecuadoPara = $ruta.find("adecuadoPara").text();
          const lugarInicio = $ruta.find("lugarInicio").text();
          const direccionInicio = $ruta.find("direccionInicio").text();
          
          const contenidoRuta = `
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

          
          seccion.innerHTML += contenidoRuta;
        });
      };

      reader.readAsText(file);
    } else {
      console.error("No se ha seleccionado ningún archivo.");
    }
  }



}

var miPosicion = new Viajes();
