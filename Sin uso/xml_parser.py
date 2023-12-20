import sys
import xml.etree.ElementTree as ET

# PARSE XML
arbol = ET.parse('xml/rutas.xml')

persona = arbol.getroot()


# OPEN ARCHIVES TO WRITE
def open_html(filename):
    with open(filename + '.html', 'w', encoding='utf8') as f:
        s = SalidaHTML(f)
        s.header_html()
        tratar_persona(persona, s)
        s.close_html()


def open_kml(filename):
    with open(filename + '.kml', 'w', encoding='utf8') as f:
        s = SalidaKML(f)
        s.cabecera_kml()
        tratar_punto(persona, s)
        s.cierre_kml()


def open_svg(filename):
    with open(filename + '.svg', 'w', encoding='utf8') as f:
        s = SalidaSVG(f)
        s.cabecera_svg()
        tratar_svg(persona, s, 20)
        s.cierre_svg()


# CLASS DEFINITION
class SalidaHTML:

    def __init__(self, f):
        self.f = f

    def header_html(self):
        self.f.write('<!doctype html>\n')
        self.f.write('<html lang=es>\n')
        self.f.write('<head>\n')
        self.f.write('<meta charset="UTF-8" />\n')
        self.f.write('<meta name ="author" content ="Mateo Rico Iglesias" />\n')
        self.f.write('<meta name ="description" content ="Social Network Data" />\n')
        self.f.write('<meta name ="keywords" content ="Social, Network, Data" />\n')
        self.f.write('<meta name ="viewport" content ="width=device-width, initial-scale=1.0" />\n')
        self.f.write('<link rel="stylesheet" type="text/css" href="estilo/estilo.css"/>\n')
        self.f.write('<title>Social Network Data</title>\n')
        self.f.write('</head>\n')
        self.f.write('<body>\n')
        self.f.write('<ul>\n')

    def close_html(self):
        self.f.write('</ul>\n')
        self.f.write('</body>\n')
        self.f.write('</html>\n')

    def inicio_persona(self):
        self.f.write('<li>\n')

    def fin_persona(self):
        self.f.write('</li>\n')

    def inicio_hijos(self):
        self.f.write('<ul>\n')

    def fin_hijos(self):
        self.f.write('</ul>\n')

    def persona(self, nombre, apellidos, bornPlace):
        self.f.write(f'<strong>{nombre} {apellidos}</strong>: {bornPlace}\n')

    def writePhotos(self, photo):
        if photo is not None:
            self.pre_multimedia()
            self.f.write(f'<img src= "archivos_multimedia/archivos_graficos/{photo}" alt="Foto antigua"/>\n')
            self.post_multimedia()

    def writeVideos(self, video):
        if video is not None:
            self.pre_multimedia()
            self.f.write(f'<iframe width = "640" height = "480"\n')
            self.f.write(f'src = "{video}">\n')
            self.f.write(f'</iframe>\n')
            self.post_multimedia()

    def writeComments(self, comment):
        if comment is not None:
            self.pre_multimedia_comment()
            self.f.write(f'<li>{comment}</li>\n')
            self.post_multimedia_comment()

    def pre_multimedia(self):
        self.f.write('<p>')

    def post_multimedia(self):
        self.f.write('</p>')

    def pre_multimedia_comment(self):
        self.f.write('<p>')
        self.f.write('---- Inicio de los Comentarios ----')
        self.f.write('</p>')
        self.f.write('<ul>')

    def post_multimedia_comment(self):
        self.f.write('</ul>')
        self.f.write('<p>')
        self.f.write('---- Fin de los Comentarios ----')
        self.f.write('</p>')


# OTHER NEEDED METHODS FOR HTML
def tratar_persona(persona, s):
    nombre = persona.attrib.get('nombre')
    apellidos = persona.attrib.get('apellidos')
    bornPlace = persona.find('{http://ejercicio.com/personas}data/{http://ejercicio.com/personas}bornPlace').text

    s.inicio_persona()
    s.persona(nombre, apellidos, bornPlace)

    photos = persona.findall(
        '{http://ejercicio.com/personas}data/{http://ejercicio.com/personas}'
        'photos/{http://ejercicio.com/personas}photo')

    for photo in photos:
        s.writePhotos(photo.text)

    videos = persona.findall(
        '{http://ejercicio.com/personas}data/{http://ejercicio.com/personas}'
        'videos/{http://ejercicio.com/personas}video')

    for video in videos:
        s.writeVideos(video.text)

    comments = persona.findall(
        '{http://ejercicio.com/personas}data/{http://ejercicio.com/personas}'
        'comments/{http://ejercicio.com/personas}comment')

    for comment in comments:
        s.writeComments(comment.text)

    for child in persona.findall('{http://ejercicio.com/personas}persona'):
        s.inicio_hijos()
        tratar_persona(child, s)
        s.fin_hijos()
    s.fin_persona()


class SalidaKML:
    def __init__(self, f):
        self.f = f

    def coords_inicio(self, bornCoords):
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

    def inicio_punto(self):
        self.f.write('<Placemark>\n')

    def fin_punto(self):
        self.f.write('</Placemark>\n')

    def inicio_hijos(self):
        self.f.write('<Placemark>\n')

    def fin_hijos(self):
        self.f.write('</Placemark>\n')

    def persona(self, nombre, apellidos, bornPlace):
        self.f.write(f'<name> {nombre} {apellidos} </name>\n')
        self.f.write(f'<description> {bornPlace} </description>\n')


# OTHER NEEDED METHODS
def tratar_punto(persona, s):
    nombre = persona.attrib.get('nombre')
    apellidos = persona.attrib.get('apellidos')

    bornPlace = persona.find('{http://ejercicio.com/personas}data/'
                             '{http://ejercicio.com/personas}bornPlace').text

    bornCoords = persona.find('{http://ejercicio.com/personas}data/'
                              '{http://ejercicio.com/personas}bornCoords').text

    s.inicio_punto()
    s.persona(nombre, apellidos, bornPlace)
    s.coords_inicio(bornCoords)
    s.fin_punto()

    for hijo in persona.findall('{http://ejercicio.com/personas}persona'):
        s.inicio_hijos()
        tratar_punto(hijo, s)
        s.fin_hijos()


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

    def persona(self, x, nombre, apellidos, bornDate, bornPlace, bornCoords, fromP, fromCoords, videos, photos,
                comments):
        self.x = x
        self.f.write(
            f'<rect x="{str(self.x)}" y="{str(self.y)}" width="200" height="40" style="fill:white;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 10)}" y="{str(self.y + 10)}" font-size="10" style="fill:blue">persona</text>\n')
        self.f.write(
            f'<text x="{str(self.x + 10)}" y="{str(self.y + 20)}" font-size="8" style="fill:black">'
            f'nombre: {nombre}</text>\n')
        self.f.write(
            f'<text x="{str(self.x + 10)}" y="{str(self.y + 30)}" font-size="8" style="fill:black">'
            f'apellidos: {apellidos}</text>\n')
        self.f.write(
            f'<rect x="{str(self.x + 220)}" y="{str(self.y)}" width="200" height="40" style="fill:white;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 230)}" y="{str(self.y + 10)}" font-size="10" style="fill:blue">data</text>\n')
        self.f.write(
            f'<rect x="{str(self.x + 440)}" y="{str(self.y)}" width="200" height="40" style="fill:white;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 450)}" y="{str(self.y + 10)}" font-size="10" style="fill:blue">bornDate</text>\n')
        self.f.write(
            f'<rect x="{str(self.x + 506)}" y="{str(self.y)}" width="137" height="40" style="fill:green;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 516)}" y="{str(self.y + 10)}" font-size="8" style="fill:white">'
            f'{bornDate}</text>\n')
        self.f.write(
            f'<rect x="{str(self.x + 440)}" y="{str(self.y + 50)}" width="200" height="40" style="fill:white;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 450)}" y="{str(self.y + 60)}" font-size="10" style="fill:blue">bornPlace</text>\n')
        self.f.write(
            f'<rect x="{str(self.x + 506)}" y="{str(self.y + 50)}" width="137" height="40" style="fill:green;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 516)}" y="{str(self.y + 60)}" font-size="8" style="fill:white">'
            f'{bornPlace}</text>\n')
        self.f.write(
            f'<rect x="{str(self.x + 440)}" y="{str(self.y + 100)}" width="200" height="40" style="fill:white;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 450)}" y="{str(self.y + 110)}" font-size="10" style="fill:blue">'
            f'bornCoords</text>\n')
        self.f.write(
            f'<rect x="{str(self.x + 506)}" y="{str(self.y + 100)}" width="137" height="40" style="fill:green;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 516)}" y="{str(self.y + 110)}" font-size="8" style="fill:white">'
            f'{bornCoords}</text>\n')
        self.f.write(
            f'<rect x="{str(self.x + 440)}" y="{str(self.y + 150)}" width="200" height="40" style="fill:white;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 450)}" y="{str(self.y + 160)}" font-size="10" style="fill:blue">from</text>\n')
        self.f.write(
            f'<rect x="{str(self.x + 506)}" y="{str(self.y + 150)}" width="137" height="40" style="fill:green;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 516)}" y="{str(self.y + 160)}" font-size="8" style="fill:white">{fromP}</text>\n')
        self.f.write(
            f'<rect x="{str(self.x + 440)}" y="{str(self.y + 200)}" width="200" height="40" style="fill:white;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 450)}" y="{str(self.y + 210)}" font-size="10" style="fill:blue">'
            f'fromCoords</text>\n')
        self.f.write(
            f'<rect x="{str(self.x + 506)}" y="{str(self.y + 200)}" width="137" height="40" style="fill:green;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 516)}" y="{str(self.y + 210)}" font-size="8" style="fill:white">'
            f'{fromCoords}</text>\n')

        self.f.write(
            f'<rect x="{str(self.x + 440)}" y="{str(self.y + 250)}" width="200" height="40" style="fill:white;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 450)}" y="{str(self.y + 260)}" font-size="10" style="fill:blue">photos</text>\n')

        self.f.write(
            f'<rect x="{str(self.x + 506)}" y="{str(self.y + 250)}" width="137" height="40" style="fill:green;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 516)}" y="{str(self.y + 260)}" font-size="8" style="fill:white">{photos}</text>\n')

        self.f.write(
            f'<rect x="{str(self.x + 440)}" y="{str(self.y + 300)}" width="200" height="40" style="fill:white;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 450)}" y="{str(self.y + 310)}" font-size="10" style="fill:blue">videos</text>\n')

        self.f.write(
            f'<rect x="{str(self.x + 506)}" y="{str(self.y + 300)}" width="137" height="40" style="fill:green;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 516)}" y="{str(self.y + 310)}" font-size="8" style="fill:white">{videos}</text>\n')

        self.f.write(
            f'<rect x="{str(self.x + 440)}" y="{str(self.y + 350)}" width="200" height="40" style="fill:white;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 450)}" y="{str(self.y + 360)}" font-size="10" style="fill:blue">comments</text>\n')

        self.f.write(
            f'<rect x="{str(self.x + 506)}" y="{str(self.y + 350)}" width="137" height="40" style="fill:green;stroke:'
            f'black;stroke-width:1" />\n')
        self.f.write(
            f'<text x="{str(self.x + 516)}" y="{str(self.y + 360)}" font-size="8" style="fill:white">'
            f'{comments}</text>\n')

        self.y += 450


# OTHER NEEDED METHODS
def tratar_svg(persona, s, x):
    nombre = persona.attrib.get('nombre')
    apellidos = persona.attrib.get('apellidos')
    bornDate = persona.find('{http://ejercicio.com/personas}data/{http://ejercicio.com/personas}bornDate').text
    bornPlace = persona.find('{http://ejercicio.com/personas}data/{http://ejercicio.com/personas}bornPlace').text
    bornCoords = persona.find('{http://ejercicio.com/personas}data/{http://ejercicio.com/personas}bornCoords').text
    fromP = persona.find('{http://ejercicio.com/personas}data/{http://ejercicio.com/personas}from').text
    fromCoords = persona.find('{http://ejercicio.com/personas}data/{http://ejercicio.com/personas}fromCoords').text
    videos = persona.find('{http://ejercicio.com/personas}data/{http://ejercicio.com/personas}videos')
    photos = persona.find('{http://ejercicio.com/personas}data/{http://ejercicio.com/personas}photos')
    comments = persona.find('{http://ejercicio.com/personas}data/{http://ejercicio.com/personas}comments')
    video = ""
    photo = ""
    comment = ""
    for v in videos:
        if v.text is not None:
            video += v.text + "\n"
    for p in photos:
        if p.text is not None:
            photo += p.text + "\n"
    for c in comments:
        if c.text is not None:
            comment += c.text + "\n"

    s.persona(x, nombre, apellidos, bornDate, bornPlace, bornCoords, fromP, fromCoords, video, photo, comment)

    for child in persona.findall('{http://ejercicio.com/personas}persona'):
        tratar_svg(child, s, x + 100)


def main():
    print("----- You can output an HTML, KML or SVG -----")
    print("-- You can exit the program by typing EXIT ---")
    print("Please write down your preference: ")
    desiredOutput = input('-> ')
    while desiredOutput.upper() != "HTML" and desiredOutput.upper() != "KML" and desiredOutput.upper() != "SVG" \
            and desiredOutput.upper() != "EXIT":
        print("Invalid choose, try again...")
        desiredOutput = input('-> ')

    if (desiredOutput.upper() == "HTML"):
        print("Write the desired name for the output (Extension not needed): ")
        fileName = input('-> ')
        open_html(fileName)
        print("Succesfully Converted")
        input("Press any key to continue...")
        main()
    elif (desiredOutput.upper() == "KML"):
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
