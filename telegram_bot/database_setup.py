import sqlite3

def setup_database():
    conn = sqlite3.connect('bot_data.db')
    cursor = conn.cursor()

    # Tabla para almacenar información de chats (grupos y usuarios privados)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chats (
            chat_id INTEGER PRIMARY KEY,
            chat_type TEXT NOT NULL,
            title TEXT,
            username TEXT,
            last_message_date INTEGER
        )
    ''')

    # Tabla para almacenar los anuncios programados
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS scheduled_announcements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_id INTEGER NOT NULL,
            message_text TEXT NOT NULL,
            last_sent_date INTEGER,
            FOREIGN KEY (chat_id) REFERENCES chats(chat_id)
        )
    ''')

    conn.commit()
    conn.close()
    print("Base de datos 'bot_data.db' configurada exitosamente.")

if __name__ == "__main__":
    setup_database()
