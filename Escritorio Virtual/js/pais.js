class Pais{
    constructor(nombre, capital, poblacion){
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;
    }

    setAtributosSecundarios(gobierno, coordCapital, religion){
        this.gobierno = gobierno;
        this.coordCapital = coordCapital;
        this.religion = religion;
    }

    getNombreYCapital(){
        return this.nombre + " " + this.capital;
    }

    getAtributosSecundarios(){
        var attrb = "";
        attrb += "<p> Poblacion: " + this.poblacion + "<\p>";
        attrb += "<p> Gobierno: " + this.gobierno + "<\p>";
        attrb += "<p> Religión: " + this.religion + "<\p>";
        return attrb;
    }

    insertCoordCapital(){
        document.write("<p>" + this.coordCapital + "</p>");
    }
}

var pais = new Pais("Belgica", "Bruselas", 11590000);
pais.setAtributosSecundarios("Monarquía Federal Parlamentaria", "50.846667, 4.351667", "Catolicismo");
document.write("<p>" + pais.getNombreYCapital() + "</p>");
document.write("<article>" + pais.getAtributosSecundarios() + "</article>");
pais.insertCoordCapital();