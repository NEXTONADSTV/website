import requests
import json
import sqlite3
import time
import threading
import os

# Importar el extractor de contenido del sitio web
import website_content_extractor

TOKEN = "8587610893:AAG9I1okgIKo3vjW3kEq5s4Jhhy4RDmUNtw"
BASE_URL = f"https://api.telegram.org/bot{TOKEN}/"

# Ruta al repositorio clonado de GitHub


def send_message(chat_id, text):
    url = BASE_URL + "sendMessage"
    payload = {"chat_id": chat_id, "text": text}
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status() # Lanza una excepción para códigos de estado HTTP erróneos
    except requests.exceptions.RequestException as e:
        print(f"Error al enviar mensaje a {chat_id}: {e}")

def is_bot_admin(chat_id):
    url = BASE_URL + "getChatAdministrators"
    payload = {"chat_id": chat_id}
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        if data["ok"]:
            for admin in data["result"]:
                if admin["user"]["is_bot"] and admin["user"]["id"] == int(TOKEN.split(":")[0]):
                    # Check if the bot has the necessary permissions to post messages
                    if admin.get("can_post_messages", False) or admin.get("can_edit_messages", False) or admin.get("can_send_messages", False):
                        return True
            return False
        else:
            print(f"Error al obtener administradores del chat {chat_id}: {data.get(\'description\')}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"Error de conexión al verificar admin en {chat_id}: {e}")
        return False

def process_update(update):
    if "message" not in update:
        return

    message = update["message"]
    chat_id = message["chat"]["id"]
    chat_type = message["chat"]["type"]
    text = message.get("text", "")
    
    conn = sqlite3.connect("bot_data.db")
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO chats (chat_id, chat_type, title, username, last_message_date) VALUES (?, ?, ?, ?, ?)",
                   (chat_id, chat_type, message["chat"].get("title"), message["chat"].get("username"), int(time.time())))
    conn.commit()
    conn.close()

    if text.startswith("/start"):
        send_message(chat_id, "¡Hola! Soy NEXTON | BOT. Usa /help para ver los comandos disponibles.")
    elif text.startswith("/help"):
        help_text = (
            "Comandos disponibles:\n"
            "/start - Inicia el bot y muestra un mensaje de bienvenida.\n"
            "/help - Muestra esta ayuda.\n"
            "/add_announcement <ID_CHAT> - Añade un chat (canal/grupo) para recibir anuncios automáticos de la plataforma. (Requiere que el bot sea administrador con permiso para publicar mensajes)\n"
            "/remove_announcement <ID_CHAT> - Elimina un chat de la lista de anuncios.\n"
            "/list_announcements - Muestra los chats registrados para anuncios."
        )
        send_message(chat_id, help_text)
    elif text.startswith("/add_announcement"):
        parts = text.split()
        if len(parts) == 2:
            target_chat_id = parts[1]
            try:
                target_chat_id = int(target_chat_id)
                if is_bot_admin(target_chat_id):
                    conn = sqlite3.connect("bot_data.db")
                    cursor = conn.cursor()
                    # El mensaje se extraerá dinámicamente, aquí solo registramos el chat
                    cursor.execute("INSERT OR REPLACE INTO scheduled_announcements (chat_id, message_text, last_sent_date) VALUES (?, ?, ?)",
                                   (target_chat_id, "", 0)) # message_text vacío, se llenará dinámicamente
                    conn.commit()
                    conn.close()
                    send_message(chat_id, f"Chat {target_chat_id} añadido para anuncios automáticos de la plataforma.")
                else:
                    send_message(chat_id, f"El bot no es administrador en el chat {target_chat_id} o no tiene permisos para publicar mensajes. Asegúrate de otorgarle los permisos necesarios.")
            except ValueError:
                send_message(chat_id, "ID de chat inválido. Por favor, proporciona un número.")
        else:
            send_message(chat_id, "Uso: /add_announcement <ID_CHAT>")
    elif text.startswith("/remove_announcement"):
        parts = text.split()
        if len(parts) == 2:
            target_chat_id = parts[1]
            try:
                target_chat_id = int(target_chat_id)
                conn = sqlite3.connect("bot_data.db")
                cursor = conn.cursor()
                cursor.execute("DELETE FROM scheduled_announcements WHERE chat_id = ?", (target_chat_id,))
                conn.commit()
                conn.close()
                send_message(chat_id, f"Chat {target_chat_id} eliminado de la lista de anuncios.")
            except ValueError:
                send_message(chat_id, "ID de chat inválido. Por favor, proporciona un número.")
        else:
            send_message(chat_id, "Uso: /remove_announcement <ID_CHAT>")
    elif text.startswith("/list_announcements"):
        conn = sqlite3.connect("bot_data.db")
        cursor = conn.cursor()
        cursor.execute("SELECT chat_id FROM scheduled_announcements")
        announcements = cursor.fetchall()
        conn.close()
        if announcements:
            announcement_list = "Chats registrados para anuncios automáticos:\n"
            for chat_id_tuple in announcements:
                announcement_list += f"- ID: {chat_id_tuple[0]}\n"
            send_message(chat_id, announcement_list)
        else:
            send_message(chat_id, "No hay chats registrados para anuncios automáticos.")
    else:
        send_message(chat_id, "Comando no reconocido. Usa /help para ver los comandos.")

def get_updates(offset=None):
    url = BASE_URL + "getUpdates"
    params = {"timeout": 30, "offset": offset}
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error al obtener actualizaciones: {e}")
        return {"ok": False, "result": []}

def send_scheduled_announcements():
    conn = sqlite3.connect("bot_data.db")
    cursor = conn.cursor()
    cursor.execute("SELECT chat_id, last_sent_date FROM scheduled_announcements")
    announcements_data = cursor.fetchall()
    current_time = int(time.time())

    # Extraer el contenido del anuncio una vez por ciclo
    announcement_message = website_content_extractor.extract_announcement_content()

    for chat_id, last_sent_date in announcements_data:
        # Enviar cada 12 horas (43200 segundos)
        if current_time - last_sent_date >= 43200:
            print(f"Enviando anuncio a {chat_id}: {announcement_message}")
            send_message(chat_id, announcement_message)
            cursor.execute("UPDATE scheduled_announcements SET last_sent_date = ? WHERE chat_id = ?", (current_time, chat_id))
            conn.commit()
    conn.close()

def announcement_scheduler():
    while True:
        send_scheduled_announcements()
        time.sleep(60) # Comprobar cada minuto si hay anuncios pendientes

def main():
    # Iniciar el hilo para el programador de anuncios
    scheduler_thread = threading.Thread(target=announcement_scheduler)
    scheduler_thread.daemon = True # Permite que el programa principal se cierre incluso si este hilo está en ejecución
    scheduler_thread.start()

    offset = None
    while True:
        updates = get_updates(offset)
        if updates["ok"] and updates["result"]:
            for update in updates["result"]:
                process_update(update)
                offset = update["update_id"] + 1
        time.sleep(1) # Esperar 1 segundo antes de la siguiente consulta

if __name__ == "__main__":
    import database_setup
    database_setup.setup_database()
    print("Bot de Telegram iniciado. Escuchando actualizaciones...")
    main()
