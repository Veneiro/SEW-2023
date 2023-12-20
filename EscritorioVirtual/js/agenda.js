class Agenda{
    constructor(){
        this.url = "https://ergast.com/api/f1/current.json";
        this.last_api_call = null;
        this.last_api_result = null;
    }

    intialice(){
        const a = document.createElement("button");
        a.textContent = "Cargar Datos";
        a.addEventListener("click", () => {
           this.obtain_current_season(this.url);
        });
        document.querySelector("main").append(a);
    }

    obtain_current_season(url){
        if(this.last_api_call == null){
           this.callApi(url);
        } else {
            if(Date.now() - this.last_api_call > 120000){
                this.callApi(url);
            } else{
                $("main").append(this.last_api_result);
            }
        }
    }

    callApi(url){
        $.ajax({
            dataType: "json",
            url: url,
            method: "GET",
            success: (datos) => {                  
              var stringDatos = "<h3>Carreras</h3>";
              stringDatos += "<h4> Season " + datos.MRData.RaceTable.season + "</h4>";
              (datos.MRData.RaceTable.Races).forEach(element => {
                stringDatos += "<section><h3>" + element.raceName + "</h3>";
                stringDatos += "<p>Circuito: " + element.Circuit.circuitName + "</p>";
                stringDatos += "<p>Coordenadas: " + element.Circuit.Location.lat + ", " + element.Circuit.Location.long + "</p>";
                stringDatos += "<p>Fecha: " + element.date  + "</p>";
                stringDatos += "<p>Hora: " + element.time + "</p>";
                stringDatos += "</section>";
                this.last_api_result = stringDatos;
                this.last_api_call = Date.now();
              });
              $("main").append(stringDatos);
            },
            error: function () {
              $("h3").html(
                "No se pudo obtener el JSON"
              );
              $("h4").remove();
              $("pre").remove();
              $("p").remove();
            },
          });
    }
}

var agenda = new Agenda();
agenda.intialice();