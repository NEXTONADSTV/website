import requests
import json
import sqlite3
import time
import threading

TOKEN = "8587610893:AAG9I1okgIKo3vjW3kEq5s4Jhhy4RDmUNtw"
BASE_URL = f"https://api.telegram.org/bot{TOKEN}/"

def send_message(chat_id, text):
    url = BASE_URL + "sendMessage"
    payload = {"chat_id": chat_id, "text": text}
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status() # Lanza una excepción para códigos de estado HTTP erróneos
    except requests.exceptions.RequestException as e:
        print(f"Error al enviar mensaje a {chat_id}: {e}")

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
            "/add_announcement <ID_CHAT> <MENSAJE> - Añade un chat (canal/grupo) para recibir anuncios y define el mensaje. (Requiere ser admin del chat)\n"
            "/remove_announcement <ID_CHAT> - Elimina un chat de la lista de anuncios.\n"
            "/list_announcements - Muestra los chats registrados para anuncios."
        )
        send_message(chat_id, help_text)
    elif text.startswith("/add_announcement"):
        parts = text.split(maxsplit=2)
        if len(parts) == 3:
            target_chat_id = parts[1]
            announcement_message = parts[2]
            try:
                target_chat_id = int(target_chat_id)
                conn = sqlite3.connect("bot_data.db")
                cursor = conn.cursor()
                cursor.execute("INSERT OR REPLACE INTO scheduled_announcements (chat_id, message_text, last_sent_date) VALUES (?, ?, ?)",
                               (target_chat_id, announcement_message, 0)) # 0 para que se envíe inmediatamente la primera vez
                conn.commit()
                conn.close()
                send_message(chat_id, f"Chat {target_chat_id} añadido para anuncios con el mensaje: '{announcement_message}'.")
            except ValueError:
                send_message(chat_id, "ID de chat inválido. Por favor, proporciona un número.")
        else:
            send_message(chat_id, "Uso: /add_announcement <ID_CHAT> <MENSAJE>")
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
        cursor.execute("SELECT chat_id, message_text FROM scheduled_announcements")
        announcements = cursor.fetchall()
        conn.close()
        if announcements:
            announcement_list = "Chats registrados para anuncios:\n"
            for chat_id, message_text in announcements:
                announcement_list += f"- ID: {chat_id}, Mensaje: '{message_text}'\n"
            send_message(chat_id, announcement_list)
        else:
            send_message(chat_id, "No hay chats registrados para anuncios.")
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
    cursor.execute("SELECT chat_id, message_text, last_sent_date FROM scheduled_announcements")
    announcements = cursor.fetchall()
    current_time = int(time.time())

    for chat_id, message_text, last_sent_date in announcements:
        # Enviar cada 12 horas (43200 segundos)
        if current_time - last_sent_date >= 43200:
            print(f"Enviando anuncio a {chat_id}: {message_text}")
            send_message(chat_id, message_text)
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
