<?php

class Carrusel
{
  private $capital;
  private $country;

  public function __construct($capital, $country)
  {
    $this->capital = $capital;
    $this->country = $country;
  }

  public function getPhotosByLocation($apiKey)
  {
    // Construir la URL de la API de Flickr
    $url = "https://www.flickr.com/services/rest/?" . http_build_query([
      'method' => 'flickr.photos.search',
      'api_key' => $apiKey,
      'format' => 'json',
      'nojsoncallback' => 1,
      'text' => $this->capital . ' ' . $this->country,
      'sort' => 'relevance',
      'per_page' => 10,
    ]);

    // Realizar la solicitud a la API de Flickr
    $response = file_get_contents($url);
    $data = json_decode($response, true);

    // Obtener enlaces a las fotos
    $photoLinks = [];
    if ($data && isset($data['photos']['photo'])) {
      foreach ($data['photos']['photo'] as $photo) {
        $farmId = $photo['farm'];
        $serverId = $photo['server'];
        $photoId = $photo['id'];
        $secret = $photo['secret'];

        // Construir el enlace a la foto
        $photoLink = "https://farm{$farmId}.staticflickr.com/{$serverId}/{$photoId}_{$secret}.jpg";
        $photoLinks[] = $photoLink;
      }
    }

    return $photoLinks;
  }
}

class Moneda
{

    public function __construct(){}

    public function convertirEurosADolares($cantidad)
    {
        $url = "https://open.er-api.com/v6/latest";

        // Parámetros de la solicitud
        $params = [
            'base' => 'EUR',
            'symbols' => 'USD',
        ];

        // Agregar parámetros a la URL
        $url .= '?' . http_build_query($params);

        // Realizar la solicitud a la API de tasas de cambio
        $response = file_get_contents($url);
        $data = json_decode($response, true);

        // Verificar si la solicitud fue exitosa
        if ($data && isset($data['rates']['USD'])) {
            $tasaCambio = $data['rates']['USD'];
            $resultado = $cantidad * $tasaCambio;
            return $resultado;
        } else {
            return null; // Manejar el error según sea necesario
        }
    }
}
?>


<!DOCTYPE html>

<html lang="es">

<head>
  <!-- Datos que describen el documento -->
  <meta charset="UTF-8"/>
  <title>Escritorio Virtual - Viajes</title>
  <meta name="author" content="Mateo Rico Iglesias" />
  <meta name="description" content="Lista de viajes" />
  <meta name="keywords" content="viajes, bruselas, rutas" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
  <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
  <link rel="stylesheet" type="text/css" href="estilo/viajes.css" />
  <link rel="icon" href="multimedia/imagenes/favicon.ico" />
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
</head>

<body>
  <header>
    <h1>Escritorio Virtual</h1>
    <nav>
      <a href="./index.html" accesskey="P" tabindex="1">Página Principal</a>
      <a href="./sobremi.html" accesskey="S" tabindex="7">Sobre Mí</a>
      <a href="./noticias.html" accesskey="N" tabindex="2">Noticias</a>
      <a href="./agenda.html" accesskey="A" tabindex="6">Agenda</a>
      <a href="./meteorologia.html" accesskey="M" tabindex="4">Meteorología</a>
      <a href="./viajes.php" accesskey="V" tabindex="3">Viajes</a>
      <a href="./juegos.html" accesskey="J" tabindex="5">Juegos</a>
    </nav>
  </header>
  <!-- Datos con el contenidos que aparece en el navegador -->
  <main>
    <h2>Viajes</h2>
    <article>
      <h3>Carrusel de Imágenes</h3>

      <?php
      $apiKey = '2bc5f478c0529f22d90b4103a67d6b20';
      $capital = 'Bruselas';
      $country = 'Belgica';
      $flickrDownloader = new Carrusel($capital, $country);
      $photos = $flickrDownloader->getPhotosByLocation($apiKey);
      foreach ($photos as $index => $photo) {
        echo '<img src="' . $photo . '" alt="Imagen ' . ($index + 1) . ' carousel" />';
      }
      ?>

      <button data-action="next"> N </button>
      <button data-action="prev"> P </button>
    </article>
    <article>
      <h3>Conversión de Moneda</h3>

      <?php
      // Ejemplo de conversión de euros a dólares
      $cantidadEuros = 1;
      $moneda = new Moneda(); // Reemplaza con tu clave de API
      $cantidadDolares = $moneda->convertirEurosADolares($cantidadEuros);

      echo '<p>' . $cantidadEuros . ' Euros son aproximadamente ' . $cantidadDolares . ' Dólares</p>';
      ?>
    </article>
    <h3>Geolocalización</h3>
    <button>Obtener mi posición</button>
    <button>Mapa estático de mi posición</button>
    <button>Mapa dinámico de mi posición</button>
    <label for="archivoXML">Rutas:</label>
    <input type="file" id="archivoXML" accept=".xml" />

    <label for="archivoPlanimetría">Planimetría:</label>
    <input type="file" id="archivoPlanimetría" accept=".kml" multiple />

    <label for="archivoAltimetría">Altimetría:</label>
    <input type="file" id="archivoAltimetría" accept=".svg" multiple />
    <section><h4>Contenido</h4></section>
  </main>
  <script src="./js/viajes.js"></script>
  <script
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU&libraries=places&callback=miPosicion.init"></script>
</body>

</html>