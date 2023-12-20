import xml.etree.ElementTree as ET

# Clase para representar una ruta
class Ruta:
    def __init__(self, nombre, tipo, transporte, fecha, hora, duracion, agencia, descripcion, adecuado, lugar, direccion, coordenadas, referencias, puntuacion, hitos):
        self.nombre = nombre
        self.tipo = tipo
        self.transporte = transporte
        self.fecha = fecha
        self.hora = hora
        self.duracion = duracion
        self.agencia = agencia
        self.descripcion = descripcion
        self.adecuado = adecuado
        self.lugar = lugar
        self.direccion = direccion
        self.coordenadas = coordenadas
        self.referencias = referencias
        self.puntuacion = puntuacion
        self.hitos = hitos

# Clase para representar un hito
class Hito:
    def __init__(self, nombre, descripcion, coordenadas, distancia):
        self.nombre = nombre
        self.descripcion = descripcion
        self.coordenadas = coordenadas
        self.distancia = distancia

# Función para procesar el XML y crear objetos de ruta
def procesar_xml(xml_file):
    rutas = []

    tree = ET.parse(xml_file)
    root = tree.getroot()

    for ruta_elem in root.findall('ruta'):
        nombre = ruta_elem.find('nombreRuta').text.strip()
        tipo = ruta_elem.find('tipoRuta').text.strip()
        transporte = ruta_elem.find('medioTransporte').text.strip()
        fecha = ruta_elem.find('fechaInicio').text.strip()
        hora = ruta_elem.find('horaInicio').text.strip()
        duracion = ruta_elem.find('duracion').text.strip()
        agencia = ruta_elem.find('agencia').text.strip()
        descripcion = ruta_elem.find('descripcion').text.strip()
        adecuado = ruta_elem.find('adecuadoPara').text.strip()
        lugar = ruta_elem.find('lugarInicio').text.strip()
        direccion = ruta_elem.find('direccionInicio').text.strip()
        coordenadas_elem = ruta_elem.find('coordenadasInicioRuta')
        coordenadas = {
            "lat": coordenadas_elem.get("lat"),
            "long": coordenadas_elem.get("long")
        }
        referencias = [ref.text for ref in ruta_elem.find('referencias')]
        puntuacion = int(ruta_elem.find('puntuacion').text.strip())

        # Procesar hitos
        hitos = []
        for hito_elem in ruta_elem.findall('hitos/hito'):
            nombre_hito = hito_elem.find('nombreHito').text.strip()
            descripcion_hito = hito_elem.find('descripcionHito').text.strip()
            coordenadas_hito_elem = hito_elem.find('coordenadasHito')
            coordenadas_hito = {
                "lat": coordenadas_hito_elem.get("lat"),
                "long": coordenadas_hito_elem.get("long")
            }
            distancia_hito = hito_elem.find('distanciaAnteriorHito').text.strip()

            hito = Hito(nombre_hito, descripcion_hito, coordenadas_hito, distancia_hito)
            hitos.append(hito)

        ruta = Ruta(nombre, tipo, transporte, fecha, hora, duracion, agencia, descripcion, adecuado, lugar, direccion, coordenadas, referencias, puntuacion, hitos)
        rutas.append(ruta)

    return rutas

# Función para imprimir información de rutas y hitos
def imprimir_rutas(rutas):
    for ruta in rutas:
        print("Nombre de la Ruta:", ruta.nombre)
        print("Tipo de Ruta:", ruta.tipo)
        print("Medio de Transporte:", ruta.transporte)
        print("Fecha de Inicio:", ruta.fecha)
        print("Hora de Inicio:", ruta.hora)
        print("Duración:", ruta.duracion)
        print("Agencia:", ruta.agencia)
        print("Descripción:", ruta.descripcion)
        print("Adecuado para:", ruta.adecuado)
        print("Lugar de Inicio:", ruta.lugar)
        print("Dirección de Inicio:", ruta.direccion)
        print("Coordenadas de Inicio:", ruta.coordenadas)
        print("Referencias:", ruta.referencias)
        print("Puntuación:", ruta.puntuacion)
        print("Hitos:")
        for hito in ruta.hitos:
            print("  - Nombre del Hito:", hito.nombre)
            print("    Descripción del Hito:", hito.descripcion)
            print("    Coordenadas del Hito:", hito.coordenadas)
            print("    Distancia desde el Hito Anterior:", hito.distancia)
        print("-----")

# Procesar el XML y mostrar información
rutas = procesar_xml('xml/rutas.xml')
imprimir_rutas(rutas)
