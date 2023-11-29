("use strict");
class Pais {
  constructor(nombre, capital, poblacion) {
    this.nombre = nombre;
    this.capital = capital;
    this.poblacion = poblacion;

    this.apikey = "ff03cf1de5d47b151a031ab0ff83134d";
    this.ciudad = "Oviedo";
    this.codigoPais = "ES";
    this.unidades = "&units=metric";
    this.idioma = "&lang=es";
    this.cnt = 5;
    this.url =
      "http://api.openweathermap.org/data/2.5/forecast?q=" +
      this.ciudad +
      "," +
      this.codigoPais +
      "&cnt=" +
      this.cnt +
      "&units=" +
      this.unidades +
      "&lang=" +
      this.idioma +
      "&APPID=" +
      this.apikey;
  }

  setAtributosSecundarios(gobierno, coordCapital, religion) {
    this.gobierno = gobierno;
    this.coordCapital = coordCapital;
    this.religion = religion;
  }

  getNombreYCapital() {
    return this.nombre + " " + this.capital;
  }

  getAtributosSecundarios() {
    var attrb = "";
    attrb += "<p> Poblacion: " + this.poblacion + "<p>";
    attrb += "<p> Gobierno: " + this.gobierno + "<p>";
    attrb += "<p> Religión: " + this.religion + "<p>";
    return attrb;
  }

  insertCoordCapital() {
    document.write("<p>" + this.coordCapital + "</p>");
  }

  cargarDatos() {
    $.ajax({
      dataType: "json",
      url: this.url,
      method: "GET",
      success: function (datos) {
        $("pre").text(JSON.stringify(datos, null, 2)); //muestra el json en un elemento pre
        console.log(this.url)
        console.log(datos)
        /**
        //PresentaciÃ³n de los datos contenidos en JSON
        var stringDatos = "<h2>Pronóstico para 5 días</h2>";
        stringDatos += "<ul><li>Ciudad: " + datos.name + "</li>";
        stringDatos += "<li>PaÃ­s: " + datos.sys.country + "</li>";
        stringDatos += "<li>Latitud: " + datos.coord.lat + " grados</li>";
        stringDatos += "<li>Longitud: " + datos.coord.lon + " grados</li>";
        stringDatos +=
          "<li>Temperatura: " + datos.main.temp + " grados Celsius</li>";
        stringDatos +=
          "<li>Temperatura mÃ¡xima: " +
          datos.main.temp_max +
          " grados Celsius</li>";
        stringDatos +=
          "<li>Temperatura mÃ­nima: " +
          datos.main.temp_min +
          " grados Celsius</li>";
        stringDatos +=
          "<li>PresiÃ³n: " + datos.main.pressure + " milibares</li>";
        stringDatos += "<li>Humedad: " + datos.main.humidity + " %</li>";
        stringDatos +=
          "<li>Amanece a las: " +
          new Date(datos.sys.sunrise * 1000).toLocaleTimeString() +
          "</li>";
        stringDatos +=
          "<li>Oscurece a las: " +
          new Date(datos.sys.sunset * 1000).toLocaleTimeString() +
          "</li>";
        stringDatos +=
          "<li>DirecciÃ³n del viento: " + datos.wind.deg + " grados</li>";
        stringDatos +=
          "<li>Velocidad del viento: " +
          datos.wind.speed +
          " metros/segundo</li>";
        stringDatos +=
          "<li>Hora de la medida: " +
          new Date(datos.dt * 1000).toLocaleTimeString() +
          "</li>";
        stringDatos +=
          "<li>Fecha de la medida: " +
          new Date(datos.dt * 1000).toLocaleDateString() +
          "</li>";
        stringDatos +=
          "<li>DescripciÃ³n: " + datos.weather[0].description + "</li>";
        stringDatos += "<li>Visibilidad: " + datos.visibility + " metros</li>";
        stringDatos += "<li>Nubosidad: " + datos.clouds.all + " %</li></ul>";
        pais.crearElemento("p",stringDatos, "body");
         */
      },
      error: function () {
        $("h3").html(
          "Â¡Tenemos problemas! No puedo obtener JSON de <a href='http://openweathermap.org'>OpenWeatherMap</a>"
        );
        $("h4").remove();
        $("pre").remove();
        $("p").remove();
      },
    });
  }

  crearElemento(tipoElemento, texto, insertarAntesDe) {
    // Crea un nuevo elemento modificando el Ã¡rbol DOM
    // El elemnto creado es de 'tipoElemento' con un 'texto'
    // El elemnto se coloca antes del elemnto 'insertarAntesDe'
    var elemento = document.createElement(tipoElemento);
    elemento.innerHTML = texto;
    $(insertarAntesDe).append(elemento);
  }

  verJSON() {
    //Muestra el archivo JSON recibido
    this.crearElemento(
      "h2",
      "Datos en JSON desde <a href='http://openweathermap.org'>OpenWeatherMap</a>",
      "main"
    );
    this.crearElemento("h3", this.correcto, "main"); // Crea un elemento con DOM
    this.crearElemento("h4", "JSON", "main"); // Crea un elemento con DOM
    this.crearElemento("pre", "", "main"); // Crea un elemento con DOM para el string con JSON
    this.crearElemento("h4", "Datos", "main"); // Crea un elemento con DOM
    this.crearElemento("p", "", "main"); // Crea un elemento con DOM para los datos obtenidos con JSON
    this.cargarDatos();
    $("button").attr("disabled", "disabled");
  }
}

var pais = new Pais("Belgica", "Bruselas", 11590000);
pais.setAtributosSecundarios(
"Monarquía Federal Parlamentaria",
"50.846667, 4.351667",
"Catolicismo"
);
pais.crearElemento("p",  pais.getNombreYCapital(), "body");
pais.crearElemento("article", pais.getAtributosSecundarios(), "body");

pais.cargarDatos();
//document.write("<p>" + pais.getNombreYCapital() + "</p>");
//document.write("<article>" + pais.getAtributosSecundarios() + "</article>");
pais.insertCoordCapital();


