import sys
import xml.etree.ElementTree as ET

# PARSE XML
arbol = ET.parse('xml/rutas.xml')

rutas = arbol.getroot()


# OPEN ARCHIVES TO WRITE
def open_kml(filename):
    with open(filename + '.kml', 'w', encoding='utf8') as f:
        s = SalidaKML(f)
        s.cabecera_kml()
        tratar_punto(rutas, s)
        s.cierre_kml()


def open_svg(filename):
    with open(filename + '.svg', 'w', encoding='utf8') as f:
        s = SalidaSVG(f)
        s.cabecera_svg()
        tratar_svg(rutas, s, 20)
        s.cierre_svg()


# CLASS DEFINITION
class SalidaKML:
    def __init__(self, f):
        self.f = f

    def coords_inicio(self, bornCoords):
        # self.f.write('<Point>\n')
        self.f.write(f'<coordinates>\n {bornCoords}\n</coordinates>\n')
        # self.f.write('</Point>\n')

    def coords(self, bornCoords):
        self.f.write('<Point>\n')
        self.f.write(f'<coordinates>\n {bornCoords}\n</coordinates>\n')
        self.f.write('</Point>\n')

    def cabecera_kml(self):
        self.f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        self.f.write('<kml xmlns="http://earth.google.com/kml/2.0">\n')
        self.f.write('<Document>\n')

    def cierre_kml(self):
        self.f.write('</Document>\n')
        self.f.write('</kml>\n')

    def inicio_placemark(self):
        self.f.write('<Placemark>\n')

    def fin_placemark(self):
        self.f.write('</Placemark>\n')

    def inicio_ruta(self):
        self.f.write('<LineString>\n')
        self.f.write('<extrude>1</extrude>\n<tessellate>1</tessellate>\n<width>2</width>')

    def fin_ruta(self):
        self.f.write('</LineString>\n')

    def ruta(self, nombreRuta, tipoRuta, medioTransporte):
        self.f.write(f'<name> {nombreRuta} </name>\n')
        self.f.write(f'<description> {tipoRuta} - {medioTransporte} </description>\n')

    def hito(self, nombre, descripcion):
        self.f.write(f'<name> {nombre} </name>\n')
        self.f.write(f'<description> {descripcion} </description>\n')


# OTHER NEEDED METHODS
def tratar_punto(rutas, s):
    for ruta in rutas.findall('ruta'):
        nombre = ruta.find('nombreRuta').text.strip()
        tipo = ruta.find('tipoRuta').text.strip()
        transporte = ruta.find('medioTransporte').text.strip()

        coordsInicioLat = ruta.find('coordenadasInicioRuta').attrib.get('lat')
        coordsInicioLong = ruta.find('coordenadasInicioRuta').attrib.get('long')

        s.inicio_placemark()
        s.ruta(nombre, tipo, transporte)
        s.coords(coordsInicioLong + ',' + coordsInicioLat)
        s.fin_placemark()

        coordsString = "";
        coordsString += coordsInicioLong + ',' + coordsInicioLat + ' '
        for hito in ruta.findall('hitos/hito'):
            if hito.find('nombreHito').text is not None:
                nombre = hito.find('nombreHito').text.strip()
            if hito.find('descripcionHito').text is not None:
                descripcion = hito.find('descripcionHito').text.strip()
            coordsHitoLat = hito.find('coordenadasHito').attrib.get('lat')
            coordsHitoLong = hito.find('coordenadasHito').attrib.get('long')
            s.inicio_placemark()
            s.hito(nombre, descripcion)
            s.coords(coordsHitoLong + ',' + coordsHitoLat)
            s.fin_placemark()
            coordsString += coordsHitoLong + ',' + coordsHitoLat + ' '
        s.inicio_placemark()
        s.ruta(nombre, tipo, transporte)
        s.inicio_ruta()
        s.coords_inicio(coordsString)
        s.fin_ruta()
        s.fin_placemark()


class SalidaSVG:
    x = 20
    y = 20

    def __init__(self, f):
        self.f = f

    def cabecera_svg(self):
        self.f.write('<?xml version="1.0" encoding="utf-8"?>\n')
        self.f.write('<svg width="auto" height="12520" style="overflow:visible "'
                     ' version="1.1" xmlns="http://www.w3.org/2000/svg">\n')

    def cierre_svg(self):
        self.f.write('</svg>')

    def write_svg(self, svg):
        self.f.write(svg)


# OTHER NEEDED METHODS
def tratar_svg(rutas, s, x):
    svg = ""

    for ruta in rutas.findall('ruta'):
        x = 0
        nombre = ruta.find('nombreRuta').text
        max = 0
        min = 9999999
        cont = 0
        contR = 1
        ele = float(ruta.find('coordenadasInicioRuta').attrib.get('ele'))
        if ele > max:
            max = ele
        if ele < min:
            min = ele
        cont += 1
        for hito in ruta.findall('hitos/hito'):
            alt = hito.find('coordenadasHito').attrib.get('ele')
            if ele > max:
                max = ele
            if ele < min:
                min = ele
            cont += 1
        svgHeight = max - min + 50
        svgWidth = cont * 10

        points = ""
        for hito in ruta.findall('hitos/hito'):
            alt = float(hito.find('coordenadasHito').attrib.get('ele'))
            colorFill = "blue"
            colorStroke = "white"
            if alt == min:
                colorFill = "red"
                svg += '<circle cx="' + x + '" cy="' + (svgHeight - (alt - min + 5)) + '" r="5" fill="red" />'
            if alt == max:
                colorFill = "green";
                svg += '<circle cx="' + x + '" cy="' + (svgHeight - (alt - min + 5)) + '" r="5" fill="green" />'

            point = f'{x},{svgHeight - (alt - min + 5)}'
            points += point + " "
            x += 10

        svg += '<polyline points="' + points + '" fill="none" stroke="blue" stroke-width="2" />';
        s.write_svg(svg)


def main():
    print("----- You can output an KML or SVG -----")
    print("-- You can exit the program by typing EXIT ---")
    print("Please write down your preference: ")
    desiredOutput = input('-> ')
    while desiredOutput.upper() != "KML" and desiredOutput.upper() != "SVG" \
            and desiredOutput.upper() != "EXIT":
        print("Invalid choose, try again...")
        desiredOutput = input('-> ')

    if (desiredOutput.upper() == "KML"):
        print("Write the desired name for the output (Extension not needed): ")
        fileName = input('-> ')
        open_kml(fileName)
        print("Succesfully Converted")
        input("Press any key to continue...")
        main()
    elif (desiredOutput.upper() == "SVG"):
        print("Write the desired name for the output (Extension not needed): ")
        fileName = input('-> ')
        open_svg(fileName)
        print("Succesfully Converted")
        input("Press any key to continue...")
        main()
    elif (desiredOutput.upper() == "EXIT"):
        sys.exit()


# START THE PROGRAM
main()
