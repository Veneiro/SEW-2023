import xml.etree.ElementTree as ET

def convert_xml_to_kml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    ruta_int = 2

    for ruta in root.findall('.//ruta'):
        nombre = ruta.find('./nombreRuta').text
        descripcion = ruta.find('./descripcion').text

        placemarks = []
        for trkpt in ruta.findall('.//coordenadasHito'):
            lat_str = trkpt.get('lat')
            lon_str = trkpt.get('long')

            # Manejar los casos en los que latitud o longitud están vacíos
            if lat_str and lon_str:
                lat = float(lat_str)
                lon = float(lon_str)
                placemark = {
                    'name': nombre,
                    'description': descripcion,
                    'lat': lat,
                    'lng': lon,
                }
                placemarks.append(placemark)

        # Generar el KML
        kml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        kml += '<kml xmlns="http://earth.google.com/kml/2.0">\n'
        kml += '  <Document>\n'

        for placemark in placemarks:
            kml += '    <Placemark>\n'
            kml += f'      <name>{placemark["name"]}</name>\n'
            kml += f'      <description>{placemark["description"]}</description>\n'
            kml += '      <Point>\n'
            kml += f'        <coordinates>{placemark["lng"]},{placemark["lat"]}</coordinates>\n'
            kml += '      </Point>\n'
            kml += '    </Placemark>\n'

        kml += '  </Document>\n'
        kml += '</kml>'

        # Aquí puedes procesar el KML como desees, como guardarlo en un archivo o imprimirlo.

        ruta_int += 1

# Ruta al archivo XML
xml_file_path = 'xml/rutas.xml'  # Reemplaza 'tu_archivo.xml' con la ruta de tu archivo XML real

convert_xml_to_kml(xml_file_path)
