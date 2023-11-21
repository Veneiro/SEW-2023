import os

def buscar_terminos(directorio, extensiones, terminos):
    for nombre_archivo in os.listdir(directorio):
        ruta_archivo = os.path.join(directorio, nombre_archivo)
        if os.path.isfile(ruta_archivo) and nombre_archivo.endswith(tuple(extensiones)):
            with open(ruta_archivo, 'r', encoding='utf-8') as archivo:
                lineas = archivo.readlines()
                for num_linea, linea in enumerate(lineas, start=1):
                    contador_linea = 0  # Inicializar el contador para cada línea
                    for termino in terminos:
                        if termino.lower() in linea.lower():
                            contador_linea += 1
                            print(f'El término "{termino}" se encontró en el archivo: {ruta_archivo}')
                            print(f'Línea {num_linea}: {linea.strip()}')
                            print(f'Ocurrencia #{contador_linea}')
                            print('---')

if __name__ == '__main__':
    directorio = 'C:/Users/Mateo/Documents/GitHub/PRACTICA-3/ProyectoSEW'  # Reemplaza con la ruta del directorio que deseas explorar
    extensiones = ['.html', '.js', '.css', '.php']  # Reemplaza con las extensiones de archivo que deseas buscar
    terminos = []

    # Leer los términos desde el archivo 'terminos.txt'
    with open('terminos.txt', 'r', encoding='utf-8') as archivo_terminos:
        for linea in archivo_terminos:
            termino = linea.strip()
            if termino:
                terminos.append(termino)

    for root, _, files in os.walk(directorio):
        for file in files:
            buscar_terminos(root, extensiones, terminos)
            break  # Ignorar subdirectorios
