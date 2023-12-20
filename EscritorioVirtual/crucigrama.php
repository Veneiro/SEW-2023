<?php
class Conexion
{

    function __construct()
    {
        $this->url = "localhost";
        $this->usuario = "DBUSER2023";
        $this->pass = "DBPSWD2023";
        $this->bd = "records";
        $this->conexion = new mysqli($this->url, $this->usuario, $this->pass);

        if ($this->conexion->connect_error) {
            die("Error en la conexión: " . $this->conexion->connect_error);
        }

        // Verifica si la base de datos existe, si no, la crea
        try {
            // Selecciona la base de datos
            $this->conexion->select_db($this->bd);
        } catch (Exception $e) {
            $this->crearBaseDeDatos();
            $this->conexion->select_db($this->bd);
        }

        // Verifica si la tabla existe, si no, la crea
        if (!$this->verificarTabla()) {
            $this->crearTabla();
        }
    }

    // Método para crear la base de datos
    function crearBaseDeDatos()
    {
        $sql = "CREATE DATABASE IF NOT EXISTS " . $this->bd;
        if ($this->conexion->query($sql) === FALSE) {
            die("Error al crear la base de datos: " . $this->conexion->error);
        }
    }

    // Método para verificar si la tabla existe
    function verificarTabla()
    {
        $result = $this->conexion->query("SHOW TABLES LIKE 'registro'");
        return $result->num_rows > 0;
    }

    // Método para crear la tabla
    function crearTabla()
    {
        $sql = "CREATE TABLE registro (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre TEXT,
            apellidos TEXT,
            nivel TEXT,
            tiempo INT
        )";
        if ($this->conexion->query($sql) === FALSE) {
            die("Error al crear la tabla: " . $this->conexion->error);
        }
    }

    function insertar($nombre, $apellidos, $nivel, $tiempo)
    {
        $sql = 'INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)';
        $sentencia = $this->conexion->prepare($sql);

        if ($sentencia == false) {
            die("Error en la inserción: " . $this->conexion->error);
        }

        // i(entero) d(real) s(cadena) b(blob)
        $sentencia->bind_param('sssi', $nombre, $apellidos, $nivel, $tiempo);

        $result = $sentencia->execute();

        if ($result == false) {
            die("Error de insercion: ") . $sentencia->error;
        }

    }

    function total10()
    {
        $sql = 'SELECT nombre, apellidos, nivel, tiempo FROM registro ORDER BY tiempo DESC LIMIT 10';
        $sentencia = $this->conexion->prepare($sql);

        if ($sentencia == false) {
            die("Error en la inserción: " . $this->conexion->error);
        }

        // i(entero) d(real) s(cadena) b(blob)
        $sentencia->bind_result($nombre, $apellidos, $nivel, $tiempo);

        $sentencia->execute();

        $result = [];
        while ($sentencia->fetch()) {
            $result[] = [
                'nombre' => $nombre,
                'apellidos' => $apellidos,
                'nivel' => $nivel,
                'tiempo' => $tiempo
            ];
        }
        return $result;
    }
}

$conexion = new Conexion();
if (isset($_POST['nombre'])) {
    $nombre = $_POST['nombre'];
    $apellidos = $_POST['apellidos'];
    $nivel = $_POST['nivel'];
    $tiempo = $_POST['tiempo'];
    $conexion->insertar($nombre, $apellidos, $nivel, $tiempo);
    header('Location:crucigrama.php?mostrar=mostrar');
}

if (isset($_GET['mostrar'])) {
    $datos = $conexion->total10();
}
?>
<!DOCTYPE HTML>

<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Escritorio Virtual - Crucigrama</title>
    <meta name="author" content="Mateo Rico Iglesias" />
    <meta name="description" content="Juego de crucigrama matemático" />
    <meta name="keywords" content="crucigrama, números, matematicas, crucigrama matematico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/crucigrama.css" />
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
    <section>
        <h2>Juegos</h2>
        <a href="juegos.html">Inicio</a>
        <a href="memoria.html">Juego de Memoria</a>
        <a href="sudoku.html">Sudoku</a>
        <a href="crucigrama.php">Crucigrama Matemático</a>
        <a href="api.html">Reproductor de Música</a>
        <a href="tienda.php">Tienda Videojuegos</a>
    </section>
    <h3>Records</h3>

    <?php
    if (isset($datos)) {
        ?>
        <ol>
            <?php
            foreach ($datos as $dato) {
                ?>
                <li>
                    <?php echo $dato['nombre'], ' ', $dato['apellidos'], ' | ' ?>
                    <?php echo "Nivel ", $dato['nivel'], ' | ' ?>
                    <?php echo $dato['tiempo'], ' segundos' ?>
                </li>
                <?php
            }
            ?>
        </ol>
        <?php
    } else {
        ?><p>Aún no hay ningún tiempo establecido</p><?php
    }
    ?>
    <h3>Crucigrama matemático</h3>
    <main>
    </main>
    <section>
        <h2>Cómo Jugar a un Crucigrama Matemático</h2>
        <p>Un crucigrama matemático es una variante de los crucigramas tradicionales en la que las pistas y las respuestas están relacionadas con conceptos matemáticos.</p>
        <ol>
            <li><strong>Cuadrícula:</strong> Comienza con una cuadrícula en blanco numerada y con cuadrados en blanco para completar.</li>
            
            <li><strong>Pistas:</strong> Las pistas son ecuaciones o problemas matemáticos que proporcionan la información necesaria para completar los espacios en blanco.</li>
            
            <li><strong>Operaciones matemáticas:</strong> Las pistas involucran operaciones como sumas, restas, multiplicaciones, divisiones, potencias, raíces cuadradas, etc.</li>
            
            <li><strong>Restricciones:</strong> Las respuestas deben cumplir con las restricciones de las pistas vecinas y ajustarse a la cuadrícula.</li>
            
            <li><strong>Sentido de lectura:</strong> Las respuestas se colocan en la cuadrícula en horizontal o vertical, cruzándose entre sí.</li>
            
            <li><strong>Resolución paso a paso:</strong> Resuelve una pista a la vez y utiliza la información obtenida para completar otras partes del rompecabezas.</li>
            
            <li><strong>Comprobación:</strong> Asegúrate de que todas las operaciones matemáticas y restricciones se cumplan correctamente a medida que completas las respuestas.</li>
        </ol>
        <p>Los crucigramas matemáticos ofrecen una combinación desafiante de habilidades matemáticas y habilidades de resolución de rompecabezas.</p>
    </section>
    <script src="./js/crucigrama.js"></script>
</body>

</html>