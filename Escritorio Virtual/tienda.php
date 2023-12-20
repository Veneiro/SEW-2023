<?php session_start(); ?>
<!DOCTYPE HTML>

<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Escritorio Virtual - Tienda de Videojuegos</title>
    <meta name="author" content="Mateo Rico Iglesias" />
    <meta name="description" content="Tienda Videojuegos" />
    <meta name="keywords" content="tienda" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="./estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="./estilo/tienda.css" />
    <link rel="icon" href="multimedia/imagenes/favicon.ico" />
</head>

<body>
    <header>
    <h1>Escritorio Virtual</h1>
    <nav>
      <a href='./index.html' accesskey='P' tabindex='1'>Página Principal</a>
      <a href='./sobremi.html' accesskey='S' tabindex='7'>Sobre Mí</a>
      <a href='./noticias.html' accesskey='N' tabindex='2'>Noticias</a>
      <a href='./agenda.html' accesskey='A' tabindex='6'>Agenda</a>
      <a href='./meteorologia.html' accesskey='M' tabindex='4'>Meteorología</a>
      <a href='./viajes.php' accesskey='V' tabindex='3'>Viajes</a>
      <a href='./juegos.html' accesskey='J' tabindex='5'>Juegos</a>
    </nav>
    </header>
    <section>
      <h2>Juegos</h2>
      <a href='juegos.html'>Inicio</a>
      <a href='memoria.html'>Juego de Memoria</a>
      <a href='sudoku.html'>Sudoku</a>
      <a href='crucigrama.php'>Crucigrama Matemático</a>
      <a href='tienda.php'>Tienda Videojuegos</a>
    </section>
    <section>
    <h2>Opciones</h2>
    <form action='#' method='post'> 
         <button type='submit' name='iniciar_sesion'> Iniciar Sesión </button>
         <button type='submit' name='cerrar_sesion'> Cerrar Sesión </button>
         <button type='submit' name='escaparate'> Ver Videojuegos en posesión </button>
         <button type='submit' name='filtrar_por_genero'> Filtrar Videojuegos por género </button>
         <button type='submit' name='filtrar_por_goty'> Filtrar Videojuegos que han ganado un GOTY </button>
         <button type='submit' name='filtrar_por_desarrolladora'> Filtrar Videojuegos por Desarrolladora </button>
     </form>
     </section>
    <?php
    class BaseDatos
    {

        private $server_name;
        private $username;
        private $password;
        private $db;
        private $db_name;
        private $videojuegos;

        public function __construct()
        {
            $this->server_name = 'localhost';
            $this->username = 'DBUSER2023';
            $this->password = 'DBPSWD2023';
            $this->db_name = 'DataBase_Videojuegos_SEW';

            $this->videojuegos = array();

            $_SESSION['videojuegos'] = array();
            $_SESSION['generos'] = array();
            $_SESSION['desarrolladoras'] = array();

            if (!isset($_SESSION['es_sesion_iniciada'])) {
                $_SESSION['es_sesion_iniciada'] = false;
            }
            if (!isset($_SESSION['dni_usuario_logged'])) {
                $_SESSION['dni_usuario_logged'] = '';
            }

            if (!isset($_SESSION['hay_que_crear_cuenta'])) {
                $_SESSION['hay_que_crear_cuenta'] = false;
            }

            if (!isset($_SESSION['filtrar_por_genero'])) {
                $_SESSION['filtrar_por_genero'] = false;
            }

            if (!isset($_SESSION['filtrar_por_goty'])) {
                $_SESSION['filtrar_por_goty'] = false;
            }

            if (!isset($_SESSION['filtrar_por_desarrolladora'])) {
                $_SESSION['filtrar_por_desarrolladora'] = false;
            }

            if (count($_POST) > 0) {
                if (isset($_POST['formulario_iniciar_sesion'])) {
                    $this->iniciar_sesion();
                }
                if (isset($_POST['iniciar_sesion'])) {
                    $this->iniciar_sesion_gui();
                }
                if (isset($_POST['cerrar_sesion'])) {
                    $this->cerrar_sesion();
                }
                if (isset($_POST['crear_cuenta'])) {
                    $this->crear_cuenta();
                }
                if (isset($_POST['filtrar_por_genero'])) {
                    $this->filtrar_por_genero();
                }
                if (isset($_POST['filtrar_por_goty'])) {
                    $this->filtrar_por_goty();
                }
                if (isset($_POST['filtrar_por_desarrolladora'])) {
                    $this->filtrar_por_desarrolladora();
                }
                if (isset($_POST['escaparate'])) {
                    $this->escaparate();
                }
            }

            $this->init();

            if (count($_POST) > 0) {
                foreach ($_SESSION['videojuegos'] as $videojuego)
                    if (isset($_POST[$videojuego->referencia])) {
                        $this->comprar($videojuego->referencia);
                    }
            }

        }

        private function init()
        {
            $this->añadir_generos();
            $this->añadir_videojuegos();
            $this->añadir_desarrolladoras();

            $this->usuario_gui();

            $this->videojuegos_gui();
        }

        private function conectarse_db()
        {
            $this->db = new mysqli(
                    $this->server_name,
                    $this->username,
                    $this->password,
                    $this->db_name
            );
        }

        private function añadir_generos()
        {
            $this->conectarse_db();

            try {
                $select_query = $this->db->prepare("
                SELECT * FROM generos"
                );

                $select_query->execute();
                $resultado = $select_query->get_result();
                $select_query->close();

                if ($resultado->num_rows > 0)
                    while ($fila = $resultado->fetch_assoc())
                        $_SESSION['generos'][] = new Genero(
                            $fila['id'],
                            $fila['tipo']
                        );
            } catch (Error $e) {
                $this->error(
                    "ERROR: ",
                    $e->getMessage()
                );
            }
            $this->db->close();
        }

        private function añadir_desarrolladoras()
        {
            $this->conectarse_db();

            try {
                $select_query = $this->db->prepare("
                SELECT * FROM desarrolladoras"
                );

                $select_query->execute();
                $resultado = $select_query->get_result();
                $select_query->close();

                if ($resultado->num_rows > 0)
                    while ($fila = $resultado->fetch_assoc())
                        $_SESSION['desarrolladoras'][] = new Desarrolladora(
                            $fila['nombre'],
                            $fila['fundación'],
                            $fila['empleados'],
                            $fila['web']
                        );
            } catch (Error $e) {
                $this->error(
                    "ERROR: ",
                    $e->getMessage()
                );
            }
            $this->db->close();
        }

        private function añadir_videojuegos()
        {
            $this->conectarse_db();

            try {
                $select_query = $this->db->prepare("
                SELECT * FROM videojuegos"
                );

                $select_query->execute();
                $resultado = $select_query->get_result();
                $select_query->close();
                if ($resultado->num_rows > 0)
                    while ($fila = $resultado->fetch_assoc())
                        $_SESSION['videojuegos'][] = new Videojuego(
                            $fila['referencia'],
                            $fila['titulo'],
                            $fila['genero_id'],
                            $fila['director'],
                            $fila['distribuidora'],
                            $fila['desarrolladora'],
                            $fila['portada'],
                            $fila['ha_ganado_goty']
                        );
            } catch (Error $e) {
                $this->error(
                    "ERROR: ",
                    $e->getMessage()
                );
            }

            $this->db->close();
        }

        private function videojuego_gui($videojuego)
        {
            echo "
            <section>
                <h3> $videojuego->titulo | $videojuego->referencia </h3>
                <h4> Director: $videojuego->director </h4>
                <img src='$videojuego->portada' alt='$videojuego->titulo'/>
                <p> Distribuidora: $videojuego->distribuidora </p>
                <p> Desarrolladora: $videojuego->desarrolladora </p>
                <form action='#' method='post'>
                    <input type='submit' name='$videojuego->referencia' value='Comprar' />
                </form>
            </section>
            ";
        }

        private function videojuegos_gui()
        {
            echo '<h2> Listado de videojuegos </h2>';
            echo '<p> Aquí tienes el escaparate de videojuegos disponibles en nuestro GAME </p>';

            $videojuegos = array();

            if ($_SESSION['filtrar_por_goty'])
                foreach ($_SESSION['videojuegos'] as $videojuego) {
                    if ($videojuego->ha_ganado_goty === 1) {
                        $videojuegos[] = $videojuego;
                    }
                } else 
                $videojuegos = $_SESSION['videojuegos'];

                if ($_SESSION['filtrar_por_genero']) {
                    foreach ($_SESSION['generos'] as $genero) {
                        $numero_de_videojuegos = 0;

                        foreach ($videojuegos as $videojuego)
                            if ($videojuego->genero_id === $genero->id) {
                                if ($numero_de_videojuegos === 0) {
                                    echo "<h2> $genero->tipo </h2>";
                                    echo "<main>";
                                }
                                $this->videojuego_gui($videojuego);
                                $numero_de_videojuegos++;
                            }

                        if ($numero_de_videojuegos > 0) {
                            echo "</main>";
                        }
                    }
                }
                else if ($_SESSION['filtrar_por_desarrolladora']) {
                    foreach ($_SESSION['desarrolladoras'] as $desarolladora) {
                        $numero_de_videojuegos = 0;
                        foreach ($videojuegos as $videojuego)
                            if ($videojuego->desarrolladora === $desarolladora->nombre) {
                                if ($numero_de_videojuegos === 0) {
                                    echo "<h2> $desarolladora->nombre </h2>";
                                    echo "<main>";
                                }
                                $this->videojuego_gui($videojuego);
                                $numero_de_videojuegos++;
                            }

                        if ($numero_de_videojuegos > 0) {
                            echo "</main>";
                        }
                    }
                } else {
                    echo "<main>";
                    foreach ($videojuegos as $videojuego)
                        $this->videojuego_gui($videojuego);

                    echo "</main>";
                }
            
        }

        private function comprar($referencia)
        {
            $this->conectarse_db();

            try {
                if ($_SESSION['es_sesion_iniciada'] === true) {
                    $check_ha_sido_comprado = $this->db->prepare("
                    SELECT * 
                        FROM escaparate 
                        WHERE cliente_dni = ? 
                            and videojuego_referencia = ?"
                    );

                    $check_ha_sido_comprado->bind_param('ss', $_SESSION['dni_usuario_logged'], $referencia);
                    $check_ha_sido_comprado->execute();

                    $ha_sido_comprado = $check_ha_sido_comprado->get_result();

                    $check_ha_sido_comprado->close();

                    if (
                        empty($ha_sido_comprado->fetch_assoc())
                    ) {
                        $insert = $this->db->prepare("
                        INSERT INTO escaparate 
                            (cliente_dni,
                             videojuego_referencia,
                             dia_comprado)
                        VALUES 
                            (?, ?, NOW())
                    ");

                        $insert->bind_param(
                            'ss', $_SESSION['dni_usuario_logged'],
                            $referencia
                        );

                        $insert->execute();
                        $insert->close();

                        $this->exito(
                            "Se ha comprado $referencia correctamente!"
                        );
                    } else {
                        $this->error(
                            "ERROR: ",
                            "Ya has comprado este videojuego"
                        );
                    }
                } else
                    $this->error(
                        "ERROR: ",
                        "No has iniciado sesión"
                    );
            } catch (Error $e) {
                $this->error(
                    "ERROR: ",
                    $e->getMessage()
                );
            }

            $this->db->close();
        }

        private function escaparate()
        {
            $this->conectarse_db();
            try {
                if ($_SESSION['es_sesion_iniciada'] === true) {
                    $select_query = $this->db->prepare("
                    SELECT * 
                        FROM escaparate 
                        WHERE cliente_dni = ?"
                    );
                    $select_query->bind_param(
                        's', $_SESSION['dni_usuario_logged']
                    );
                    $select_query->execute();
                    $resultado = $select_query->get_result();
                    $select_query->close();
                    if ($resultado->num_rows > 0) {
                        while ($fila = $resultado->fetch_assoc()) {
                            echo
                                '<p>ID del videojuego: ' . $fila["videojuego_referencia"] . ' | 
                                    Fecha de compra: ' . $fila["dia_comprado"].'</p>';
                        }
                    }

                } else
                    $this->error(
                        "ERROR: ",
                        "No has iniciado sesión"
                    );
            } catch (Error $e) {
                $this->error(
                    "ERROR: ",
                    $e->getMessage()
                );
            }

            $this->db->close();
        }


        private function filtrar_por_genero()
        {
            $_SESSION['filtrar_por_genero'] = !$_SESSION['filtrar_por_genero'];
        }

        private function filtrar_por_goty()
        {
            $_SESSION['filtrar_por_goty'] = !$_SESSION['filtrar_por_goty'];
        }

        private function filtrar_por_desarrolladora()
        {
            $_SESSION['filtrar_por_desarrolladora'] = !$_SESSION['filtrar_por_desarrolladora'];
        }

        private function usuario_gui()
        {
            if ($_SESSION['es_sesion_iniciada'] === true) {
                $usuario = $_SESSION['dni_usuario_logged'];
                $mensaje = "Has iniciado sesión como: $usuario.";
            } else
                $mensaje = "No has iniciado sesión.";

            echo "
            <p>$mensaje</p>
        ";
        }

        private function iniciar_sesion_gui()
        {
            echo "
            <h3>Si quieres crear una cuenta introduce tu dni y dale a iniciar sesión. El proceso de introducir tus datos comenzará automaticamente</h3>
        <form action='#' method='post'>
            <h2>Iniciar sesión</h2>
            <label for='iniciar_sesion_dni'>DNI:</label>
            <input type='text' id='iniciar_sesion_dni' name='iniciar_sesion_dni' />
            <input type='submit' name='formulario_iniciar_sesion' value='Iniciar sesión' />
        </form>
        ";
        }

        private function crear_cuenta_gui()
        {
            echo "
        <form action='#' method='post'>
            <h2>Crear cuenta</h2>
            <label for='iniciar_sesion_nombre'>Nombre:</label>
            <input type='text' id='iniciar_sesion_nombre' name='iniciar_sesion_nombre' />
            <label for='iniciar_sesion_apellidos'>Apellidos:</label>
            <input type='text' id='iniciar_sesion_apellidos' name='iniciar_sesion_apellidos' />
            <label for='iniciar_sesion_email'>Correo electrónico:</label>
            <input type='email' id='iniciar_sesion_email' name='iniciar_sesion_email' />
            <label for='iniciar_sesion_telefono'>Teléfono:</label>
            <input type='text' id='iniciar_sesion_telefono' name='iniciar_sesion_telefono' />
            <input type='submit' name='crear_cuenta' value='Crear cuenta' />
        </form>
        ";
        }

        private function iniciar_sesion()
        {
            // Guardamos el DNI que acabamos de escrbir en el formulario
            if (!empty($_POST['iniciar_sesion_dni'])) {
                $_SESSION['dni_usuario_logged'] = $_POST['iniciar_sesion_dni'];
                // Comprobamos si la cuenta existe o no
                $this->check_crear_cuenta();
                if ($_SESSION['hay_que_crear_cuenta'])
                    $this->crear_cuenta_gui();
                else
                    $_SESSION['es_sesion_iniciada'] = true;
            } else {
                echo "El dni introducido está vacío, inténtalo de nuevo";
            }

        }

        private function cerrar_sesion()
        {
            $_SESSION['es_sesion_iniciada'] = false; // marcamos como que NO hemos iniciado sesión
            $_SESSION['hay_que_crear_cuenta'] = true; // marcamos como que hay que crear la cuenta
        }

        private function check_crear_cuenta()
        {
            $this->conectarse_db();

            try {
                $select_query = $this->db->prepare("
                SELECT * FROM Clientes WHERE dni = ?"
                );

                $select_query->bind_param('s', $_SESSION['dni_usuario_logged']);
                $select_query->execute();

                $resultado = $select_query->get_result();

                $select_query->close();

                if ($resultado->fetch_assoc() === NULL)
                    $_SESSION['hay_que_crear_cuenta'] = true;
                else
                    $_SESSION['hay_que_crear_cuenta'] = false;
            } catch (Error $e) {
                $this->error(
                    "ERROR: ",
                    $e->getMessage()
                );
            }

            $this->db->close();
        }

        private function crear_cuenta()
        {
            $this->conectarse_db();

            try {
                $query = $this->db->prepare("
                INSERT INTO Clientes 
                    (dni,
                    nombre,
                    apellidos,
                    email,
                    telefono)
                VALUES 
                    (?, ?, ?, ?, ?)");

                $query->bind_param(
                    'sssss', $_SESSION['dni_usuario_logged'],
                    $_POST['iniciar_sesion_nombre'],
                    $_POST['iniciar_sesion_apellidos'],
                    $_POST['iniciar_sesion_email'],
                    $_POST['iniciar_sesion_telefono']
                );

                $query->execute();
                $query->close();

                // Si hemos llegado hasta aquí es que se ha creado una cuenta...
                $_SESSION['hay_que_crear_cuenta'] = false;
                $_SESSION['es_sesion_iniciada'] = true;
            } catch (Error $e) {
                $this->error(
                    "ERROR: ",
                    $e->getMessage()
                );
            }

            $this->db->close();
        }

        private function exito($mensaje)
        {
            echo "<p>" . $mensaje . "</p>";
        }

        private function error($mensaje, $error)
        {
            echo "<p>" . $mensaje . $error . "</p>";
            exit();
        }
    }

    class Videojuego
    {

        public $referencia;
        public $titulo;
        public $genero_id;
        public $director;
        public $distribuidora;
        public $desarrolladora;
        public $portada;
        public $ha_ganado_goty;

        public function __construct(
            $referencia,
            $titulo,
            $genero_id,
            $director,
            $distribuidora,
            $desarrolladora,
            $portada,
            $ha_ganado_goty
        )
        {
            $this->referencia = $referencia;
            $this->titulo = $titulo;
            $this->genero_id = $genero_id;
            $this->director = $director;
            $this->distribuidora = $distribuidora;
            $this->desarrolladora = $desarrolladora;
            $this->portada = $portada;
            $this->ha_ganado_goty = $ha_ganado_goty;
        }

    }

    class Genero
    {

        public $id;
        public $tipo;

        public function __construct($id, $tipo)
        {
            $this->id = $id;
            $this->tipo = $tipo;
        }

    }

    class Desarrolladora
    {

        public $nombre;
        public $fundación;
        public $empleados;
        public $web;

        public function __construct($nombre, $fundación, $empleados, $web)
        {
            $this->nombre = $nombre;
            $this->fundación = $fundación;
            $this->empleados = $empleados;
            $this->web = $web;
        }

    }

    $db = new BaseDatos();

    ?>
</body>