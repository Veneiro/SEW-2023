class Noticias {
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            //El navegador soporta el API File
            const a = document.createElement('article');
            a.innerHTML = "<h4>Soporte de api file:</h4><p>Este navegador soporta el API File</p>";
            document.querySelector('section').append(a);

            const input = document.querySelector("input");
            input.addEventListener('change', this.readInputFile);
        }

        else {
            const a = document.createElement('article');
            a.innerHTML = "<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>";
            document.querySelector('section').append(a);
        }
    }

    readInputFile() {
        const input = document.querySelector("input");
        var archivo = input.files[0];
        var tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                var n = (lector.result.split('\n'));
                n.forEach(nEle => {
                    var a = document.createElement('article');
                    nEle = nEle.split('_');
                    var p1 = document.createElement('h4');
                    var p2 = document.createElement('h5');
                    var p3 = document.createElement('p');
                    var p4 = document.createElement('p');
                    p1.innerHTML = nEle[0];
                    p2.innerHTML = nEle[1];
                    p3.innerHTML = nEle[2];
                    p4.innerHTML = nEle[3];
                    a.append(p1);
                    a.append(p2);
                    a.append(p3);
                    a.append(p4);
                    document.querySelector('section').append(a);
                });
            }
            lector.readAsText(archivo);
        }
        else {
            console.log("Error : ¡¡¡ Archivo no válido !!!");
        }
    };
}

const noticias = new Noticias();