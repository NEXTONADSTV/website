import requests
from bs4 import BeautifulSoup
import re

def fetch_content_from_url(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Lanza una excepción para códigos de estado HTTP erróneos
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error al obtener contenido de {url}: {e}")
        return None

def extract_announcement_content():
    index_html_url = "https://raw.githubusercontent.com/NEXTONADSTV/website/main/index.html"
    info_js_url = "https://raw.githubusercontent.com/NEXTONADSTV/website/main/info.js"

    announcement_parts = []

    # Extraer del index.html
    index_html_content = fetch_content_from_url(index_html_url)
    if index_html_content:
        soup = BeautifulSoup(index_html_content, 'html.parser')
        title = soup.find('title')
        if title: announcement_parts.append(f"¡Bienvenido a {title.text.replace(' · streaming oficial', '')}!")
        tagline = soup.find('div', class_='tagline')
        if tagline: announcement_parts.append(tagline.get_text(strip=True))
        footer = soup.find('div', class_='footer-minimal')
        if footer: announcement_parts.append(footer.get_text(strip=True))

    # Extraer del info.js
    info_js_content = fetch_content_from_url(info_js_url)
    if info_js_content:
        # Buscar el texto dentro de las etiquetas <p>
        paragraphs = re.findall(r'<p>(.*?)</p>', info_js_content, re.DOTALL)
        for p in paragraphs:
            clean_p = BeautifulSoup(p, 'html.parser').get_text(strip=True)
            if clean_p: announcement_parts.append(clean_p)

    # Formatear el anuncio
    if announcement_parts:
        full_announcement = "\n\n".join(announcement_parts)
        return full_announcement
    return "Descubre lo nuevo en NEXTON ADS TV. ¡Visítanos!"

if __name__ == "__main__":
    announcement = extract_announcement_content()
    print(announcement)
