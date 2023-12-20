<?php
    class Conexion {

        function __construct(){
            $this->url = "localhost";
            $this->usuario = "DBUSER2023";
            $this->pass = "1234";
            $this->bd = "records";
            $this->conexion = new mysqli($this->url, $this->usuario, $this->pass, $this->bd);

            if($this->conexion->connect_error){
                die("Error en la conexión: " . $this->conexion->connect_error);
            }
        }

        function insertar($nombre, $apellidos, $nivel, $tiempo){
            $sql = 'INSERT INTO records (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)';
            $sentencia = $this->conexion->prepare($sql);

            if($sentencia == false){
                die("Error en la inserción: " . $this->conexion->error);
            }

            // i(entero) d(real) s(cadena) b(blob)
            $sentencia->bind_param('sssi', $nombre, $apellidos, $nivel, $tiempo);

            $result = $sentencia->execute();

            if($result == false){
                die("Error de insercion: ") . $sentencia->error;
            }

        }

        function total10(){
            $sql = 'SELECT nombre, apellidos, nivel, tiempo FROM records ORDER BY tiempo DESC LIMIT 10';
            $sentencia = $this->conexion->prepare($sql);

            if($sentencia == false){
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
    if(isset($_POST['nombre'])){
        $nombre = $_POST['nombre'];
        $apellidos = $_POST['apellidos'];
        $nivel = $_POST['nivel'];
        $tiempo = $_POST['tiempo'];
        $conexion->insertar($nombre, $apellidos, $nivel, $tiempo);
        header('Location:crucigrama.php?mostrar=mostrar');
    }

    if(isset($_GET['mostrar'])){
        $datos = $conexion->total10();
    }
?>
<!DOCTYPE HTML>

<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Escritorio Virtual - Juegos</title>
    <meta name="author" content="Mateo Rico Iglesias"/>
    <meta name="description" content="Juego de crucigrama matemático"/>
    <meta name="keywords" content="crucigrama, números, matematicas, crucigrama matematico"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/crucigrama.css" />
    <link rel="icon" href="multimedia/imagenes/favicon.ico"/>
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
            <a href="./viajes.html" accesskey="V" tabindex="3">Viajes</a>
            <a href="./juegos.html" accesskey="J" tabindex="5">Juegos</a>        
        </nav>
    </header>
    <table>
        <tr>
            <th>Jugador</th>
            <th>Nivel</th>
            <th>Tiemo</th>
        </tr>
    <?php foreach ($datos as $dato) { ?>
        <tr>
            <td><?php echo $dato['nombre'], ' ', $dato['apellidos'] ?></td>
            <td><?php echo $dato['nivel'] ?></td>
            <td><?php echo $dato['tiempo'] ?></td>
        </tr>
    <?php } ?>
    </table>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <section>
        <h2>Juegos</h2>
        <a href="juegos.html">Inicio</a>
        <a href="memoria.html">Juego de Memoria</a>
        <a href="sudoku.html">Sudoku</a>
        <a href="crucigrama.html">Crucigrama Matemático</a>
    </section>
    <h3>Crucigrama matemático</h3>
    <main>
    </main>
    <script src="./js/crucigrama.js"></script>
</body>
</html>