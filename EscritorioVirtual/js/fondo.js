class Fondo {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async buscarImagenesAleatoria(tag) {
        const apiUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${this.apiKey}&tags=${tag}&format=json&nojsoncallback=1`;
        
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.photos && data.photos.photo.length > 0) {
                const imagenes = data.photos.photo;
                const imagenAleatoria = this.obtenerImagenAleatoria(imagenes);
                const imageUrl = this.construirUrlImagen(imagenAleatoria);
                return imageUrl;
            } else {
                throw new Error(`No se encontraron imágenes con el tag: ${tag}`);
            }
        } catch (error) {
            console.error('Error al buscar imágenes:', error);
            throw error;
        }
    }

    obtenerImagenAleatoria(array) {
        const indiceAleatorio = Math.floor(Math.random() * array.length);
        return array[indiceAleatorio];
    }

    construirUrlImagen(photo) {
        return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
    }

    async establecerFondoAleatorio(tag) {
        try {
            const imageUrl = await this.buscarImagenesAleatoria(tag);

            // Cambiar el fondo del body o de un contenedor específico
            document.body.style.backgroundImage = `url('${imageUrl}')`;
            document.body.style.backgroundSize = 'cover';
            // Si tienes un contenedor específico, puedes usar algo como:
            // document.getElementById('miContenedor').style.backgroundImage = `url('${imageUrl}')`;
            // document.getElementById('miContenedor').style.backgroundSize = 'cover';
        } catch (error) {
            // Manejar errores
            console.error('Error al establecer el fondo:', error);
        }
    }
}

// Uso de la clase Fondo
const apiKey = "2bc5f478c0529f22d90b4103a67d6b20";
const fondo = new Fondo(apiKey);

// Establecer una imagen aleatoria con el tag "bruselas" como fondo
fondo.establecerFondoAleatorio('bruselas');
