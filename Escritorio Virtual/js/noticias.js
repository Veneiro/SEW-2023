class Noticias {
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            //El navegador soporta el API File
            const a = document.createElement('article');
            a.innerHTML = "<p>Este navegador soporta el API File </p>";
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
                    nEle.split('_');
                    a.innerHTML = nEle;
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