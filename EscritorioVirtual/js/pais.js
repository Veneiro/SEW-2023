("use strict");
class Pais {
  constructor(nombre, capital, poblacion) {
    this.nombre = nombre;
    this.capital = capital;
    this.poblacion = poblacion;

    this.apikey = "ff03cf1de5d47b151a031ab0ff83134d";
    this.ciudad = "Bruselas";
    this.codigoPais = "BEL";
    this.unidades = "metric";
    this.idioma = "&lang=es";
    this.cnt = 5 * 8;
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
        
        //PresentaciÃ³n de los datos contenidos en JSON
        var stringDatos = "<section><h2>Pronóstico para 5 días</h2>";
        stringDatos += "<p>Ciudad: " + datos.city.name + "</p>";
        datos.list.filter((item, index) => index % 8 === 0).forEach(day => {
          stringDatos += "<h3>" + day.dt_txt + "</h3>";
          stringDatos += "<p>Máxima "+ day.main.temp_max + " Cº</p>";
          stringDatos += "<p>Mínima "+ day.main.temp_min + " Cº</p>";
          stringDatos += "<p>Humedad "+ day.main.humidity + " %</p>";
          if(day.rain != undefined){
            stringDatos += "<p>l/m2 "+ day.rain["3h"] + "</p>";
          } else {
            stringDatos += "<p>l/m2 0</p>";
          }
          stringDatos += "<p>"+ day.weather[0].description + "</p>";
          stringDatos += "<img src='http://openweathermap.org/img/w/" + day.weather[0].icon + ".png' alt='Weather icon for the day'/>";
        });
        stringDatos += "</section>";
        pais.crearElemento("p",stringDatos, "body");
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
    $(insertarAntesDe).append(texto);
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
//pais.crearElemento("p",  pais.getNombreYCapital(), "body");
//pais.crearElemento("article", pais.getAtributosSecundarios(), "body");

pais.cargarDatos();
//document.write("<p>" + pais.getNombreYCapital() + "</p>");
//document.write("<article>" + pais.getAtributosSecundarios() + "</article>");
//pais.insertCoordCapital();


