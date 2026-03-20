/**
 * NEXTON ADS TV - Telegram Bot
 * Token: 8587610893:AAG9I1okgIKo3vjW3kEq5s4Jhhy4RDmUNtw
 * Funcionalidad: Información de la plataforma, catálogo y soporte.
 */

const TelegramBot = require('node-telegram-bot-api');

// Reemplazar con el token proporcionado
const token = '8587610893:AAG9I1okgIKo3vjW3kEq5s4Jhhy4RDmUNtw';

// Crear el bot
const bot = new TelegramBot(token, {polling: true});

console.log('NEXTON ADS TV Bot iniciado...');

// Comandos principales
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `
◈ ¡Bienvenido a NEXTON ADS TV! ◈

Tu plataforma de streaming independiente en evolución.

Comandos disponibles:
/inicio - Información general de la plataforma.
/catalogo - Ver series y contenido destacado.
/apk - Descargar la aplicación oficial para Android.
/canal - Unirse al canal oficial de novedades.
/soporte - Contactar con el equipo de NEXTON.
    `;
    bot.sendMessage(chatId, welcomeMessage);
});

bot.onText(/\/inicio/, (msg) => {
    const chatId = msg.chat.id;
    const info = `
📺 NEXTON ADS TV es una experiencia de streaming original y minimalista.
Nuestro catálogo está en constante evolución, ofreciendo contenido independiente de alta calidad.

🌐 Web oficial: https://nextonadstv.github.io/website
    `;
    bot.sendMessage(chatId, info);
});

bot.onText(/\/catalogo/, (msg) => {
    const chatId = msg.chat.id;
    const catalog = `
🎬 Catálogo NEXTON:
- Bruma Nocturna (Thriller)
- Código Nexus (Ciencia Ficción)
- Ritual Analógico (Terror)
- Última Temporada (Drama)

Explora el catálogo completo en nuestra web.
    `;
    bot.sendMessage(chatId, catalog);
});

bot.onText(/\/apk/, (msg) => {
    const chatId = msg.chat.id;
    const apkInfo = `
📱 Descarga NEXTON ADS TV para Android:
Disfruta de la mejor experiencia nativa, optimizada y funcional.

🔗 Enlace de descarga: https://nextonadstv.github.io/website/apk/NextonAdsTV.apk
    `;
    bot.sendMessage(chatId, apkInfo);
});

bot.onText(/\/canal/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '📢 Únete a nuestro canal oficial para no perderte ningún estreno: https://t.me/nextonadstv_channel');
});

bot.onText(/\/soporte/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '✉️ Para soporte o sugerencias, escríbenos a: nexton@ads.tv');
});

// Manejo de mensajes generales
bot.on('message', (msg) => {
    if (msg.text && !msg.text.startsWith('/')) {
        bot.sendMessage(msg.chat.id, '◈ Usa los comandos del menú para explorar NEXTON ADS TV.');
    }
});
